import { VaultCredentials } from './vault.credentials';
import { VaultConfig } from 'hashi-vault-js';

export interface VaultInitOptions {
    credentials: VaultCredentials;
    config: VaultConfig;
}
