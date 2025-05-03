import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Container, Typography, Button } from '@mui/material'
import './App.css'
import ButtonAppBar from './components/NavBar'

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00FF9D',
    },
    background: {
      default: '#0F0F0F',
      paper: '#1A1A1A',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
})

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ButtonAppBar />
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
            Welcome to Liquid Real Estate
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCount((count) => count + 1)}
            >
              Count is {count}
            </Button>
            <Button variant="outlined" color="primary">
              Connect Wallet
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
