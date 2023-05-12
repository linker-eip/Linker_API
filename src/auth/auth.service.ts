import { Injectable } from '@nestjs/common';
import { LoginStudentDto } from './dto/login-student.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { StudentService } from 'src/student/student.service';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { StudentUser } from 'src/entity/StudentUser.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly studentService: StudentService,
              private readonly jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async registerStudent(registerStudentDto: RegisterStudentDto) {
    const { email, password, firstName, lastName } = registerStudentDto;

    const existingUser = await this.studentService.findOne( email );

    if (existingUser) {
      return {error : "User with email " + email + " already exists"};
    }

    const newUser = new StudentUser;
    newUser.email = email;
    newUser.password = await this.hashPassword(password);
    newUser.firstName = firstName;
    newUser.lastName = lastName;

    const savedUser = await this.studentService.save(newUser);

    const token = jwt.sign({ email: savedUser.email }, process.env.JWT_SECRET);

    return { token };
  }

  async loginStudent(loginStudentDto: LoginStudentDto) {
    const student = await this.studentService.findOne(loginStudentDto.email);

    if (student && student.password === loginStudentDto.password) {
      const token = jwt.sign({ email: student.email }, process.env.JWT_SECRET);
      return { token };
    }

    return null;
  }
}
