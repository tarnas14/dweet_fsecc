/* TODO - You need to add a mailer integration in `integrations/` and import here.
 *
 * The integration file can be very simple. Instantiate the email client
 * and then export it. That way you can import here and anywhere else
 * and use it straight away.
 */

type InviteToWorkspaceMailer = {
  to: string
  token: string
  workspace: { id: number; name: string }
  invitedBy: string
}

export function inviteToWorkspaceMailer({
  to,
  token,
  workspace,
  invitedBy,
}: InviteToWorkspaceMailer) {
  // In production, set APP_ORIGIN to your production server origin
  const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
  const inviteUrl = `${origin}/invitation?token=${token}`

  const msg = {
    from: "TODO@example.com",
    to,
    subject: `You are invited to join workspace ${workspace.name}`,
    html: `
      <h1>Hi!</h1>
      <h3>NOTE: You must set up a production email integration in mailers/inviteToWorkspaceMailer.ts</h3>

      <p>User ${invitedBy} invites you to join their workspace ${workspace.name}</p>
      <a href="${inviteUrl}">
        Click here to setup your account and join the workspace
      </a>
    `,
  }

  return {
    async send() {
      if (process.env.NODE_ENV === "production") {
        // TODO - send the production email, like this:
        // await postmark.sendEmail(msg)
        throw new Error("No production email implementation in mailers/inviteToWorkspaceMailer")
      } else {
        // Preview email in the browser
        const previewEmail = (await import("preview-email")).default
        await previewEmail(msg)
      }
    },
  }
}
