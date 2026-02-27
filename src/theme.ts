import { createTheme } from "@mui/material/styles";

const sharedTypography = {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

export const lightTheme = createTheme({
    palette: { mode: 'light' },
    typography: sharedTypography,
})

export const darkTheme = createTheme({
    palette: { mode: 'dark' },
    typography: sharedTypography,
})