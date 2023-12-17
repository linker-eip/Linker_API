import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { CompanyModule } from './company/company.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';
import { FileModule } from './filesystem/file.module';
import { FileController } from './filesystem/file.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'
import { MissionModule } from './mission/mission.module';
import { SiretService } from './siret/siret.service';
import { SiretController } from './siret/siret.controller';
import { InvoiceModule } from './invoice/invoice.module';
import { GroupController } from './group/group.controller';
import { GroupService } from './group/group.service';
import { GroupModule } from './group/group.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DocumentTransferModule } from './document-transfer/src/document-transfer.module';
import { DocumentTransferService } from './document-transfer/src/services/document-transfer.service';
import { DocumentTransferController } from './document-transfer/src/document-transfer.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        migrations: [__dirname + '/db/migrations/*{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../' + 'linker_external'),
    }),
    AuthModule,
    StudentModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CompanyModule,
    MailModule,
    AdminModule,
    FileModule,
    MissionModule,
    InvoiceModule,
    GroupModule,
    NotificationsModule,
    DocumentTransferModule
  ],
  controllers: [FileController, SiretController, DocumentTransferController],
  providers: [JwtStrategy, SiretService],
})
export class AppModule {}
