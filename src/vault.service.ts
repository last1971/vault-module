import { Inject, Injectable } from '@nestjs/common';
import Vault from 'hashi-vault-js';
import { Cron } from '@nestjs/schedule';
import { VaultCredentials } from './vault.credentials';
import { VaultInitOptions } from './vault.init.options';
import { VAULT_INIT_OPTIONS } from './vault.module.definition';

@Injectable()
export class VaultService {
    private vault: Vault;
    private credentials: VaultCredentials;
    private data: any = {};
    constructor(@Inject(VAULT_INIT_OPTIONS) private initOptions: VaultInitOptions) {
        this.credentials = initOptions.credentials;
        this.vault = new Vault(initOptions.config);
    }
    private async login() {
        const response = await this.vault.loginWithUserpass(
            this.credentials.user,
            this.credentials.password,
            'auth/userpass',
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.credentials.token = response.client_token;
    }
    async get(path: string): Promise<Record<string, unknown>> {
        if (!this.credentials.token) {
            await this.login();
        }
        if (!this.data[path]) {
            const response = await this.vault.readKVSecret(this.credentials.token, path);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.data[path] = response.data;
        }
        return this.data[path];
    }
    clearCache(): void {
        this.data = {};
    }
    @Cron('0 0 * * * *')
    private async renewToken(): Promise<void> {
        if (!this.credentials.token) {
            await this.login();
        }
        if (this.credentials.isTokenRenewal) {
            await this.vault.renewSelfToken(this.credentials.token, '1h');
        } else {
            await this.login();
        }
    }
}
