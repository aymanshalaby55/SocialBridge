import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { UserDto } from './dto/user.dto';

// Mock user data for testing
const MOCK_USERS = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    name: 'ayman',
  },
  {
    id: '2',
    email: 'user@domain.com',
    password: 'securepass',
    name: 'ayman',
  },
];

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private signJwt(user: UserDto): { access_token: string } {
    const payload = {
      sub: user.id,
      username: user.email,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    return {
      access_token: token,
    };
  }

  async login(loginInput: LoginInput) {
    if (!loginInput.email || !loginInput.password) {
      throw new Error('Email and password are required');
    }

    // Find user in mock data
    const user: UserDto = MOCK_USERS.find(
      (u) => u.email === loginInput.email && u.password === loginInput.password,
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return this.signJwt(user);
  }

  async signup(signupInput: SignupInput) {
    if (!signupInput.email || !signupInput.password) {
      throw new Error('Email and password are required');
    }

    // Check if user already exists
    const existingUser = MOCK_USERS.find((u) => u.email === signupInput.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: UserDto = {
      id: (MOCK_USERS.length + 1).toString(),
      email: signupInput.email,
      password: signupInput.password,
      name: signupInput.name,
    };

    MOCK_USERS.push(newUser);

    return this.signJwt(newUser);
  }

  async validateUser(payload: any) {
    if (!payload.email || !payload.sub) {
      return null;
    }

    // Find user in mock data
    const user = MOCK_USERS.find(
      (u) => u.email === payload.email && u.id === payload.sub,
    );

    return user || null;
  }

  // Test method to get all mock users (for testing purposes)
  async getMockUsers() {
    return MOCK_USERS;
  }
}
