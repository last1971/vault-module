import { VaultService } from './vault.service';
import { Test, TestingModule } from '@nestjs/testing';
import { VaultInitOptions } from './vault.init.options';
import Vault from 'hashi-vault-js';
import { VaultConfig } from './vault.config';

const loginWithUserpass = jest.spyOn(Vault.prototype, 'loginWithUserpass').mockImplementation(async () => ({
    client_token: 'test_token',
    accessor: 'string',
    policies: [],
    metadata: {
        username: 'string',
    },
    lease_duration: 3600,
    renewable: true,
}));
const readKVSecret = jest.spyOn(Vault.prototype, 'readKVSecret').mockImplementation(async () => ({
    data: { test: 'test' },
    metadata: {
        created_time: '',
        custom_metadata: null,
        deletion_time: '',
        destroyed: false,
        version: 1,
    },
}));

describe('Vault Service', () => {
    let service: VaultService;
    const config: VaultConfig = {
        baseUrl: '', https: false, proxy: false,
        rootPath: 'test',
        timeout: 0
    };
    const init: VaultInitOptions = {
        config,
        credentials: { user: 'user', password: 'pass' },
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: VaultService, useValue: new VaultService(init) }],
        }).compile();

        service = module.get<VaultService>(VaultService);

        loginWithUserpass.mockClear();
        readKVSecret.mockClear();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('test get', async () => {
        await service.get('test');
        const res = await service.get('test');
        expect(loginWithUserpass.mock.calls).toHaveLength(1);
        expect(readKVSecret.mock.calls).toHaveLength(1);
        expect(loginWithUserpass.mock.calls[0]).toEqual(['user', 'pass', 'auth/userpass']);
        expect(readKVSecret.mock.calls[0]).toEqual(['test_token', 'test']);
        expect(res).toEqual({ test: 'test' });
    });

    it('clear cache', async () => {
        await service.get('test');
        service.clearCache();
        await service.get('test');
        // expect(loginWithUserpass.mock.calls).toHaveLength(1);
        expect(readKVSecret.mock.calls).toHaveLength(2);
    });
});
