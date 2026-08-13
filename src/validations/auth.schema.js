import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10,15}$/;

const identitySchema = z
  .string()
  .min(3, "Email or phone number is required")
  .refine((value) => emailRegex.test(value) || phoneRegex.test(value), {
    message: "Enter a valid email or phone number",
  });

export const loginSchema = z.object({
  identity: identitySchema,

  password: z.string().min(4, "Password requires at least 4 characters"),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    firstName: z.string().min(3, "First name requires at least 3 characters"),

    lastName: z.string().min(3, "Last name requires at least 3 characters"),

    password: z.string().min(4, "Password requires at least 4 characters"),

    confirmPassword: z.string().min(4, "Confirm password is required"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const verifyEmailSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit verification code"),
});
