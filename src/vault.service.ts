import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Vault from 'hashi-vault-js';
import { Cron } from '@nestjs/schedule';
import { VaultCredentials } from './vault.credentials';
import { VaultInitOptions } from './vault.init.options';
import { VAULT_INIT_OPTIONS } from './vault.module.definition';

@Injectable()
export class VaultService implements OnModuleInit {
    private vault: Vault;
    private credentials: VaultCredentials;
    private data: any = {};
    constructor(@Inject(VAULT_INIT_OPTIONS) private initOptions: VaultInitOptions) {
        this.credentials = initOptions.credentials;
        this.vault = new Vault(initOptions.config);
    }
    async onModuleInit(): Promise<any> {
        await this.login();
    }
    private async login() {
        let isAxiosError = true;
        let response: any;
        const start = Date.now();
        const timeout = 60000; // 1 минута
        while (isAxiosError) {
            if (Date.now() - start > timeout) {
                throw new Error('VaultService не загрузился за 1 минуту');
            }
            try {
                response = await this.vault.loginWithUserpass(
                    this.credentials.user,
                    this.credentials.password,
                    'auth/userpass',
                );
                isAxiosError = false;
            } catch (e) {
                if (e.name !== 'AxiosError') {
                    throw e;
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.credentials.token = response.client_token;
    }
    private async withAuth<T>(fn: () => PromiseLike<T>): Promise<T> {
        if (!this.credentials.token) {
            await this.login();
        }
        try {
            return await fn();
        } catch (e) {
            if (e?.response?.status === 401 || e?.response?.status === 403) {
                await this.login();
                return await fn();
            }
            throw e;
        }
    }
    async get(path: string): Promise<Record<string, unknown>> {
        if (!this.data[path]) {
            const response = await this.withAuth(() =>
                this.vault.readKVSecret(this.credentials.token, path),
            );
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
