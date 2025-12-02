import z from 'zod';

export const organizationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
});

export const projectSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  organizationId: z.string(),
});

export type OrganizationInput = z.infer<typeof organizationSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
