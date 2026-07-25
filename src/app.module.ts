import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { SlogansModule } from './slogans/slogans.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    // Load .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        
        console.log('🔌 Connecting to MongoDB...');
        console.log(`   URI: ${uri?.replace(/\/\/.*@/, '//****:****@')}`);
        
        return {
          uri,
          serverSelectionTimeoutMS: 10000,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              console.log('✅ MongoDB connected!');
              console.log(`   Database: ${connection.db.databaseName}`);
            });
            connection.on('error', (error) => {
              console.error('❌ MongoDB error:', error.message);
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    CategoriesModule,
    SlogansModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply JWT Guard to ALL routes by default
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}