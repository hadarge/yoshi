### Core principles for contributing to create-yoshi-app's templates

We try to carefully consider the following principles before adding or changing the code of the templates.

- **Should contain minimum boilerplate code**: The more code we generate, the longer it takes for developers to read and understand all of it.
- **Should only contain code that developers can change**: The templates should only include code we expect developers to understand and possibly change in the future. Generating code that developers should not change is considered a "library code". If we need to change something in the future it will be in one place (in the library), rather than migrating a lot of apps.
- **Should help developers learn by best practices**: Code we put in the templates has a very big impact. Usually, developers will consider it as a best practice and duplicate it across their apps.
- **Should only contain code that is relevant to every project**: Asking users to understand code that they might not ever need and delete it is something we should try to avoid.
- **Strive for small learning curve**: `create-yoshi-app` should help developers get started quickly. We expect developers to understand every part of their app, The more concepts they're required to understand in a new project, the longer it takes them to start developing.
