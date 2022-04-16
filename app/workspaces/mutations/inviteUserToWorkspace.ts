import { resolver, generateToken, hash256 } from "blitz"
import db from "db"
import { z } from "zod"
import { inviteToWorkspaceMailer } from "mailers/inviteToWorkspaceMailer"

const TOKEN_EXPIRATION_IN_HOURS = 4

const InviteUserToWorkspace = z.object({
  invitedBy: z
    .string()
    .email()
    .transform((str) => str.toLowerCase().trim()),
  workspaceId: z.number(),
  invitee: z
    .string()
    .email()
    .transform((str) => str.toLowerCase().trim()),
})

export default resolver.pipe(
  resolver.zod(InviteUserToWorkspace),
  resolver.authorize(),
  async ({ invitee, workspaceId, invitedBy }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const workspaceHost = await db.user.findFirst({ where: { email: invitedBy } })
    const workspace = await db.workspace.findFirst({ where: { id: workspaceId } })

    if (workspaceHost && workspace) {
      const token = generateToken()
      // in theory we could add metadata column of type json to tokens to store workspaceId there, but I'm too lazy
      const hashedToken = hash256(`${workspaceId}.${token}`)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRATION_IN_HOURS)

      await db.token.deleteMany({ where: { type: "INVITATION", sentTo: invitee } })
      await db.token.create({
        data: {
          user: { connect: { id: workspaceHost.id } },
          type: "INVITATION",
          expiresAt,
          hashedToken,
          sentTo: invitee,
        },
      })

      await inviteToWorkspaceMailer({ to: invitee, token, workspace, invitedBy }).send()
    }
  }
)
