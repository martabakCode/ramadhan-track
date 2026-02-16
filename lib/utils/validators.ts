import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter').max(50, 'Nama maksimal 50 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string().min(6, 'Konfirmasi password diperlukan'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
});

export const completeChallengeSchema = z.object({
    challengeId: z.string().uuid('ID tantangan tidak valid'),
    userId: z.string().uuid('ID user tidak valid'),
});

export const updateProfileSchema = z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter').max(50, 'Nama maksimal 50 karakter').optional(),
    avatar_url: z.string().url('URL avatar tidak valid').optional().nullable(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CompleteChallengeInput = z.infer<typeof completeChallengeSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
