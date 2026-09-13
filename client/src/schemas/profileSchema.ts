import { z } from 'zod';

export const profileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(
            2,
            'Name must contain at least 2 characters',
        )
        .max(
            50,
            'Name must contain no more than 50 characters',
        ),

    email: z
        .string()
        .trim()
        .email('Enter a valid email'),

    bio: z
        .string()
        .max(
            300,
            'Bio must contain no more than 300 characters',
        ),

    interests: z
        .array(z.string())
        .min(
            1,
            'Choose at least one interest',
        )
        .max(
            10,
            'You can choose up to 10 interests',
        ),
});

export type ProfileFormData =
    z.infer<typeof profileSchema>;