import { RegisterSchema } from './RegisterSchema';

const validPayload = {
    name: 'Ana',
    last_name: 'Gómez',
    phone: '1136759311',
    birth_date: '1998-04-23',
    gender: 'female' as const,
    email: 'ana@example.com',
    password: 'secreta1',
    password_confirmation: 'secreta1',
};

describe('RegisterSchema', () => {
    it('acepta un payload completo y válido', () => {
        const result = RegisterSchema.safeParse(validPayload);
        expect(result.success).toBe(true);
    });

    describe('birth_date', () => {
        it.each([
            '1998-04-23',
            '2000-01-01',
            '2026-08-06',
            '2024-02-29', // año bisiesto: 29 de febrero existe
        ])('acepta una fecha real y bien formateada: %s', (birth_date) => {
            const result = RegisterSchema.safeParse({ ...validPayload, birth_date });
            expect(result.success).toBe(true);
        });

        it.each([
            ['23-04-1998', 'formato DD-MM-AAAA en vez de AAAA-MM-DD'],
            ['1998/04/23', 'separador "/" en vez de "-"'],
            ['98-04-23', 'año con 2 dígitos'],
            ['1998-4-23', 'mes sin cero a la izquierda'],
            ['1998-04-3', 'día sin cero a la izquierda'],
            ['1998-04-23T00:00:00Z', 'timestamp ISO completo en vez de solo la fecha'],
            ['', 'string vacío'],
            ['not-a-date', 'texto arbitrario'],
        ])('rechaza "%s" (%s)', (birth_date) => {
            const result = RegisterSchema.safeParse({ ...validPayload, birth_date });
            expect(result.success).toBe(false);
        });

        it.each([
            ['2026-13-01', 'mes 13 no existe'],
            ['2026-00-15', 'mes 0 no existe'],
            ['2026-02-30', 'el 30 de febrero no existe'],
            ['2026-04-31', 'abril tiene 30 días'],
            ['2023-02-29', '2023 no es bisiesto, no existe el 29 de febrero'],
            ['2026-00-00', 'mes y día en 0'],
        ])('rechaza "%s" aunque tenga el formato correcto, porque %s', (birth_date) => {
            const result = RegisterSchema.safeParse({ ...validPayload, birth_date });
            expect(result.success).toBe(false);
        });
    });

    describe('name / last_name', () => {
        it.each(['name', 'last_name'] as const)('rechaza %s con menos de 2 caracteres', (field) => {
            const result = RegisterSchema.safeParse({ ...validPayload, [field]: 'A' });
            expect(result.success).toBe(false);
        });

        it.each(['name', 'last_name'] as const)('acepta %s con exactamente 2 caracteres', (field) => {
            const result = RegisterSchema.safeParse({ ...validPayload, [field]: 'Al' });
            expect(result.success).toBe(true);
        });
    });

    describe('email', () => {
        it.each([
            'sin-arroba.com',
            'con espacio@example.com',
            'doble@@example.com',
            '@example.com',
            'usuario@',
        ])('rechaza un email inválido: %s', (email) => {
            const result = RegisterSchema.safeParse({ ...validPayload, email });
            expect(result.success).toBe(false);
        });

        it('acepta un email válido', () => {
            const result = RegisterSchema.safeParse({ ...validPayload, email: 'usuario@dominio.com.ar' });
            expect(result.success).toBe(true);
        });
    });

    describe('phone', () => {
        it('rechaza un teléfono con menos de 6 caracteres', () => {
            const result = RegisterSchema.safeParse({ ...validPayload, phone: '123' });
            expect(result.success).toBe(false);
        });

        it('acepta un teléfono con 6 caracteres o más', () => {
            const result = RegisterSchema.safeParse({ ...validPayload, phone: '123456' });
            expect(result.success).toBe(true);
        });
    });

    describe('gender', () => {
        it.each(['male', 'female', 'other'] as const)('acepta el valor válido "%s"', (gender) => {
            const result = RegisterSchema.safeParse({ ...validPayload, gender });
            expect(result.success).toBe(true);
        });

        it('rechaza un valor fuera del enum', () => {
            const result = RegisterSchema.safeParse({ ...validPayload, gender: 'unknown' });
            expect(result.success).toBe(false);
        });

        it('rechaza cuando falta el género', () => {
            const { gender, ...withoutGender } = validPayload;
            const result = RegisterSchema.safeParse(withoutGender);
            expect(result.success).toBe(false);
        });
    });

    describe('password / password_confirmation', () => {
        it('rechaza contraseñas de menos de 6 caracteres', () => {
            const result = RegisterSchema.safeParse({
                ...validPayload,
                password: '123',
                password_confirmation: '123',
            });
            expect(result.success).toBe(false);
        });

        it('rechaza cuando password y password_confirmation no coinciden', () => {
            const result = RegisterSchema.safeParse({
                ...validPayload,
                password: 'secreta1',
                password_confirmation: 'otraClave',
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0]?.path).toContain('password_confirmation');
            }
        });
    });
});
