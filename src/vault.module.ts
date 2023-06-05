import { Global, Module } from '@nestjs/common';
import { VaultService } from './vault.service';
import { ConfigurableVaultModule } from "./vault.module.definition";

@Global()
@Module({
    providers: [VaultService],
    exports: [VaultService],
})
export class VaultModule extends ConfigurableVaultModule {}
