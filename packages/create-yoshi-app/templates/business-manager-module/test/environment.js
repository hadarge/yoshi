import 'regenerator-runtime/runtime';
import {
  createTestkit,
  testkitConfigBuilder,
  ModuleConfigFileEmitter,
} from '@wix/business-manager/dist/testkit';

const getTestkitConfig = async () => {
  const serverUrl = 'http://localhost:3200/';
  const path = './templates/module_{%PROJECT_NAME%}.json.erb';
  const serviceId = 'com.wixpress.{%projectName%}-app';

  const moduleConfig = await new ModuleConfigFileEmitter(path)
    .registerStaticService({ serviceId, serverUrl })
    .emit();

  return testkitConfigBuilder()
    .withModulesConfig(moduleConfig)
    .autoLogin()
    .build();
};

export const environment = async () => {
  const testkit = createTestkit(await getTestkitConfig());
  return {
    start: () => testkit.start(),
    stop: () => testkit.stop(),
    businessManager: testkit,
  };
};
