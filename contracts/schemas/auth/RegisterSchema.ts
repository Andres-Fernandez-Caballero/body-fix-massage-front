import { z } from 'zod';

export const RegisterSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
    last_name: z.string().min(2, 'El apellido debe tener al menos 2 caracteres.'),
    phone: z.string().min(6, 'Ingresá un número de teléfono válido.'),
    birth_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ingresá la fecha en formato AAAA-MM-DD.')
        .refine((value) => {
            const [year, month, day] = value.split('-').map(Number);
            const date = new Date(Date.UTC(year, month - 1, day));
            return (
                date.getUTCFullYear() === year &&
                date.getUTCMonth() === month - 1 &&
                date.getUTCDate() === day
            );
        }, 'Ingresá una fecha válida.'),
    gender: z.enum(['male', 'female', 'other'], { error: 'Seleccioná un género.' }),
    email: z.email('Ingresá un email válido.'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
    password_confirmation: z.string().min(6, 'La confirmación debe tener al menos 6 caracteres.'),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden.',
    path: ['password_confirmation'],
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
