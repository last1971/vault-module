import { ConfigurableModuleBuilder } from '@nestjs/common';
import { VaultInitOptions } from './vault.init.options';

export const { ConfigurableModuleClass: ConfigurableVaultModule, MODULE_OPTIONS_TOKEN: VAULT_INIT_OPTIONS } =
    new ConfigurableModuleBuilder<VaultInitOptions>().setClassMethodName('forRoot').build();
