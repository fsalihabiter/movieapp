import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';
import { Box, Typography, Card, CardContent, CircularProgress, Button, TextField, Collapse, IconButton, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Menu, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { teal, red } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import '../assets/css/home.css';

const MyLists = () => {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openNewList, setOpenNewList] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');
    const { showToast } = useToast();
    const [expanded, setExpanded] = useState(null);
    const [moveAnchor, setMoveAnchor] = useState(null);
    const [moveData, setMoveData] = useState(null);

    const fetchLists = async () => {
        try {
            await api.post('/lists/init'); // Creates system lists automatically if missing
            const res = await api.get('/lists');
            
            // Map dynamic localized data to each item in every list
            const localizedLists = await Promise.all(res.data.map(async (list) => {
                const localizedItems = await Promise.all(list.contentItems.map(async (item) => {
                    const targetType = item.mediaType || 'movie';
                    try {
                        const tmdbRes = await axios.get(`https://api.themoviedb.org/3/${targetType}/${item.movieId}?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR`);
                        return { 
                            ...item, 
                            posterPath: tmdbRes.data.poster_path || item.posterPath, 
                            title: tmdbRes.data.title || tmdbRes.data.name || item.title, 
                            type: targetType 
                        };
                    } catch (e) {
                        return { ...item, type: targetType };
                    }
                }));
                return { ...list, contentItems: localizedItems };
            }));

            setLists(localizedLists);
            if (localizedLists.length > 0 && expanded === null) setExpanded(localizedLists[0]._id);
        } catch (err) {
            console.error(err);
            showToast("Listeler çekilirken bir hata oluştu.", "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLists();
    }, []);

    const handleCreateList = async () => {
        if (!newListTitle.trim()) return;
        try {
            await api.post('/lists', { title: newListTitle, type: 'custom' });
            setNewListTitle('');
            setOpenNewList(false);
            showToast("Liste başarıyla oluşturuldu.", "success");
            fetchLists(); 
        } catch(err) {
            console.error(err);
            showToast("Liste oluşturulamadı.", "error");
        }
    };

    const handleDeleteList = async (id) => {
        try {
            await api.delete(`/lists/${id}`);
            showToast("Liste silindi.", "success");
            fetchLists();
        } catch (err) {
            showToast(err.response?.data || "Silinemedi", "error");
        }
    };

    const handleToggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const handleRemoveMovie = async (e, listId, movieId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.delete(`/lists/${listId}/remove/${movieId}`);
            showToast("İçerik listeden çıkarıldı.", "success");
            fetchLists();
        } catch (err) {
            showToast("İçerik silinirken hata oluştu.", "error");
        }
    };

    const handleOpenMoveMenu = (e, sourceListId, item) => {
        e.preventDefault();
        e.stopPropagation();
        setMoveAnchor(e.currentTarget);
        setMoveData({ sourceListId, item });
    };

    const handleCloseMoveMenu = () => {
        setMoveAnchor(null);
        setMoveData(null);
    };

    const handleMoveMovie = async (targetListId) => {
        if (!moveData) return;
        const { sourceListId, item } = moveData;
        handleCloseMoveMenu();
        try {
            // Remove from source
            await api.delete(`/lists/${sourceListId}/remove/${item.movieId}`);
            // Add to target
            await api.post(`/lists/${targetListId}/add`, { movieId: item.movieId, posterPath: item.posterPath, title: item.title, mediaType: item.mediaType || item.type });
            showToast("İçerik başarıyla taşındı.", "success");
            fetchLists();
        } catch (err) {
            showToast("Taşıma işlemi sırasında bir hata oluştu.", "error");
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress sx={{color: 'var(--neon-cyan)'}} /></Box>;

    return (
        <Box sx={{ p: { xs: 3, md: 6 }, minHeight: '80vh', maxWidth: '1400px', margin: '0 auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, textShadow: '0 0 15px var(--neon-cyan-faded)' }}>
                    KİŞİSEL LİSTELERİM
                </Typography>
                <Button variant="contained" sx={{ 
                    backgroundColor: 'var(--neon-cyan)', color: '#000', fontWeight: 'bold', 
                    '&:hover': { backgroundColor: '#fff', boxShadow: '0 0 15px var(--neon-cyan)' }
                }} onClick={() => setOpenNewList(!openNewList)}>
                    + YENİ LİSTE
                </Button>
            </Box>

            <Dialog open={openNewList} onClose={() => setOpenNewList(false)} PaperProps={{ sx: { bgcolor: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: '#fff', minWidth: '350px' } }}>
                <DialogTitle sx={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>Yeni Liste Oluştur</DialogTitle>
                <DialogContent>
                    <TextField 
                        autoFocus
                        margin="dense"
                        label="Liste Adı" 
                        variant="outlined" 
                        fullWidth
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        sx={{ input: { color: '#fff' }, fieldset: { borderColor: 'var(--glass-border)' }, mt: 2 }}
                        InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setOpenNewList(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>İptal</Button>
                    <Button variant="contained" onClick={handleCreateList} sx={{ bgcolor: 'var(--neon-cyan)', color: '#000', fontWeight: 'bold', '&:hover': { bgcolor: '#fff'} }}>Oluştur</Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {lists.map(list => (
                    <Box key={list._id} className="glass-panel" sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                        <Box onClick={() => handleToggleExpand(list._id)} sx={{ 
                            p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                            cursor: 'pointer', transition: '0.3s', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } 
                        }}>
                            <Box>
                                <Typography variant="h5" color="#fff" fontWeight="bold">
                                    {list.title} {list.type !== 'custom' && <Typography component="span" fontSize="0.9rem" sx={{ color: 'var(--neon-magenta)', ml: 1, fontWeight: 'normal' }}>(Sistem)</Typography>}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'var(--neon-cyan)', mt: 0.5, fontWeight: 'bold' }}>
                                    {list.contentItems.length} İçerik
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {list.type === 'custom' && (
                                    <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteList(list._id); }} sx={{ color: red[400], '&:hover': { bgcolor: 'rgba(255,0,0,0.1)' } }}>
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                                <ExpandMoreIcon sx={{ color: '#fff', transform: expanded === list._id ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }} />
                            </Box>
                        </Box>
                        
                        <Collapse in={expanded === list._id}>
                            <Box sx={{ p: 3, pt: 0, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                {list.contentItems.length === 0 ? (
                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', py: 2, textAlign: 'center', fontStyle: 'italic' }}>Bu listeye henüz içerik eklenmemiş.</Typography>
                                ) : (
                                    <Grid container spacing={3} sx={{ mt: 1 }}>
                                        {list.contentItems.map((item) => (
                                            <Grid item xs={6} sm={4} md={3} lg={2} key={item.movieId} sx={{ display: 'flex' }}>
                                                <Box className="movie" sx={{ width: '100%', position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}>
                                                    <Link to={item.type === 'tv' ? `/seriesdetails/${btoa(item.movieId.toString())}` : `/moviedetails/${btoa(item.movieId.toString())}`} style={{ width: '100%', height: '100%', display: 'block' }}>
                                                        {item.posterPath ? (
                                                            <img src={`https://image.tmdb.org/t/p/w500${item.posterPath}`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <Box sx={{ width: '100%', aspectRatio: '2/3', bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                                                                <Typography sx={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.title}</Typography>
                                                            </Box>
                                                        )}
                                                        <Box sx={{ 
                                                            position: 'absolute', bottom: 0, left: 0, right: 0, 
                                                            background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)', 
                                                            p: 1.5, pt: 6, opacity: 0, transition: '0.4s', 
                                                            '.movie:hover &': { opacity: 1 }, display: 'flex', flexDirection: 'column', alignItems: 'center'
                                                        }}>
                                                            <Typography sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: '0.8rem', textShadow: '0 0 10px rgba(0,255,255,0.8)', mb: 1 }}>
                                                                {item.title}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <IconButton size="small" onClick={(e) => handleOpenMoveMenu(e, list._id, item)} sx={{ bgcolor: 'rgba(0,255,255,0.2)', color: 'var(--neon-cyan)', '&:hover': { bgcolor: 'var(--neon-cyan)', color: '#000' } }} title="Başka Listeye Taşı">
                                                                    <SwapHorizIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton size="small" onClick={(e) => handleRemoveMovie(e, list._id, item.movieId)} sx={{ bgcolor: 'rgba(255,0,0,0.2)', color: '#ff4d4d', '&:hover': { bgcolor: '#ff4d4d', color: '#fff' } }} title="Listeden Çıkar">
                                                                    <RemoveCircleOutlineIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                    </Link>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        </Collapse>
                    </Box>
                ))}
            </Box>

            <Menu anchorEl={moveAnchor} open={Boolean(moveAnchor)} onClose={handleCloseMoveMenu} PaperProps={{ sx: { bgcolor: 'rgba(10, 20, 45, 0.95)', border: '1px solid var(--glass-border)', color: '#fff' } }}>
                {lists.filter(l => moveData && l._id !== moveData.sourceListId).map(list => (
                    <MenuItem key={list._id} onClick={() => handleMoveMovie(list._id)} sx={{ '&:hover': { bgcolor: 'rgba(0, 255, 255, 0.1)', color: 'var(--neon-cyan)' } }}>
                        {list.title}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default MyLists;