import { DynamicModule, Global, Module } from '@nestjs/common';
import { VaultInitOptions } from './vault.init.options';
import { VaultService } from './vault.service';

@Global()
@Module({})
export class VaultModule {
    static forRoot(options: VaultInitOptions): DynamicModule {
        const providers = [
            {
                provide: VaultService,
                useValue: new VaultService(options),
            },
        ];
        return {
            providers: providers,
            exports: providers,
            module: VaultModule,
        };
    }
}
