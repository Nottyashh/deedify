import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuthenticatedUser } from './auth.service';
declare const AuthStrategy_base: new (...args: any[]) => Strategy;
export declare class AuthStrategy extends AuthStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: any): Promise<AuthenticatedUser>;
}
export {};
