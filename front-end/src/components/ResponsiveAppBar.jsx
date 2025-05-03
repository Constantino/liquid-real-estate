import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, Link } from 'react-router-dom';
import liquidRealEstateLogo from '../assets/liquid_re_logo.png';
import { ConnectButton, darkTheme, lightTheme } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const pages = [
    { name: 'Realtor', path: '/realtor' },
    { name: 'Market', path: '/market' },
    { name: 'Assets', path: '/assets' },
    { name: 'Loans', path: '/loans' },
    { name: 'Investor', path: '/investor' }
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleNavigation = (path) => {
        handleCloseNavMenu();
        navigate(path);
    };

    const client = createThirdwebClient({
        clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
    });

    return (
        <AppBar
            position="static"
            sx={{
                background: 'transparent',
                backdropFilter: 'blur(8px)',
                boxShadow: 'none',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                width: '100%',
                maxWidth: '100%'
            }}
        >
            <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
                <Toolbar disableGutters sx={{ width: '100%' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src={liquidRealEstateLogo}
                            alt="Liquid Real Estate Logo"
                            style={{ width: '100px', height: '100px' }}
                        />
                    </Link>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                                '& .MuiPaper-root': {
                                    background: 'rgba(26, 26, 26, 0.8)',
                                    backdropFilter: 'blur(8px)',
                                }
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page.name}
                                    onClick={() => handleNavigation(page.path)}
                                >
                                    <Typography sx={{ textAlign: 'center' }}>{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => handleNavigation(page.path)}
                                sx={{
                                    mx: 1,
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    '&:hover': {
                                        color: '#00FF9D',
                                        background: 'transparent'
                                    }
                                }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>
                    <ConnectButton theme={darkTheme({
                        colors: {
                            primaryButtonBg: 'var(--accent-gradient)',
                            primaryButtonText: 'var(--text-primary)',
                        }
                    })
                    } client={client} />
                    {/* <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{
                                mt: '45px',
                                '& .MuiPaper-root': {
                                    background: 'rgba(26, 26, 26, 0.8)',
                                    backdropFilter: 'blur(8px)',
                                }
                            }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box> */}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;
