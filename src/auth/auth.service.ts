import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async login(loginInput: LoginInput) {
    if (!loginInput.email || !loginInput.password) {
      throw new Error('Email and password are required');
    }

    // Find user in database
    const user = await this.prisma.user.findUnique({
      where: { email: loginInput.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const { id, email } = user;

    return this.signJwt(id, email);
  }

  async signup(signupInput: SignupInput) {
    if (!signupInput.email || !signupInput.password) {
      throw new Error('Email and password are required');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signupInput.email },
    });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password before storing
    const hashedPassword = await this.hashPassword(signupInput.password);

    // Create new user with hashed password
    const newUser = await this.prisma.user.create({
      data: {
        email: signupInput.email,
        password: hashedPassword,
        name: signupInput.name,
      },
    });
    const { id, email } = newUser;

    return this.signJwt(id, email);
  }

  // private services
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
  private signJwt(id: number, email: string): { access_token: string } {
    const payload = {
      id: id,
      username: email,
    };

    this.validateUser(payload.id);

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }

  async validateUser(id: number) {
    if (!id) {
      return null;
    }

    // Find user in database
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }
}
