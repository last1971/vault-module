import { VaultCredentials } from './vault.credentials';
import { VaultConfig } from './vault.config';


export interface VaultInitOptions {
    credentials: VaultCredentials;
    config: VaultConfig;
}
