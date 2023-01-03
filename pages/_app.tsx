import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

import type { AppProps } from "next/app"
import CssBaseline from "@mui/material/CssBaseline"
import { SessionProvider } from "next-auth/react"
import { SnackbarProvider } from "material-ui-snackbar-provider"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <CssBaseline />
      <SnackbarProvider SnackbarProps={{ autoHideDuration: 5000 }}>
        <Component {...pageProps} />
      </SnackbarProvider>
    </SessionProvider>
  )
}
