import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ description: 'Username', example: 'admin' })
    @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    username: string;

    @ApiProperty({ description: 'Password', example: 'admin123' })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
