import { z } from 'zod';

export const RegisterSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
    email: z.email('Ingresá un email válido.'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
    password_confirmation: z.string().min(6, 'La confirmación debe tener al menos 6 caracteres.'),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden.',
    path: ['password_confirmation'],
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
