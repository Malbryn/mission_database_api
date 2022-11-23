import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enum/user-role.enum';
import { ROLE_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRole = this.reflector.getAllAndOverride<UserRole>(
            ROLE_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRole) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (user) {
            const userRole = this.getUserRole(user);

            return requiredRole <= userRole;
        } else return true;
    }

    private getUserRole(user: User): UserRole {
        if (user['isAdmin']) return UserRole.ADMIN;
        if (user['isStaff']) return UserRole.STAFF;
        if (user['isCreator']) return UserRole.CREATOR;
        if (user['isMember']) return UserRole.MEMBER;

        return UserRole.UNKNOWN;
    }
}
