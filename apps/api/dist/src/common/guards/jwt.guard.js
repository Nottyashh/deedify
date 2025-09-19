"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtAuthGuard_1, AdminGuard_1, ListerGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListerGuard = exports.AdminGuard = exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(JwtAuthGuard_1.name);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            request['user'] = payload;
            return true;
        }
        catch (error) {
            this.logger.warn(`JWT verification failed: ${error.message}`);
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], JwtAuthGuard);
let AdminGuard = AdminGuard_1 = class AdminGuard {
    constructor() {
        this.logger = new common_1.Logger(AdminGuard_1.name);
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        if (user.role !== 'ADMIN') {
            this.logger.warn(`Access denied for user ${user.email} with role ${user.role}`);
            throw new common_1.UnauthorizedException('Admin access required');
        }
        return true;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = AdminGuard_1 = __decorate([
    (0, common_1.Injectable)()
], AdminGuard);
let ListerGuard = ListerGuard_1 = class ListerGuard {
    constructor() {
        this.logger = new common_1.Logger(ListerGuard_1.name);
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        if (!['LISTER', 'ADMIN'].includes(user.role)) {
            this.logger.warn(`Access denied for user ${user.email} with role ${user.role}`);
            throw new common_1.UnauthorizedException('Lister or Admin access required');
        }
        return true;
    }
};
exports.ListerGuard = ListerGuard;
exports.ListerGuard = ListerGuard = ListerGuard_1 = __decorate([
    (0, common_1.Injectable)()
], ListerGuard);
//# sourceMappingURL=jwt.guard.js.map