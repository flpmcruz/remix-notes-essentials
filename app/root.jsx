import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react"

import styles from "~/styles/main.css"
import MainNavigation from "~/components/MainNavegation"

export const links = () => [
  { rel: "stylesheet", href: styles },
]

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
})

//Esto captura cualquier respuesta de error del servidor de manera global, pero se puede añadir a cada pagina por separado
export function CatchBoundary() {
  //este es un hook especial de remix para recibir los datos capturados por el CatchBoundary
  const caughtResponse = useCatch()

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>{caughtResponse.statusText}</title>
      </head>
      <body>
        <header>
          <MainNavigation/>
        </header>
        <main className="error">
          <h1>{caughtResponse.statusText}</h1>
          <p>{caughtResponse.data?.message || 'An error ocurred'}</p>
          <p>
            Back to <Link to="/">safety</Link>
          </p>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

//Es un componente especial de remix para tratar los errores, debe llamarse así
//Este ErrorBoundary va a ser renderizado por remix en vez del componente App si algun error ocurre en cualquier parte de nuestra app. Es un tratamiento de errores global, pero se puede anadir a cada pagina por separado
export function ErrorBoundary({error}) {
  //always get an error prop
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>An error ocurred</title>
      </head>
      <body>
        <header>
          <MainNavigation/>
        </header>
        <main className="error">
          <h1>An error ocurred!</h1>
          <p>{error.message}</p>
          <p>Back to <Link to='/'>safety</Link></p>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <MainNavigation/>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
