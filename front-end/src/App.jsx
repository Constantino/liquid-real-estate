import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Container, Typography, Button } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThirdwebProvider } from "thirdweb/react";
import './App.css'
import ResponsiveAppBar from './components/ResponsiveAppBar'
import Realtor from './pages/Realtor'
import Market from './pages/Market'
import Assets from './pages/Assets'
import Loans from './pages/Loans'
import Investor from './pages/Investor'
import { ConnectButton, darkTheme, lightTheme } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

// Create a dark theme
const darkThemeLocal = createTheme({
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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `
            radial-gradient(ellipse 18% 14% at 90% 8%, rgba(0,255,180,0.13) 0%, rgba(0,255,180,0.04) 60%, rgba(0,0,0,0.0) 100%),
            radial-gradient(ellipse 60% 40% at 20% 85%, rgba(0,255,180,0.12) 0%, rgba(0,255,180,0.03) 60%, rgba(0,0,0,0.92) 100%),
            radial-gradient(ellipse 40% 30% at 85% 95%, rgba(0,80,255,0.38) 0%, rgba(0,80,255,0.10) 60%, rgba(0,0,0,0.92) 100%),
            radial-gradient(ellipse 30% 20% at 60% 80%, rgba(120,0,255,0.13) 0%, rgba(120,0,255,0.04) 60%, rgba(0,0,0,0.92) 100%),
            linear-gradient(to top, #000 65%, #101014 100%)
          `,
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
  },
})

const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});

function App() {
  return (
    <ThirdwebProvider>


      <Router>
        <ThemeProvider theme={darkThemeLocal}>
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
                    Liquid Real Estate
                  </Typography>
                  <Typography variant="h4" component="h4" sx={{ mb: 2 }}>
                    Own your piece of real estate with hyper liquidity.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <ConnectButton theme={darkTheme({
                      colors: {
                        primaryButtonBg: 'rgba(0,255,157,0.08)',
                        primaryButtonText: '#00FF9D',
                      }
                    })
                    }
                      connectButton={{
                        label: "Connect Wallet",
                      }}
                      client={client} />
                  </Box>
                </Box>
              } />
              <Route path="/realtor" element={<Realtor />} />
              <Route path="/market" element={<Market />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/investor" element={<Investor />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </ThirdwebProvider>
  )
}

export default App
