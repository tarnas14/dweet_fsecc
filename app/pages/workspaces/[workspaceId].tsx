import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getWorkspace from "app/workspaces/queries/getWorkspace"
import deleteWorkspace from "app/workspaces/mutations/deleteWorkspace"

export const Workspace = () => {
  const router = useRouter()
  const workspaceId = useParam("workspaceId", "number")
  const [deleteWorkspaceMutation] = useMutation(deleteWorkspace)
  const [workspace] = useQuery(getWorkspace, { id: workspaceId })

  return (
    <>
      <Head>
        <title>Workspace {workspace.id}</title>
      </Head>

      <div>
        <h1>Workspace {workspace.id}</h1>
        <pre>{JSON.stringify(workspace, null, 2)}</pre>
        <div>
          <Link href={Routes.NotesPage({ workspaceId: workspace.id })}>
            <a>See notes in this workspace</a>
          </Link>
        </div>
        <Link href={Routes.EditWorkspacePage({ workspaceId: workspace.id })}>
          <a>Edit</a>
        </Link>{" "}
        <Link href={Routes.InviteToWorkspacePage({ workspaceId: workspace.id })}>
          <a>Invite a User</a>
        </Link>
        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteWorkspaceMutation({ id: workspace.id })
              router.push(Routes.WorkspacesPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowWorkspacePage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.WorkspacesPage()}>
          <a>Workspaces</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Workspace />
      </Suspense>
    </div>
  )
}

ShowWorkspacePage.authenticate = true
ShowWorkspacePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowWorkspacePage
