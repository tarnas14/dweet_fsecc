import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateWorkspace = z.object({
  userId: z.number(),
  email: z.string().email(),
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateWorkspace), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const workspace = await db.workspace.create({
    data: {
      name: input.name,
      users: {
        create: [
          {
            assignedBy: input.email,
            assignedAt: new Date(),
            user: {
              connect: {
                id: input.userId,
              },
            },
          },
        ],
      },
    },
  })

  return workspace
})
