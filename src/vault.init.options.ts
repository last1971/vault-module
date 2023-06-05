import { VaultCredentials } from './vault.credentials';
import { VaultConfig } from 'hashi-vault-js';

export interface VaultInitOptions {
    credentials: VaultCredentials;
    config: VaultConfig;
}

export const VAULT_INIT_OPTIONS = 'VAULT_INIT_OPTIONS'
