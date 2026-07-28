import { Module } from '@nestjs/common';
import { SlogansController } from './slogans.controller';
import { SlogansService } from './slogans.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Slogan, SloganSchema } from './schemas/slogan.schema';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Slogan.name, schema: SloganSchema}
    ]),
    CategoriesModule
  ],
  controllers: [SlogansController],
  providers: [SlogansService]
})
export class SlogansModule {}
