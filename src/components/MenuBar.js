import React from 'react'
import { teal } from '@mui/material/colors';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import NotStartedIcon from '@mui/icons-material/NotStarted';

import { NavLink } from 'react-router-dom';

const MenuBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

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

    function getPages(label, key, path, icon) {
        return {
            label,
            key,
            path,
            icon,
        };
    }

    const pages = [
        getPages('Anasayfa', '1', '/home', null),
        getPages('Filmler', '2', '/movies', null),
        getPages('Diziler', '3', '/series', null),
        getPages('Oyuncular', '4', '/actors', null),
    ];

    const settings = [
        getPages('Profil', '1', '/profile', null),
        getPages('Listelerim', '2', '/mylists', null),
        getPages('Favoriler', '3', '/myfavorites', null),
        getPages('Çıkış', '4', '/logout', null),
    ];

    return (
        <AppBar position="static">
            <Container maxWidth="xxl">
                <Toolbar disableGutters>
                    <NotStartedIcon sx={{ display: { xs: 'none', md: 'flex', fontSize: '2.2rem' }, mr: 1 }}
                        htmlColor={teal['A700']}  />
                    <Typography variant="h4" noWrap component="a" href="/"
                        sx={{
                            mr: 2, display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace', fontWeight: 700,
                            letterSpacing: '.3rem', textDecoration: 'none',
                        }}
                        color={teal['A700']} >
                        MOVIE APP
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton size="large" aria-label="account of current user"
                            aria-controls="menu-appbar" aria-haspopup="true"
                            onClick={handleOpenNavMenu} htmlColor={teal['A700']}
                        >
                            <MenuIcon htmlColor={teal['A700']} />
                        </IconButton>
                        <Menu id="menu-appbar" anchorEl={anchorElNav}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'left', }}
                            open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' }, }}
                        >
                            {pages.map((page) => (
                                <NavLink 
                                    key={page.key} to={page.path} 
                                    onClick={handleCloseNavMenu} 
                                    style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} >
                                    <Typography textAlign="center" color={teal[200]}>{page.label}</Typography>
                                </NavLink>
                            ))}
                        </Menu>
                    </Box>
                    <NotStartedIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} htmlColor={teal['A700']} />
                    <Typography variant="h5" noWrap component="a" href=""
                        sx={{
                            mr: 2, display: { xs: 'flex', md: 'none' }, flexGrow: 1, fontFamily: 'monospace',
                            fontWeight: 700, letterSpacing: '.3rem', textDecoration: 'none',
                        }} color={teal['A700']}
                    >
                        MOVIE APP
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'stretch', minHeight: '64px', justifyContent: 'flex-start', gap: '1.5rem' }}>
                        {pages.map((page) => (
                            <NavLink key={page.key} to={page.path} onClick={handleCloseNavMenu} style={{ display: 'flex', alignItems: 'center', textDecoration: 'underline' }}>
                                <Typography textAlign="center" color={teal[200]}>{page.label}</Typography>
                            </NavLink>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} htmlColor={teal[200]}>
                                <Avatar alt="Saliha Biter" htmlColor={teal[200]}>SB</Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <NavLink key={setting.key} to={setting.path} onClick={handleCloseNavMenu} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', paddingTop: '5px', paddingBottom: '5px' }}>
                                    <Typography textAlign="center" color={teal[200]}>{setting.label}</Typography>
                                </NavLink>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default MenuBar