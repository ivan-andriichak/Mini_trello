import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { LoginReqDto } from './dto/req/login.req.dto';
import { RegisterReqDto } from './dto/req/register.req.dto';
import { AuthResDto } from './dto/res/auth.res.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private getCookieOptions() {
    const isProd = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      secure: isProd, // secure cookies only in production (requires HTTPS)
      sameSite: isProd ? ('none' as const) : ('lax' as const),
    };
  }

  private setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const cookieOptions = {
      ...this.getCookieOptions(),
      maxAge: 60 * 60 * 1000, // 1h
    };
    res.cookie('accessToken', tokens.accessToken, cookieOptions);
    res.cookie('refreshToken', tokens.refreshToken, {
      ...this.getCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });
  }

  @Post('register')
  async register(
    @Body() dto: RegisterReqDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResDto> {
    const authRes = await this.authService.register(dto);
    this.setAuthCookies(res, authRes.tokens);
    return authRes;
  }

  @Post('login')
  async login(
    @Body() dto: LoginReqDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResDto> {
    const authRes = await this.authService.login(dto);
    this.setAuthCookies(res, authRes.tokens);
    return authRes;
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const newTokens = await this.authService.refresh(refreshToken);
    // set new access token cookie (same options)
    res.cookie('accessToken', newTokens.accessToken, {
      ...this.getCookieOptions(),
      maxAge: 60 * 60 * 1000,
    });
    return { accessToken: newTokens.accessToken };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request) {
    const userId = (req.user as { userId: string })?.userId;

    const user = await this.authService.getUserById(userId);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    const cookieOptions = this.getCookieOptions();
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return { message: 'Logged out' };
  }
}
