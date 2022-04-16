import { resolver } from "blitz"
import { z } from "zod"

const InviteUserToWorkspace = z.object({
  workspaceId: z.number(),
  email: z
    .string()
    .email()
    .transform((str) => str.toLowerCase().trim()),
})

export default resolver.pipe(
  resolver.zod(InviteUserToWorkspace),
  resolver.authorize(),
  async ({ workspaceId, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  }
)
