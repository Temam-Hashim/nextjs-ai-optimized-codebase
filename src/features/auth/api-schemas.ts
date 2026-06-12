import { z } from "zod/v4";

export const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginBody = z.infer<typeof LoginBodySchema>;
export type RegisterBody = z.infer<typeof RegisterBodySchema>;
