import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Hardcoded users as per assignment requirements
const USERS = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' },
];

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    /**
     * Validate user credentials
     */
    async validateUser(username: string, password: string): Promise<any> {
        const user = USERS.find(
            (u) => u.username === username && u.password === password,
        );

        if (!user) {
            return null;
        }

        const { password: _, ...result } = user;
        return result;
    }

    /**
     * Login and return JWT token
     */
    async login(username: string, password: string) {
        const user = await this.validateUser(username, password);

        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }

        const payload = { sub: user.id, username: user.username, role: user.role };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        };
    }
}
