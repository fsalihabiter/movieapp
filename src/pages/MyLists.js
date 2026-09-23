import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';
import {
    Box, Typography, CircularProgress, Button, TextField,
    IconButton, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
    Menu, MenuItem, Chip, InputAdornment, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import MovieIcon from '@mui/icons-material/Movie';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { red } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import '../assets/css/home.css';

const MyLists = () => {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openNewList, setOpenNewList] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');
    const { showToast } = useToast();
    const [selectedListId, setSelectedListId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all' | 'custom' | 'system'
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
            if (localizedLists.length > 0) {
                setSelectedListId(prev => {
                    if (prev && localizedLists.some(l => l._id === prev)) return prev;
                    return localizedLists[0]._id;
                });
            }
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
            const res = await api.post('/lists', { title: newListTitle, type: 'custom' });
            const created = res.data;
            setNewListTitle('');
            setOpenNewList(false);
            showToast("Liste başarıyla oluşturuldu.", "success");
            await fetchLists();
            setSelectedListId(created._id);
        } catch(err) {
            console.error(err);
            showToast("Liste oluşturulamadı.", "error");
        }
    };

    const handleDeleteList = async (id) => {
        try {
            await api.delete(`/lists/${id}`);
            showToast("Liste silindi.", "success");
            const remaining = lists.filter(l => l._id !== id);
            if (selectedListId === id) {
                setSelectedListId(remaining.length > 0 ? remaining[0]._id : null);
            }
            fetchLists();
        } catch (err) {
            showToast(err.response?.data || "Silinemedi", "error");
        }
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
            await api.delete(`/lists/${sourceListId}/remove/${item.movieId}`);
            await api.post(`/lists/${targetListId}/add`, { movieId: item.movieId, posterPath: item.posterPath, title: item.title, mediaType: item.mediaType || item.type });
            showToast("İçerik başarıyla taşındı.", "success");
            fetchLists();
        } catch (err) {
            showToast("Taşıma işlemi sırasında bir hata oluştu.", "error");
        }
    };

    // Filter lists by search query and type
    const filteredLists = lists.filter(list => {
        const matchesSearch = list.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesType = filterType === 'all' 
            ? true 
            : filterType === 'custom' 
                ? list.type === 'custom' 
                : list.type !== 'custom';
        return matchesSearch && matchesType;
    });

    const activeList = lists.find(l => l._id === selectedListId) || filteredLists[0] || null;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: 'var(--neon-cyan)' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ px: { xs: 2, md: 5 }, pt: { xs: 2, md: 3 }, pb: 8, minHeight: '85vh', maxWidth: '1600px', margin: '0 auto' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
                <Box>
                    <Typography variant="h3" sx={{ color: '#fff', fontWeight: 900, textShadow: '0 0 20px var(--neon-cyan-faded)', fontSize: { xs: '2rem', md: '2.8rem' } }}>
                        KİŞİSEL LİSTELERİM
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
                        Toplam <strong>{lists.length}</strong> liste • Kütüphanenizi sol panelden seçerek düzenleyin.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenNewList(true)}
                    sx={{
                        backgroundColor: 'var(--neon-cyan)', color: '#000', fontWeight: 800, px: 3, py: 1.2, borderRadius: '14px',
                        boxShadow: '0 0 15px var(--neon-cyan-faded)', textTransform: 'none', fontSize: '0.95rem',
                        '&:hover': { backgroundColor: '#fff', boxShadow: '0 0 25px var(--neon-cyan)' }
                    }}
                >
                    Yeni Liste Oluştur
                </Button>
            </Box>

            {/* Create New List Modal */}
            <Dialog
                open={openNewList}
                onClose={() => setOpenNewList(false)}
                PaperProps={{
                    sx: {
                        background: 'rgba(10, 20, 45, 0.98)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '20px',
                        color: '#fff',
                        minWidth: { xs: '300px', sm: '400px' }
                    }
                }}
            >
                <DialogTitle sx={{ color: 'var(--neon-cyan)', fontWeight: 800, pb: 1 }}>Yeni Liste Oluştur</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                        Filmlerinizi ve dizilerinizi gruplayabileceğiniz özel bir liste adı belirleyin:
                    </Typography>
                    <TextField 
                        autoFocus
                        size="small"
                        placeholder="Ör. Hafta Sonu İzlenecekler..." 
                        fullWidth
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&:hover fieldset': { borderColor: 'var(--neon-cyan)' },
                                '&.Mui-focused fieldset': { borderColor: 'var(--neon-cyan)' }
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 0 }}>
                    <Button onClick={() => setOpenNewList(false)} sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'none' }}>İptal</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateList}
                        disabled={!newListTitle.trim()}
                        sx={{
                            bgcolor: 'var(--neon-cyan)', color: '#000', fontWeight: 700, borderRadius: '10px', textTransform: 'none', px: 2.5,
                            '&:hover': { bgcolor: '#fff' }
                        }}
                    >
                        Oluştur
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Master-Detail (Kütüphane) Düzeni */}
            <Grid container spacing={3}>
                {/* SOL PANEL: LİSTE GEZGİNİ (Sidebar) */}
                <Grid item xs={12} md={4} lg={3.5}>
                    <Box
                        className="glass-panel"
                        sx={{
                            p: 2.5, borderRadius: '24px',
                            display: 'flex', flexDirection: 'column', gap: 2,
                            position: { md: 'sticky' }, top: { md: '100px' }
                        }}
                    >
                        {/* Search Input */}
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Listelerimde ara..."
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

                        {/* Filter Chips */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                                label={`Tümü (${lists.length})`}
                                size="small"
                                onClick={() => setFilterType('all')}
                                sx={{
                                    bgcolor: filterType === 'all' ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.05)',
                                    color: filterType === 'all' ? '#000' : 'rgba(255,255,255,0.8)',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    borderRadius: '10px'
                                }}
                            />
                            <Chip
                                label={`Özel (${lists.filter(l => l.type === 'custom').length})`}
                                size="small"
                                onClick={() => setFilterType('custom')}
                                sx={{
                                    bgcolor: filterType === 'custom' ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.05)',
                                    color: filterType === 'custom' ? '#000' : 'rgba(255,255,255,0.8)',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    borderRadius: '10px'
                                }}
                            />
                            <Chip
                                label={`Sistem (${lists.filter(l => l.type !== 'custom').length})`}
                                size="small"
                                onClick={() => setFilterType('system')}
                                sx={{
                                    bgcolor: filterType === 'system' ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.05)',
                                    color: filterType === 'system' ? '#000' : 'rgba(255,255,255,0.8)',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    borderRadius: '10px'
                                }}
                            />
                        </Box>

                        {/* Scrollable List Container (Up to 30+ lists scroll cleanly without moving the whole page) */}
                        <Box
                            sx={{
                                display: 'flex', flexDirection: 'column', gap: 1,
                                maxHeight: { xs: '300px', md: '550px' }, overflowY: 'auto', pr: 0.5,
                                '&::-webkit-scrollbar': { width: '5px' },
                                '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.02)', borderRadius: '10px' },
                                '&::-webkit-scrollbar-thumb': { background: 'var(--glass-border)', borderRadius: '10px', '&:hover': { background: 'var(--neon-cyan)' } }
                            }}
                        >
                            {filteredLists.length === 0 ? (
                                <Typography sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', py: 4, fontSize: '0.85rem' }}>
                                    Eşleşen liste bulunamadı.
                                </Typography>
                            ) : (
                                filteredLists.map(list => {
                                    const isSelected = activeList && activeList._id === list._id;
                                    const isSystem = list.type !== 'custom';

                                    return (
                                        <Box
                                            key={list._id}
                                            onClick={() => setSelectedListId(list._id)}
                                            sx={{
                                                p: 1.8,
                                                borderRadius: '16px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                border: isSelected ? '1px solid var(--neon-cyan)' : '1px solid rgba(255,255,255,0.06)',
                                                background: isSelected ? 'rgba(0, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                                                boxShadow: isSelected ? '0 0 15px rgba(0, 255, 255, 0.2)' : 'none',
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                '&:hover': {
                                                    borderColor: 'var(--neon-cyan)',
                                                    background: 'rgba(0, 255, 255, 0.07)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                                                <PlaylistPlayIcon sx={{ color: isSelected ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.5)', fontSize: 22 }} />
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography
                                                        noWrap
                                                        sx={{
                                                            fontWeight: isSelected ? 800 : 600,
                                                            color: isSelected ? '#fff' : 'rgba(255,255,255,0.85)',
                                                            fontSize: '0.95rem'
                                                        }}
                                                    >
                                                        {list.title}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', display: 'block' }}>
                                                        {list.contentItems?.length || 0} İçerik {isSystem && '• Sistem'}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {list.type === 'custom' && (
                                                <Tooltip title="Listeyi Sil">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteList(list._id);
                                                        }}
                                                        sx={{
                                                            color: 'rgba(255,255,255,0.3)',
                                                            '&:hover': { color: red[400], bgcolor: 'rgba(255,0,0,0.1)' }
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    );
                                })
                            )}
                        </Box>
                    </Box>
                </Grid>

                {/* SAĞ PANEL: SEÇİLİ LİSTE İÇERİĞİ VE FİLMLER */}
                <Grid item xs={12} md={8} lg={8.5}>
                    {activeList ? (
                        <Box className="glass-panel" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: '24px', minHeight: '600px' }}>
                            {/* Active List Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, mb: 3, borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: 2 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }}>
                                            {activeList.title}
                                        </Typography>
                                        <Chip
                                            label={activeList.type === 'custom' ? 'Özel Liste' : 'Sistem Listesi'}
                                            size="small"
                                            sx={{
                                                bgcolor: activeList.type === 'custom' ? 'rgba(0,255,255,0.1)' : 'rgba(255,0,255,0.1)',
                                                color: activeList.type === 'custom' ? 'var(--neon-cyan)' : 'var(--neon-magenta)',
                                                border: `1px solid ${activeList.type === 'custom' ? 'var(--neon-cyan)' : 'var(--neon-magenta)'}`,
                                                fontWeight: 700, fontSize: '0.75rem', borderRadius: '8px'
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'var(--neon-cyan)', mt: 0.5, fontWeight: 700 }}>
                                        {activeList.contentItems.length} Film / Dizi Kayıtlı
                                    </Typography>
                                </Box>

                                {activeList.type === 'custom' && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        size="small"
                                        onClick={() => handleDeleteList(activeList._id)}
                                        sx={{
                                            borderRadius: '12px', textTransform: 'none', fontWeight: 700,
                                            borderColor: 'rgba(255, 77, 77, 0.4)',
                                            '&:hover': { borderColor: red[400], bgcolor: 'rgba(255, 77, 77, 0.1)' }
                                        }}
                                    >
                                        Bu Listeyi Sil
                                    </Button>
                                )}
                            </Box>

                            {/* Movie Grid */}
                            {activeList.contentItems.length === 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, textAlign: 'center' }}>
                                    <MovieIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                                        Bu listede henüz içerik yok.
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', maxWidth: '400px', mt: 1, mb: 3 }}>
                                        Filmleri ve dizileri keşfederken detay sayfalarındaki "Listelere Ekle" butonuyla buraya ekleyebilirsiniz.
                                    </Typography>
                                    <Button
                                        component={Link}
                                        to="/movies"
                                        variant="contained"
                                        sx={{
                                            backgroundColor: 'var(--neon-cyan)', color: '#000', fontWeight: 700,
                                            borderRadius: '12px', textTransform: 'none', px: 3,
                                            '&:hover': { backgroundColor: '#fff' }
                                        }}
                                    >
                                        Filmleri Keşfet
                                    </Button>
                                </Box>
                            ) : (
                                <Grid container spacing={2.5}>
                                    {activeList.contentItems.map((item) => (
                                        <Grid item xs={6} sm={4} md={4} lg={3} key={item.movieId} sx={{ display: 'flex' }}>
                                            <Box
                                                className="movie"
                                                sx={{
                                                    width: '100%', position: 'relative', borderRadius: '16px', overflow: 'hidden',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.06)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': { transform: 'translateY(-4px)', borderColor: 'var(--neon-cyan)', boxShadow: '0 12px 30px rgba(0,255,255,0.2)' }
                                                }}
                                            >
                                                <Link
                                                    to={item.type === 'tv' ? `/seriesdetails/${btoa(item.movieId.toString())}` : `/moviedetails/${btoa(item.movieId.toString())}`}
                                                    style={{ width: '100%', height: '100%', display: 'block' }}
                                                >
                                                    {item.posterPath ? (
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                                                            alt={item.title}
                                                            style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                                                        />
                                                    ) : (
                                                        <Box sx={{ width: '100%', aspectRatio: '2/3', bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                                                            <Typography sx={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.title}</Typography>
                                                        </Box>
                                                    )}

                                                    {/* Hover Overlay */}
                                                    <Box
                                                        sx={{ 
                                                            position: 'absolute', bottom: 0, left: 0, right: 0, 
                                                            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 60%, transparent 100%)', 
                                                            p: 2, pt: 6, opacity: 0, transition: '0.3s', 
                                                            '.movie:hover &': { opacity: 1 }, display: 'flex', flexDirection: 'column', alignItems: 'center'
                                                        }}
                                                    >
                                                        <Typography sx={{ color: '#fff', fontWeight: 800, textAlign: 'center', fontSize: '0.85rem', textShadow: '0 0 10px rgba(0,255,255,0.8)', mb: 1.5 }} noWrap>
                                                            {item.title}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Tooltip title="Başka Listeye Taşı">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => handleOpenMoveMenu(e, activeList._id, item)}
                                                                    sx={{ bgcolor: 'rgba(0,255,255,0.2)', color: 'var(--neon-cyan)', '&:hover': { bgcolor: 'var(--neon-cyan)', color: '#000' } }}
                                                                >
                                                                    <SwapHorizIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Listeden Çıkar">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => handleRemoveMovie(e, activeList._id, item.movieId)}
                                                                    sx={{ bgcolor: 'rgba(255,0,0,0.2)', color: '#ff4d4d', '&:hover': { bgcolor: '#ff4d4d', color: '#fff' } }}
                                                                >
                                                                    <RemoveCircleOutlineIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Box>
                                                </Link>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    ) : (
                        <Box className="glass-panel" sx={{ p: 6, borderRadius: '24px', textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <VideoLibraryIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Görüntülenecek liste seçilmedi.
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1 }}>
                                Soldaki panelden bir liste seçebilir veya yeni bir liste oluşturabilirsiniz.
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* Move Movie to Another List Context Menu */}
            <Menu
                anchorEl={moveAnchor}
                open={Boolean(moveAnchor)}
                onClose={handleCloseMoveMenu}
                PaperProps={{
                    sx: {
                        bgcolor: 'rgba(10, 20, 45, 0.98)',
                        backdropFilter: 'blur(15px)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        color: '#fff',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
                    }
                }}
            >
                <Typography sx={{ px: 2, py: 1, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Hangi listeye taşınsın?
                </Typography>
                {lists.filter(l => moveData && l._id !== moveData.sourceListId).map(list => (
                    <MenuItem
                        key={list._id}
                        onClick={() => handleMoveMovie(list._id)}
                        sx={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            borderRadius: '8px',
                            mx: 0.5,
                            '&:hover': { bgcolor: 'rgba(0, 255, 255, 0.1)', color: 'var(--neon-cyan)' }
                        }}
                    >
                        {list.title}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default MyLists;