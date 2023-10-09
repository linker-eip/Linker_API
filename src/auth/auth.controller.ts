import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginStudentDto } from './dto/login-student.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginStudentResponseDto } from './dto/login-student-response.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { LoginCompanyDto } from './dto/login-company.dto';
import { LoginCompanyResponseDto } from './dto/login-company-response.dto';
import { RegisterCompanyResponseDto } from './dto/register-company-response.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { ForgetPasswordDto } from '../auth/dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgetPasswordResponseDto } from './dto/forget-password-response.dto';
import { ResetPasswordResponseDto } from './dto/reset-password-response.dto';
import { GoogleLoginDto, GoogleLoginTokenDto } from './dto/google-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('api/auth')
@ApiTags('AUTH')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly jwtService: JwtService) { }

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
      throw new HttpException('Mot de passe incorrect', HttpStatus.UNAUTHORIZED);
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
      throw new HttpException('Mot de passe incorrect.', HttpStatus.UNAUTHORIZED);
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
    type: ForgetPasswordResponseDto
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
    type: ResetPasswordResponseDto
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
    type: ForgetPasswordResponseDto
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
    type: ResetPasswordResponseDto
  })
  async resetPasswordStudent(@Body() body: ResetPasswordDto) {
    return this.authService.resetStudentPassword(body);
  }

  @Post('student/google/code')
  @ApiOperation({ summary: 'Login a student user using Google OAuth' })
  async googleLoginWithCode(@Body() body: GoogleLoginDto) {
    if (!body.code)
      throw new HttpException("code is required", HttpStatus.BAD_REQUEST)
    return this.authService.googleStudentLoginWithCode(body);
  }

  @Post('student/google/token')
  @ApiOperation({ summary: 'Login a student user using Google OAuth token' })
  async googleLoginWithToken(@Body() body: GoogleLoginTokenDto) {
    if (!body.token)
      throw new HttpException("token is required", HttpStatus.BAD_REQUEST)
    return this.authService.googleStudentLoginWithToken(body);
  }

  @Post('company/google/code')
  @ApiOperation({ summary: 'Login a company user using Google OAuth' })
  async googleCompanyLoginWithCode(@Body() body: GoogleLoginDto) {
    if (!body.code)
      throw new HttpException("code is required", HttpStatus.BAD_REQUEST)
    return this.authService.googleCompanyLoginWithCode(body);
  }

  @Post('company/google/token')
  @ApiOperation({ summary: 'Login a company user using Google OAuth token' })
  async googleCompanyLoginWithToken(@Body() body: GoogleLoginTokenDto) {
    if (!body.token)
      throw new HttpException("token is required", HttpStatus.BAD_REQUEST)
    return this.authService.googleCompanyLoginWithToken(body);
  }

  @Get('userType')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Gives the type of the user' })
  async getUserType(@Req() req) {
    return req.user.userType
  }
}