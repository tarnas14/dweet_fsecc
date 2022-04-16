import { z } from "zod"

export const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())

export const Invite = z.object({
  email,
})
