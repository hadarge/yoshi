# How do I add automatic AB tests to textual content?

[AB-translate](https://github.com/wix-private/fed-infra/tree/master/ab-translate) lets product managers and content writers create AB Tests for textual content, in [Babel](https://bo.wix.com/wix-babel-webapp/babel), without the need of a developer.

Yoshi's `petri-specs` task uses the ab-translate library to check which translation keys are ab-tested and automatically creates specs in petri.

**Note**: There is a onetime setup per project that a developer needs to implement which is detailed in ab-translate's readme.
