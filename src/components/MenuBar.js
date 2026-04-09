import React, { useEffect, useState } from 'react'
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
import { useTranslation } from 'react-i18next';

import { NavLink } from 'react-router-dom';

const MenuBar = () => {
    const { t, i18n } = useTranslation();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

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
        getPages(t('menu.home'), '1', '/home', null),
        getPages(t('menu.movies'), '2', '/movies', null),
        getPages(t('menu.series'), '3', '/series', null),
        getPages(t('menu.actors'), '4', '/actors', null),
    ];

    const settings = [
        getPages(t('menu.profile'), '1', '/profile', null),
        getPages(t('menu.mylists'), '2', '/mylists', null),
        getPages(t('menu.favorites'), '3', '/myfavorites', null),
        getPages(t('menu.logout'), '4', '/logout', null),
    ];

    return (
        <AppBar position="fixed" sx={{ 
            backgroundColor: scrolled ? 'rgba(6, 25, 59, 0.7)' : 'transparent',
            backdropFilter: scrolled ? 'blur(30px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(30px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(0, 255, 255, 0.3)' : 'none',
            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
            boxShadow: scrolled ? '0 5px 30px rgba(0, 255, 255, 0.2), 0 10px 50px rgba(255, 0, 255, 0.15), inset 0 -2px 10px rgba(255, 170, 0, 0.1)' : 'none',
            zIndex: 1100
        }}>
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

                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Typography sx={{ cursor: 'pointer', color: teal[200], fontWeight: 'bold' }} onClick={() => i18n.changeLanguage(i18n.resolvedLanguage === 'tr' ? 'en' : 'tr')}>
                            {i18n.resolvedLanguage === 'tr' ? 'EN' : 'TR'}
                        </Typography>
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