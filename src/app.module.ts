import { Module } from '@nestjs/common';
import { RolesGuard } from './common/guards/roles.guard';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { User } from './entities/user.entity';
import { Reservation } from './entities/reservation.entity';
import { AuthModule } from './modules/auth/auth.module';
import { MentorshipsModule } from './modules/mentorships/mentorships.module';
import { ReservationsModule } from './modules/reservations/reservations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Reservation],
      synchronize: true, //pasar a false en producción
      logging: false,
    }),
    UsersModule,
    AuthModule,
    MentorshipsModule,
    ReservationsModule,
    // ReservationsModule will handle DB-backed reservations
    // created below
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule {}
