// Nest dependencies
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'

// Local files
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { RedisService } from 'src/shared/Services/redis.service'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { MailService } from 'src/shared/Services/mail.service'
import { AuthService } from './Service/auth.service'
import { UserModule } from '../User/user.module'
import { AuthController } from './Controller/auth.controller'
import { JwtStrategy } from './Strategy/jwt.strategy'
import { configService } from 'src/shared/Services/config.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersEntity, UsersRepository]),
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            useFactory: () => {
                return {
                    secret: configService.getEnv('SECRET_FOR_ACCESS_TOKEN'),
                    signOptions: {
                        ...({ expiresIn: configService.getEnv('JWT_EXPIRATION_TIME') }),
                    },
                }
            },
        }),
    ],
    providers: [AuthService, RedisService,  MailService, JwtStrategy],
    controllers: [AuthController],
})

export class AuthModule {}
