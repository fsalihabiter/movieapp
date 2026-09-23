import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, Button, IconButton, TextField,
    Grid, Avatar, InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';

const AllCastDialog = ({ open, onClose, cast = [], mediaTitle = '' }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const API_POSTER = "https://image.tmdb.org/t/p/w300";

    const filteredCast = cast.filter(actor => {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = actor.name?.toLowerCase().includes(query);
        const matchesCharacter = actor.character?.toLowerCase().includes(query);
        return matchesName || matchesCharacter;
    });

    const handleDialogClose = () => {
        setSearchQuery('');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    background: 'rgba(10, 20, 45, 0.96)',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '24px',
                    color: '#fff',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 255, 255, 0.1)',
                    p: { xs: 1, sm: 2 }
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, pt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PeopleIcon sx={{ color: 'var(--neon-cyan)', fontSize: 28 }} />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '0.5px' }}>
                            Oyuncu Kadrosu
                        </Typography>
                        {mediaTitle && (
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                                {mediaTitle} • Toplam {cast.length} Oyuncu
                            </Typography>
                        )}
                    </Box>
                </Box>
                <IconButton onClick={handleDialogClose} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
                {/* Search Bar */}
                {cast.length > 6 && (
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Oyuncu adı veya karakter ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            mb: 2.5,
                            '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                borderRadius: '14px',
                                fontSize: '0.9rem',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                                '&:hover fieldset': { borderColor: 'var(--neon-cyan)' },
                                '&.Mui-focused fieldset': { borderColor: 'var(--neon-cyan)' }
                            }
                        }}
                    />
                )}

                {/* Cast Grid Container */}
                <Box
                    sx={{
                        maxHeight: '60vh',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        pt: 1.5,
                        pb: 1.5,
                        px: 1,
                        pr: 1.5,
                        '&::-webkit-scrollbar': { width: '6px' },
                        '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.02)', borderRadius: '10px' },
                        '&::-webkit-scrollbar-thumb': { background: 'var(--glass-border)', borderRadius: '10px', '&:hover': { background: 'var(--neon-cyan)' } }
                    }}
                >
                    {filteredCast.length === 0 ? (
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', py: 6, fontSize: '0.95rem' }}>
                            {searchQuery ? `"${searchQuery}" ile eşleşen oyuncu bulunamadı.` : 'Kadro bilgisi bulunmuyor.'}
                        </Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {filteredCast.map(actor => (
                                <Grid item xs={12} sm={6} md={4} key={actor.id}>
                                    <Box
                                        component={Link}
                                        to={`/actordetails/${btoa(actor.id.toString())}`}
                                        onClick={handleDialogClose}
                                        sx={{
                                            display: 'flex', alignItems: 'center', gap: 2, p: 1.5,
                                            borderRadius: '16px', textDecoration: 'none',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            position: 'relative',
                                            zIndex: 1,
                                            transition: 'all 0.25s ease',
                                            '&:hover': {
                                                background: 'rgba(0, 255, 255, 0.08)',
                                                borderColor: 'var(--neon-cyan)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 0 20px rgba(0, 255, 255, 0.25)',
                                                zIndex: 2
                                            }
                                        }}
                                    >
                                        <Avatar
                                            src={actor.profile_path ? API_POSTER + actor.profile_path : ''}
                                            alt={actor.name}
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: '14px',
                                                border: '2px solid var(--neon-cyan)',
                                                flexShrink: 0
                                            }}
                                        >
                                            {actor.name ? actor.name.substring(0, 1) : '?'}
                                        </Avatar>
                                        <Box sx={{ minWidth: 0, flex: 1 }}>
                                            <Typography
                                                noWrap
                                                sx={{
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    fontSize: '0.95rem',
                                                    '&:hover': { color: 'var(--neon-cyan)' }
                                                }}
                                            >
                                                {actor.name}
                                            </Typography>
                                            <Typography
                                                noWrap
                                                variant="caption"
                                                sx={{
                                                    color: 'var(--neon-cyan)',
                                                    display: 'block',
                                                    opacity: 0.85,
                                                    fontWeight: 500
                                                }}
                                            >
                                                {actor.character ? actor.character : 'Rol belirtilmemiş'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 1, justifyContent: 'flex-end' }}>
                <Button
                    onClick={handleDialogClose}
                    variant="outlined"
                    sx={{
                        color: 'rgba(255,255,255,0.8)',
                        borderColor: 'rgba(255,255,255,0.2)',
                        textTransform: 'none',
                        borderRadius: '12px',
                        px: 3,
                        '&:hover': { color: '#fff', borderColor: 'var(--neon-cyan)', bgcolor: 'rgba(0,255,255,0.05)' }
                    }}
                >
                    Kapat
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AllCastDialog;
