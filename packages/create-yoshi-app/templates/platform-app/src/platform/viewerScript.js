const CONTROLLER_TYPE = '';

const createAppController = ({
  $w,
  wixCodeApi,
  platformApi,
  setProps,
  config,
}) => {
  return {
    async pageReady() {},
  };
};

const controllerByType = {
  [CONTROLLER_TYPE]: createAppController,
};

/**
 * @param controllerConfigs: controllerConfig[]
 * @returns Controller[] | Promise<Controller>[]
 */
function createControllers(controllerConfigs) {
  return controllerConfigs.map(controllerByType[config.type]);
}

export default {
  createControllers,
};
