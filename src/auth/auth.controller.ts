import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { Public } from './public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Login with username and password' })
    @ApiResponse({
        status: 200,
        description: 'Returns JWT token',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: { id: 1, username: 'admin', role: 'admin' },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @Public()
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto.username, dto.password);
    }
}
