import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  // Export UsersService and the TypeOrmModule so other modules (e.g. AuthModule)
  // that import UsersModule can inject the repository providers (UserRepository)
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}