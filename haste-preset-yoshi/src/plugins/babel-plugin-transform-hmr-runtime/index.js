/* eslint-disable new-cap */

const nodePath = require('path');

const RENDER_NAME = 'render';
const HOT_LOADER_METHOD = 'hot';
const HOT_LOADER_PATH = 'react-hot-loader';

module.exports = function ({types: t}) {
  const isRender = (type, renderName = RENDER_NAME) => {
    return type === renderName;
  };

  const isRenderMethodCall = (path, target) => {
    if (!target || !t.isMemberExpression(path.node.callee)) {
      return false;
    }
    const callee = path.node.callee;
    return target === callee.object.name && isRender(callee.property.name);
  };

  const withEntry = (entryFiles, fileName) => {
    const resolvedTarget = nodePath.resolve(fileName);
    return entryFiles.some(entryFile => {
      const resolvedEntry = nodePath.resolve(entryFile);
      return resolvedTarget.startsWith(resolvedEntry);
    });
  };

  const requiresFor = (node, target) => {
    const firstArgument = node.arguments[0];
    return node.callee.name === 'require' && firstArgument && firstArgument.value === target;
  };

  const createAcceptModuleCall = () => {
    const moduleHot = t.memberExpression(t.identifier('module'), t.identifier('hot'));
    const moduleHotAccept = t.memberExpression(moduleHot, t.identifier('accept'));
    return t.ifStatement(
      moduleHot,
      t.blockStatement([t.expressionStatement(t.callExpression(moduleHotAccept, []))])
    );
  };

  const isRenderCall = (path, renderWasImported) => {
    return renderWasImported && isRender(path.node.callee.name, renderWasImported);
  };

  // const isHocImport = (path, declaration) => {
  //   return path.node.imported.name === HOT_LOADER_METHOD && declaration.node.source.value === HOT_LOADER_PATH;
  // };

  const isValidTargetToWrap = target => {
    return t.isJSXElement(target.node);
  };

  const isAcceptModuleCall = path => {
    return t.isCallExpression(path.node) &&
      t.isMemberExpression(path.node.callee) &&
      t.isMemberExpression(path.node.callee.object) &&
      path.node.callee.property.name === 'accept' &&
      path.node.callee.object.property.name === 'hot' &&
      path.node.callee.object.object.name === 'module';
  };

  const wrapInArrowWithProps = (children, scope) => {
    const props = scope.generateDeclaredUidIdentifier('props');
    const restEl = t.restElement(props);
    children.openingElement.attributes.push(
      t.JSXSpreadAttribute(props)
    );
    return t.arrowFunctionExpression([restEl], children);
  };

  const wrapInHMRHoc = (children, scope) => {
    return t.callExpression(
      t.callExpression(
        t.identifier(HOT_LOADER_METHOD),
        [t.identifier('module')]
      ),
      [wrapInArrowWithProps(children, scope)]
    );
  };

  const wrapInCreateClassCall = child => {
    return t.callExpression(t.memberExpression(
      t.identifier('React'),
      t.identifier('createElement')
    ), [child]);
  };

  const findRenderVariableFromProps = (props, variable) => {
    const prop = props.find(property => {
      return property.key.name === variable;
    });
    return prop ? prop.value.name : null;
  };

  // const findRenderVariableFromSpecifiers = specifiers => {
  // 	const prop = props.find(property => {
  //     return property.key.name === 'render';
  //   });
  //   return prop ? prop.value.name : null;
  // };

  const createNamedImport = (name, prop, path) => {
    return t.importDeclaration(
      [t.importSpecifier(t.identifier(name), t.identifier(name))],
      t.stringLiteral(path)
    );
  };

  return {
    name: 'hmr-transform', // not required
    pre() {
      this.renderWasImported = null;
      this.reactDOMVariableName = null;
      this.hotWasImported = false;
      this.hotWasUsed = false;
    },
    visitor: {
      ImportDeclaration(path) {
        const sourceValue = path.node.source.value;
        const importFromReactDOM = sourceValue === 'react-dom';
        const importFromReactHotLoader = sourceValue === 'react-hot-loader';

        path.get('specifiers').forEach(specifier => {
          if (importFromReactDOM && t.isImportNamespaceSpecifier(specifier.node)) {
            this.reactDOMVariableName = specifier.node.local.name;
          } else if (t.isImportSpecifier(specifier.node)) {
            if (importFromReactDOM && isRender(specifier.node.imported.name)) {
              this.renderWasImported = specifier.node.local.name;
            } else if (importFromReactHotLoader) { //  && isHocImport(specifier, path)
              this.hotWasImportedByUser = true;
              this.hotWasImported = true;
            }
          }
        });
      },
      Program: {
        exit(path) {
          if (!this.hotWasImported && this.hotWasUsed) {
            path.node.body.unshift(
              createNamedImport(HOT_LOADER_METHOD, HOT_LOADER_METHOD, HOT_LOADER_PATH)
            );
            this.hotWasImported = true;
          }
          const entryFiles = this.opts.entryFiles || [];
          const fileName = this.file.opts.filename;
          if (withEntry(entryFiles, fileName) && !this.hotWasAccepted) {
            path.node.body.push(
              createAcceptModuleCall(),
            );
            this.hotWasAccepted = true;
          }
        }
      },
      CallExpression(path) {
        // user already imported hoc, so seems like he want to use it by his own.
        if (this.hotWasImportedByUser) {
          return;
        }
        if (isAcceptModuleCall(path)) {
          this.hotWasAccepted = true;
          return;
        }
        const requireFromReactDOM = requiresFor(path.node, 'react-dom');
        const requireFromReactHotLoader = requiresFor(path.node, 'react-hot-loader');
        if (requireFromReactDOM && t.isIdentifier(path.parent.id)) {
          this.reactDOMVariableName = path.parent.id.name;
        } else if (t.isObjectPattern(path.parent.id)) {
          this.renderWasImported = findRenderVariableFromProps(path.parent.id.properties, 'render');
          if (requireFromReactDOM && isRender(path.parent.id.name, this.renderWasImported)) {
            this.renderWasImported = true;
          } else if (requireFromReactHotLoader) { // check for hot var
            this.hotWasImportedByUser = true;
            this.hotWasImported = true;
          }
        }

        if (isRenderCall(path, this.renderWasImported) || isRenderMethodCall(path, this.reactDOMVariableName)) {
          const reactRootElement = path.get('arguments.0');
          if (!isValidTargetToWrap(reactRootElement)) {
            return;
          }
          const wrappedReactRootElement = wrapInCreateClassCall(wrapInHMRHoc(reactRootElement.node, path.scope));
          reactRootElement.replaceWith(wrappedReactRootElement);
          this.hotWasUsed = true;
          return;
        }
      }
    }
  };
};
