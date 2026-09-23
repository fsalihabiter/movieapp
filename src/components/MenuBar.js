import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
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
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import appLogo from '../assets/images/logo.png';

const MenuBar = () => {
    const { user } = useContext(AuthContext);
    const { t, i18n } = useTranslation();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 30;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    function getPages(label, key, path, icon) {
        return { label, key, path, icon };
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

    const navLinkHoverStyle = {
        color: '#fff',
        fontSize: '0.95rem',
        fontWeight: '500',
        px: 2, py: 1, 
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        borderRadius: '10px',
        '&:hover': {
            backgroundColor: 'var(--neon-cyan-faded)',
            color: 'var(--neon-cyan)',
            boxShadow: '0 0 20px var(--neon-cyan-faded)',
            transform: 'translateY(-2px)'
        }
    };

    return (
        <AppBar position="fixed" elevation={0} sx={{ 
            backgroundColor: scrolled ? 'rgba(5, 10, 25, 0.95)' : 'transparent',
            backdropFilter: scrolled ? 'blur(40px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(40px)' : 'none',
            border: scrolled ? '1px solid var(--glass-border)' : 'none',
            borderRadius: scrolled ? '20px' : '0px',
            pointerEvents: 'none',
            top: scrolled ? '20px' : '0px',
            maxWidth: scrolled ? '1200px' : '100%',
            left: 0,
            right: 0,
            margin: 'auto',
            transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
            boxShadow: scrolled ? '0 15px 35px rgba(0,0,0,0.6), 0 0 15px rgba(0, 255, 255, 0.1)' : 'none',
            zIndex: 1100,
            width: scrolled ? '95%' : '100%'
        }}>
            <Container maxWidth="xxl">
                <Toolbar disableGutters sx={{ minHeight: scrolled ? '60px !important' : '80px !important', transition: 'all 0.5s', pointerEvents: 'auto' }}>
                    <Box component="a" href="/" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', textDecoration: 'none', mr: 4 }}>
                        <img src={appLogo} alt="Movie App" style={{ height: scrolled ? '40px' : '55px', transition: 'all 0.5s', mixBlendMode: 'screen', filter: 'drop-shadow(0 0 5px rgba(0,255,255,0.5))' }} />
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} sx={{ color: 'var(--neon-cyan)' }}>
                            <MenuIcon />
                        </IconButton>
                        <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left' }} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{ display: { xs: 'block', md: 'none' } }} 
                              PaperProps={{ sx: { bgcolor: 'rgba(10, 20, 45, 0.9)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)', color: '#fff' } }}>
                            {pages.map((page) => (
                                <NavLink key={page.key} to={page.path} onClick={handleCloseNavMenu} style={{ textDecoration: 'none' }}>
                                    <Typography textAlign="center" sx={{ px: 3, py: 1, color: '#fff' }}>{page.label}</Typography>
                                </NavLink>
                            ))}
                        </Menu>
                    </Box>

                    <Box component="a" href="/" sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', textDecoration: 'none', mr: 2, flexGrow: 1 }}>
                        <img src={appLogo} alt="Movie App" style={{ height: '35px', mixBlendMode: 'screen' }} />
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'flex-start', gap: '1rem' }}>
                        {pages.map((page) => (
                            <NavLink key={page.key} to={page.path} onClick={handleCloseNavMenu} style={{ textDecoration: 'none' }}>
                                <Typography textAlign="center" sx={navLinkHoverStyle}>{page.label}</Typography>
                            </NavLink>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Typography sx={{ cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', '&:hover':{color:'var(--neon-cyan)', textShadow:'0 0 10px var(--neon-cyan)'}, transition: '0.3s' }} onClick={() => i18n.changeLanguage(i18n.resolvedLanguage === 'tr' ? 'en' : 'tr')}>
                            {i18n.resolvedLanguage === 'tr' ? 'EN' : 'TR'}
                        </Typography>
                        {user ? (
                            <>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, border: '2px solid transparent', transition: '0.3s', '&:hover': { border: '2px solid var(--neon-cyan)', boxShadow: '0 0 10px var(--neon-cyan)' } }}>
                                        <Avatar alt="User" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'var(--neon-cyan)' }}>{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}
                                      PaperProps={{ sx: { bgcolor: 'rgba(10, 20, 45, 0.95)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)', color: '#fff', minWidth: '150px' } }}>
                                    {settings.map((setting) => (
                                        <NavLink key={setting.key} to={setting.path} onClick={handleCloseUserMenu} style={{ textDecoration: 'none' }}>
                                            <Typography textAlign="center" sx={{ px: 3, py: 1.5, color: '#fff', '&:hover': { bgcolor: 'rgba(0, 255, 255, 0.1)', color: 'var(--neon-cyan)' }, transition: '0.2s' }}>{setting.label}</Typography>
                                        </NavLink>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            <NavLink to="/login" style={{ textDecoration: 'none' }}>
                                <Typography sx={{ 
                                    color: '#000', bgcolor: 'var(--neon-cyan)', px: 3, py: 1, borderRadius: '20px', fontWeight: 'bold',
                                    transition: '0.3s', boxShadow: '0 0 10px var(--neon-cyan-faded)',
                                    '&:hover': { bgcolor: '#fff', boxShadow: '0 0 20px var(--neon-cyan)' }
                                }}>
                                    Giriş Yap
                                </Typography>
                            </NavLink>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default MenuBar;