import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getWorkspace from "app/workspaces/queries/getWorkspace"
import inviteUserToWorkspace from "app/workspaces/mutations/inviteUserToWorkspace"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { Invite } from "app/workspaces/validations"

export const InviteWorkspace = () => {
  const router = useRouter()
  const workspaceId = useParam("workspaceId", "number")
  const [workspace, { setQueryData }] = useQuery(
    getWorkspace,
    { id: workspaceId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [inviteUserToWorkspaceMutation] = useMutation(inviteUserToWorkspace)

  return (
    <>
      <Head>
        <title>Edit Workspace {workspace.id}</title>
      </Head>

      <div>
        <h1>
          Invite user to workspace <em>{workspace.name}</em>
        </h1>

        <Form
          submitText="Invite user"
          schema={Invite}
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            try {
              await inviteUserToWorkspaceMutation({ workspaceId: workspace.id, ...values })
              router.push(Routes.ShowWorkspacePage({ workspaceId: workspace.id }))
            } catch (error: any) {
              return { [FORM_ERROR]: error.toString() }
            }
          }}
        >
          <LabeledTextField name="email" label="Email" placeholder="Email" />
        </Form>
      </div>
    </>
  )
}

const InviteToWorkspacePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <InviteWorkspace />
      </Suspense>

      <p>
        <Link href={Routes.WorkspacesPage()}>
          <a>Workspaces</a>
        </Link>
      </p>
    </div>
  )
}

InviteToWorkspacePage.authenticate = true
InviteToWorkspacePage.getLayout = (page) => <Layout>{page}</Layout>

export default InviteToWorkspacePage
