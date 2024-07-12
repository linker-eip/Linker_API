import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginStudentDto } from './dto/login-student.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginStudentResponseDto } from './dto/login-student-response.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { LoginCompanyDto } from './dto/login-company.dto';
import { LoginCompanyResponseDto } from './dto/login-company-response.dto';
import { RegisterCompanyResponseDto } from './dto/register-company-response.dto';
import {
  RegisterCompanyDto,
  RegisterCompanyV2Dto,
} from './dto/register-company.dto';
import { ForgetPasswordDto } from '../auth/dto/forget-password.dto';
import { ChangePasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { ForgetPasswordResponseDto } from './dto/forget-password-response.dto';
import { ResetPasswordResponseDto } from './dto/reset-password-response.dto';
import { GoogleLoginDto, GoogleLoginTokenDto } from './dto/google-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('api/auth')
@ApiTags('AUTH')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('student/register')
  @ApiOperation({
    description: 'Student register',
    summary: 'Allow student to create an account',
  })
  @ApiResponse({
    status: 200,
    description: 'Student registered',
    type: LoginStudentResponseDto,
  })
  async registerStudent(@Body() registerStudentDto: RegisterStudentDto) {
    return await this.authService.registerStudent(registerStudentDto);
  }

  @Post('student/verify')
  @ApiOperation({
    description: 'Verify student account',
    summary: 'Verify student account',
  })
  async verifyStudent(@Query('code') code: string) {
    return this.authService.verifyStudent(code);
  }

  @Post('company/register')
  @ApiOperation({
    description: 'Company register',
    summary: 'Allow a company to create an account',
  })
  @ApiResponse({
    status: 200,
    description: 'Company registered',
    type: RegisterCompanyResponseDto,
  })
  async registerCompany(@Body() registerCompanyDto: RegisterCompanyDto) {
    return await this.authService.registerCompany(registerCompanyDto);
  }

  @Post('company/register/v2')
  @ApiOperation({
    description: 'Company register',
    summary: 'Allow a company to create an account',
  })
  @ApiResponse({
    status: 200,
    description: 'Company registered',
    type: RegisterCompanyResponseDto,
  })
  async registerCompanyv2(@Body() registerCompanyDto: RegisterCompanyV2Dto) {
    return await this.authService.registerCompanyv2(registerCompanyDto);
  }

  @Post('student/login')
  @ApiOperation({
    description: 'Student login',
    summary: 'Student login',
  })
  @ApiResponse({
    status: 200,
    description: 'Student login',
    type: LoginStudentResponseDto,
  })
  async loginStudent(@Body() loginStudentDto: LoginStudentDto) {
    const token = await this.authService.loginStudent(loginStudentDto);
    if (!token) {
      throw new HttpException(
        'Mot de passe incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return token;
  }

  @Post('company/login')
  @ApiOperation({
    description: 'Company login',
    summary: 'Company login',
  })
  @ApiResponse({
    status: 200,
    description: 'Company login',
    type: LoginCompanyResponseDto,
  })
  async loginCompany(@Body() loginCompanyDto: LoginCompanyDto) {
    const token = await this.authService.loginCompany(loginCompanyDto);
    if (!token) {
      throw new HttpException(
        'Mot de passe incorrect.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return token;
  }

  @Post('company/forgot-password')
  @ApiOperation({
    description: 'Forgot company password',
    summary: 'Forgot company password',
  })
  @ApiResponse({
    status: 200,
    description: 'Forgot company password',
    type: ForgetPasswordResponseDto,
  })
  async forgotPassword(@Body() body: ForgetPasswordDto) {
    return this.authService.generateCompanyResetPassword(body);
  }

  @Post('company/reset-password')
  @ApiOperation({
    description: 'Reset company password',
    summary: 'Reset company password',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset company password',
    type: ResetPasswordResponseDto,
  })
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetCompanyPassword(body);
  }

  @Post('student/forgot-password')
  @ApiOperation({
    description: 'Forgot student password',
    summary: 'Forgot student password',
  })
  @ApiResponse({
    status: 200,
    description: 'Forgot student password',
    type: ForgetPasswordResponseDto,
  })
  async forgotPasswordStudent(@Body() body: ForgetPasswordDto) {
    return this.authService.generateStudentResetPassword(body);
  }

  @Post('student/reset-password')
  @ApiOperation({
    description: 'Reset student password',
    summary: 'Reset student password',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset student password',
    type: ResetPasswordResponseDto,
  })
  async resetPasswordStudent(@Body() body: ResetPasswordDto) {
    return this.authService.resetStudentPassword(body);
  }

  @Post('student/google/code')
  @ApiOperation({ summary: 'Login a student user using Google OAuth' })
  async googleLoginWithCode(@Body() body: GoogleLoginDto) {
    if (!body.code)
      throw new HttpException('code is required', HttpStatus.BAD_REQUEST);
    return this.authService.googleStudentLoginWithCode(body);
  }

  @Post('student/google/token')
  @ApiOperation({ summary: 'Login a student user using Google OAuth token' })
  async googleLoginWithToken(@Body() body: GoogleLoginTokenDto) {
    if (!body.token)
      throw new HttpException('token is required', HttpStatus.BAD_REQUEST);
    return this.authService.googleStudentLoginWithToken(body);
  }

  @Post('student/change-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Change student password' })
  @ApiResponse({
    status: 401,
    description: "Le nouveau mot de passe doit être différent de l'ancien",
  })
  @ApiResponse({
    status: 401,
    description: 'Mot de passe incorrect',
  })
  async changeStudentPassword(@Req() req, @Body() body: ChangePasswordDto) {
    return this.authService.changeStudentPassword(req, body);
  }

  @Post('company/change-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Change company password' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    content: {
      'application/json': {
        examples: {
          passwordSameAsOld: {
            summary: "Le nouveau mot de passe doit être différent de l'ancien",
            value: {
              statusCode: 401,
              message:
                "Le nouveau mot de passe doit être différent de l'ancien",
            },
          },
          incorrectPassword: {
            summary: 'Mot de passe incorrect',
            value: {
              statusCode: 401,
              message: 'Mot de passe incorrect',
            },
          },
        },
      },
    },
  })
  async changeCompanyPassword(@Req() req, @Body() body: ChangePasswordDto) {
    return this.authService.changeCompanyPassword(req, body);
  }

  @Post('company/google/code')
  @ApiOperation({ summary: 'Login a company user using Google OAuth' })
  async googleCompanyLoginWithCode(@Body() body: GoogleLoginDto) {
    if (!body.code)
      throw new HttpException('code is required', HttpStatus.BAD_REQUEST);
    return this.authService.googleCompanyLoginWithCode(body);
  }

  @Post('company/google/token')
  @ApiOperation({ summary: 'Login a company user using Google OAuth token' })
  async googleCompanyLoginWithToken(@Body() body: GoogleLoginTokenDto) {
    if (!body.token)
      throw new HttpException('token is required', HttpStatus.BAD_REQUEST);
    return this.authService.googleCompanyLoginWithToken(body);
  }

  @Get('userType')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Gives the type of the user' })
  async getUserType(@Req() req) {
    return req.user.userType;
  }

  @Put('student/disable')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Disable student account' })
  @ApiResponse({
    status: 200,
    description: 'Student account disabled',
  })
  @ApiResponse({
    status: 401,
    description: 'Account already disabled',
  })
  @ApiResponse({
    status: 401,
    description:
      'Vous ne pouvez pas désactiver votre compte si vous êtes dans un groupe',
  })
  async disableStudentAccount(@Req() req) {
    return this.authService.disableStudentAccount(req);
  }

  @Put('company/disable')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Disable company account' })
  @ApiResponse({
    status: 200,
    description: 'Company account disabled',
  })
  @ApiResponse({
    status: 401,
    description: 'Account already disabled',
  })
  @ApiResponse({
    status: 401,
    description:
      'Vous ne pouvez pas désactiver votre compte si vous avez des missions en cours',
  })
  async disableCompanyAccount(@Req() req) {
    return this.authService.disableCompanyAccount(req);
  }

  @Delete('student/delete')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete student account' })
  @ApiResponse({
    status: 401,
    description:
      'Vous ne pouvez pas supprimer votre compte si vous êtes dans un groupe',
  })
  async deleteStudentAccount(@Req() req) {
    return this.authService.deleteStudentAccount(req);
  }

  @Delete('company/delete')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete company account' })
  @ApiResponse({
    status: 401,
    description:
      'Vous ne pouvez pas supprimer votre compte si vous avez des missions en cours',
  })
  async deleteCompanyAccount(@Req() req) {
    return this.authService.deleteCompanyAccount(req);
  }

  @Get('isVerified')
  @ApiOperation({
    description:
      'Returns true or false depending on whether the student user is verified',
    summary:
      'Returns true or false depending on whether the student user is verified',
  })
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(AuthGuard('jwt'))
  async isStudentVerified(@Req() req): Promise<boolean> {
    return await this.authService.isStudentVerified(req);
  }
}
