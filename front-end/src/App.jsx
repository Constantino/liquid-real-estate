import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Container, Typography, Button } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import ResponsiveAppBar from './components/ResponsiveAppBar'
import Realtor from './pages/Realtor'
import Market from './pages/Market'
import Viewer from './pages/Viewer'
import Loans from './pages/Loans'
import Investor from './pages/Investor'

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
  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ResponsiveAppBar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={
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
                  <Button variant="outlined" color="primary">
                    Connect Wallet
                  </Button>
                </Box>
              </Box>
            } />
            <Route path="/realtor" element={<Realtor />} />
            <Route path="/market" element={<Market />} />
            <Route path="/viewer" element={<Viewer />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/investor" element={<Investor />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  )
}

export default App
