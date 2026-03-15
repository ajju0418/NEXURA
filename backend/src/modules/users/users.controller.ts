import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    @ApiOperation({ summary: 'Get user profile' })
    async getProfile(@CurrentUser('id') userId: string) {
        return this.usersService.getProfile(userId);
    }

    @Put('profile')
    @ApiOperation({ summary: 'Update user profile' })
    async updateProfile(@CurrentUser('id') userId: string, @Body() data: any) {
        return this.usersService.updateProfile(userId, data);
    }

    @Get('settings')
    @ApiOperation({ summary: 'Get user settings' })
    async getSettings(@CurrentUser('id') userId: string) {
        return this.usersService.getSettings(userId);
    }

    @Put('settings')
    @ApiOperation({ summary: 'Update user settings' })
    async updateSettings(@CurrentUser('id') userId: string, @Body() data: any) {
        return this.usersService.updateSettings(userId, data);
    }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get dashboard stats' })
    async getDashboardStats(@CurrentUser('id') userId: string) {
        return this.usersService.getDashboardStats(userId);
    }
}
