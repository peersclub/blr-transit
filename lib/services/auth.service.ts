import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { sendOTP, verifyOTP } from './sms.service';
import { z } from 'zod';

// Validation schemas
export const SignUpSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  password: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain uppercase, lowercase, number and special character'
  ),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  employeeId: z.string().optional(),
  corporateId: z.string().optional(),
  companyEmail: z.string().email().optional(),
});

export const VerifyOTPSchema = z.object({
  phone: z.string(),
  otp: z.string().length(6),
});

export const LoginSchema = z.object({
  identifier: z.string(), // Can be email or phone
  password: z.string(),
});

// Generate JWT token
function generateToken(userId: string, role: string): string {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
}

// Hash password
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Compare password
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Verify corporate ID and associate with company
async function verifyCorporateId(corporateId: string, email: string): Promise<{
  isValid: boolean;
  companyId?: string;
  message?: string;
}> {
  try {
    // Check if corporate ID exists
    const company = await prisma.company.findUnique({
      where: { corporateId },
    });

    if (!company) {
      return {
        isValid: false,
        message: 'Invalid corporate ID',
      };
    }

    if (!company.isActive) {
      return {
        isValid: false,
        message: 'Company account is inactive',
      };
    }

    // Verify email domain if company has domain restriction
    if (company.domain) {
      const emailDomain = email.split('@')[1];
      if (emailDomain !== company.domain) {
        return {
          isValid: false,
          message: `Email must be from ${company.domain} domain`,
        };
      }
    }

    return {
      isValid: true,
      companyId: company.id,
    };
  } catch (error) {
    console.error('Corporate verification error:', error);
    return {
      isValid: false,
      message: 'Error verifying corporate ID',
    };
  }
}

// Sign up new user
export async function signUp(data: z.infer<typeof SignUpSchema>) {
  try {
    // Validate input
    const validatedData = SignUpSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { phone: validatedData.phone },
        ],
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'User already exists with this email or phone number',
      };
    }

    // Verify corporate ID if provided
    let companyId: string | null = null;
    if (validatedData.corporateId) {
      const corporateVerification = await verifyCorporateId(
        validatedData.corporateId,
        validatedData.email
      );

      if (!corporateVerification.isValid) {
        return {
          success: false,
          message: corporateVerification.message || 'Invalid corporate ID',
        };
      }

      companyId = corporateVerification.companyId || null;
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        phone: validatedData.phone,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        employeeId: validatedData.employeeId,
        companyId,
        phoneOTP: otp,
        phoneOTPExpiry: otpExpiry,
        verificationStatus: companyId ? 'VERIFIED' : 'PENDING', // Auto-verify corporate users
      },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        company: {
          select: {
            name: true,
            discountPercent: true,
          },
        },
      },
    });

    // Send OTP via SMS
    await sendOTP(validatedData.phone, otp);

    return {
      success: true,
      message: 'User created successfully. Please verify your phone number.',
      data: {
        userId: user.id,
        needsPhoneVerification: true,
      },
    };
  } catch (error) {
    console.error('Sign up error:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation error',
        errors: error.issues,
      };
    }
    return {
      success: false,
      message: 'Error creating user account',
    };
  }
}

// Verify phone OTP
export async function verifyPhoneOTP(data: z.infer<typeof VerifyOTPSchema>) {
  try {
    const validatedData = VerifyOTPSchema.parse(data);

    // Find user by phone
    const user = await prisma.user.findUnique({
      where: { phone: validatedData.phone },
      include: {
        company: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Check if OTP is valid and not expired
    if (
      !user.phoneOTP ||
      user.phoneOTP !== validatedData.otp ||
      !user.phoneOTPExpiry ||
      new Date() > user.phoneOTPExpiry
    ) {
      return {
        success: false,
        message: 'Invalid or expired OTP',
      };
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneVerified: true,
        phoneOTP: null,
        phoneOTPExpiry: null,
        verifiedAt: new Date(),
      },
    });

    // Generate token
    const token = generateToken(user.id, user.role);

    return {
      success: true,
      message: 'Phone verified successfully',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          company: user.company,
        },
      },
    };
  } catch (error) {
    console.error('OTP verification error:', error);
    return {
      success: false,
      message: 'Error verifying OTP',
    };
  }
}

// Resend OTP
export async function resendOTP(phone: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    if (user.phoneVerified) {
      return {
        success: false,
        message: 'Phone already verified',
      };
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneOTP: otp,
        phoneOTPExpiry: otpExpiry,
      },
    });

    // Send OTP
    await sendOTP(phone, otp);

    return {
      success: true,
      message: 'OTP sent successfully',
    };
  } catch (error) {
    console.error('Resend OTP error:', error);
    return {
      success: false,
      message: 'Error sending OTP',
    };
  }
}

// Login
export async function login(data: z.infer<typeof LoginSchema>) {
  try {
    const validatedData = LoginSchema.parse(data);

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.identifier },
          { phone: validatedData.identifier },
        ],
      },
      include: {
        company: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }

    // Verify password
    const passwordValid = await verifyPassword(
      validatedData.password,
      user.password
    );

    if (!passwordValid) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }

    // Check if phone is verified
    if (!user.phoneVerified) {
      // Generate and send new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          phoneOTP: otp,
          phoneOTPExpiry: otpExpiry,
        },
      });

      await sendOTP(user.phone, otp);

      return {
        success: false,
        message: 'Phone verification required',
        data: {
          needsPhoneVerification: true,
          phone: user.phone,
        },
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        message: 'Account is inactive. Please contact support.',
      };
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    return {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          company: user.company,
        },
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Error logging in',
    };
  }
}

// Verify JWT token
export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        company: {
          select: {
            name: true,
            discountPercent: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

// Create initial admin user
export async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@blrtransit.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await hashPassword(adminPassword);

    await prisma.user.create({
      data: {
        email: adminEmail,
        phone: '9999999999',
        phoneVerified: true,
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
      },
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}