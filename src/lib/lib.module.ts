import { Module } from '@nestjs/common';
import { LibService } from './lib.service';

@Module({
  providers: [LibService]
})
export class LibModule {}
