import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.email('Ingresá un email válido.'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;