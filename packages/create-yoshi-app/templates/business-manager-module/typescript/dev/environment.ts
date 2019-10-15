import {
  createTestkit,
  testkitConfigBuilder,
  ModuleConfigFileEmitter,
} from '@wix/business-manager/dist/testkit';

interface TestKitConfigOptions {
  withRandomPorts: boolean;
}

const getTestKitConfig = async (
  { withRandomPorts }: TestKitConfigOptions = { withRandomPorts: false },
) => {
  const serverUrl = 'http://localhost:3200/';
  const path = './templates/module_{%PROJECT_NAME%}.json.erb';
  const serviceId = 'com.wixpress.{%projectName%}';

  const moduleConfig = await new ModuleConfigFileEmitter(path)
    .registerStaticService({ serviceId, serverUrl })
    .emit();

  let builder = testkitConfigBuilder()
    .withModulesConfig(moduleConfig)
    .autoLogin();

  if (withRandomPorts) {
    builder = builder.withRandomPorts();
  }

  return builder.build();
};

export const environment = async (envConfig?: TestKitConfigOptions) =>
  createTestkit(await getTestKitConfig(envConfig));
