import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import styles from '~/styles/note-details.css'
import { getStoredNotes } from "../data/notes";

export default function NoteDetailsPage() {
  const { title, content } = useLoaderData()

  return (
    <main id="note-details">
        <header>
            <nav>
                <Link to="/notes">Back to all Notes</Link>
            </nav>
            <h1>{title}</h1>
        </header>
        <p id="note-details-content">{content}</p>
    </main>
  )
}

export async function loader({ params }) {
  const notes = await getStoredNotes()
  const noteId = params.noteId
  const selectedNote = notes.find(note => note.id === noteId)

  if(!selectedNote) {
    throw json({
      message: `Could not find note for id ${noteId}`
    })
  }

  return selectedNote
}

export function links() {
    return [{ rel: 'stylesheet', href: styles}]
}

//Para agregar todos los metas al head de la pagina
//Esta funcion recibe tambien los parametros desde el loader
export function meta({data}) {

  const { title, content } = data

  return {
    title: `All Notes - ${title}`,
    description: `All Notes - ${content}`,
  }
}