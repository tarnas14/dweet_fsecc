import { Suspense } from "react"
import { useParam, Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getNotes from "app/notes/queries/getNotes"

const ITEMS_PER_PAGE = 100

export const NotesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const workspaceId = useParam("workspaceId", "number")

  const [{ notes, hasMore }] = usePaginatedQuery(getNotes, {
    where: { workspaceId },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <h2>Notes in workspace {workspaceId}</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <Link href={Routes.ShowNotePage({ noteId: note.id, workspaceId })}>
              <a>{note.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const NotesPage: BlitzPage = () => {
  const workspaceId = useParam("workspaceId", "number")

  return (
    <>
      <Head>
        <title>Notes</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.ShowWorkspacePage({ workspaceId })}>
            <a>Workspace</a>
          </Link>
        </p>
        <p>
          <Link href={Routes.NewNotePage({ workspaceId })}>
            <a>Create Note</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <NotesList />
        </Suspense>
      </div>
    </>
  )
}

NotesPage.authenticate = true
NotesPage.getLayout = (page) => <Layout>{page}</Layout>

export default NotesPage
