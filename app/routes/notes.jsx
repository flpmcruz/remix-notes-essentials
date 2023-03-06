import { json, redirect } from "@remix-run/node";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import { getStoredNotes, storeNotes } from "../data/notes";

//This component will prerender on the server
export default function NotesPage() {
  const notes = useLoaderData(); //receive the return of loader

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  //run on the backend and remix trigger this function before load this page
  const notes = await getStoredNotes();

  if (!notes || notes.length === 0) {
    throw json(
      { message: "Could not find any notes" },
      {
        status: 404,
        statusText: "Not found",
      }
    );
  }
  return notes;
}

export async function action({ request }) {
  //run on backend, every request to '/notes' will be handle by this action function
  //en 'request' recibo todo lo enviado en el form

  const formData = await request.formData();

  // const noteData = {
  //   title: formData.get('title'),
  //   content: formData.get('content'),
  // }
  const noteData = Object.fromEntries(formData);

  //Add validation...
  if (noteData.title.trim().length < 5) {
    return { message: "Invalid title - must be large than 5" };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);

  //Solo para ver el boton desabilitado
  await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
  return redirect("/notes");
}

//para agregar todos los links al head de la pagina
export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

//Para agregar todos los metas al head de la pagina
export function meta() {
  return {
    title: 'All Notes',
    description: 'Manage your Notes',
  }
}

//Esto captura cualquier respuesta de error del servidor relativo a esta ruta retornado en el loader
// throw json(
//   { message: "Could not find any notes" },
//   {
//     status: 404,
//     statusText: "Not found",
//   }
// );
export function CatchBoundary() {
  //este es un hook especial de remix para recibir los datos capturados por el CatchBoundary
  const caughtResponse = useCatch()
  //const { data, status, statusText } = caughtResponse

  const message = caughtResponse.data?.message || 'Data not found'
  
  return (
    <main>
      <NewNote />
      <p className="info-message">{message}</p>
    </main>
  )
}

//Si existe un error, esta funcion lo va a capturar y lo va a retornar en lugar del componente exportado por default y va a ser inyectado en el Outlet. En otras palabras, no va a ser capturado por el ErroBoundary Global definido en el root
export function ErrorBoundary({ error }) {
  //always get an error prop
  return (
    <main className="error">
      <h1>An error ocurred in notes!</h1>
      <p>{error.message}</p>
      <p>
        Back to <Link to="/">safety</Link>
      </p>
    </main>
  )
}
