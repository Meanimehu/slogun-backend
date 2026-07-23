import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { SlogansModule } from './slogans/slogans.module';
import { MongooseModule } from '@nestjs/mongoose';   
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService]
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    SlogansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
