import { z } from 'zod';

export const CreateBookingSchema = z.object({
    announcementId: z.number(),
    therapistId: z.number(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    notes: z.string().optional(),
});

export type CreateBookingSchemaType = z.infer<typeof CreateBookingSchema>;