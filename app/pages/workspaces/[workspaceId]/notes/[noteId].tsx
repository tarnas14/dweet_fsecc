import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getNote from "app/notes/queries/getNote"
import deleteNote from "app/notes/mutations/deleteNote"

export const Note = () => {
  const router = useRouter()
  const noteId = useParam("noteId", "number")
  const workspaceId = useParam("workspaceId", "number")
  const [deleteNoteMutation] = useMutation(deleteNote)
  const [note] = useQuery(getNote, { id: noteId, workspaceId })

  return (
    <>
      <Head>
        <title>Note {note.id}</title>
      </Head>

      <div>
        <h1>Note {note.id}</h1>
        <pre>{JSON.stringify(note, null, 2)}</pre>

        <Link href={Routes.EditNotePage({ noteId: note.id, workspaceId })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteNoteMutation({ id: note.id, workspaceId })
              router.push(Routes.NotesPage({ workspaceId }))
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

const ShowNotePage: BlitzPage = () => {
  const workspaceId = useParam("workspaceId", "number")

  return (
    <div>
      <p>
        <Link href={Routes.NotesPage({ workspaceId })}>
          <a>Notes</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Note />
      </Suspense>
    </div>
  )
}

ShowNotePage.authenticate = true
ShowNotePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowNotePage
