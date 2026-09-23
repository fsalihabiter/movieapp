import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, Button, IconButton, Checkbox,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    TextField, CircularProgress, Divider, Collapse, InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const AddToListDialog = ({
    open,
    onClose,
    lists,
    movieId,
    movieTitle,
    posterPath,
    mediaType = 'movie',
    onListsUpdated
}) => {
    const { showToast } = useToast();
    const [newListTitle, setNewListTitle] = useState('');
    const [creatingList, setCreatingList] = useState(false);
    const [actionLoading, setActionLoading] = useState({});
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDialogClose = () => {
        setShowCreateForm(false);
        setNewListTitle('');
        setSearchQuery('');
        onClose();
    };

    // Filter out system_favorites as it has a dedicated favorite button
    const selectableLists = lists.filter(l => l.type !== 'system_favorites');
    const filteredLists = selectableLists.filter(l =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

    const handleToggleList = async (list) => {
        const isAlreadyInList = list.contentItems?.some(item => item.movieId === movieId.toString());
        const listId = list._id;

        setActionLoading(prev => ({ ...prev, [listId]: true }));

        try {
            if (isAlreadyInList) {
                // Remove from list
                await api.delete(`/lists/${listId}/remove/${movieId}`);
                const updatedLists = lists.map(l => {
                    if (l._id === listId) {
                        return {
                            ...l,
                            contentItems: (l.contentItems || []).filter(item => item.movieId !== movieId.toString())
                        };
                    }
                    return l;
                });
                onListsUpdated(updatedLists);
                showToast(`"${list.title}" listesinden çıkarıldı.`, 'info');
            } else {
                // Add to list
                const newItem = {
                    movieId: movieId.toString(),
                    posterPath: posterPath || '',
                    title: movieTitle || '',
                    mediaType: mediaType || 'movie'
                };
                await api.post(`/lists/${listId}/add`, newItem);
                const updatedLists = lists.map(l => {
                    if (l._id === listId) {
                        return {
                            ...l,
                            contentItems: [...(l.contentItems || []), newItem]
                        };
                    }
                    return l;
                });
                onListsUpdated(updatedLists);
                showToast(`"${list.title}" listesine eklendi!`, 'success');
            }
        } catch (err) {
            console.error(err);
            showToast('İşlem gerçekleştirilirken bir hata oluştu.', 'error');
        } finally {
            setActionLoading(prev => ({ ...prev, [listId]: false }));
        }
    };

    const handleCreateAndAdd = async (e) => {
        e.preventDefault();
        const trimmedTitle = newListTitle.trim();
        if (!trimmedTitle) return;

        // Check if a list with this name already exists
        if (selectableLists.some(l => l.title.toLowerCase() === trimmedTitle.toLowerCase())) {
            showToast(`"${trimmedTitle}" adında bir liste zaten var.`, 'warning');
            return;
        }

        setCreatingList(true);
        try {
            // 1. Create the new custom list
            const createRes = await api.post('/lists', {
                title: trimmedTitle,
                type: 'custom'
            });
            const createdList = createRes.data;

            // 2. Add current movie to the new list
            const newItem = {
                movieId: movieId.toString(),
                posterPath: posterPath || '',
                title: movieTitle || '',
                mediaType: mediaType || 'movie'
            };
            await api.post(`/lists/${createdList._id}/add`, newItem);

            const populatedList = {
                ...createdList,
                contentItems: [newItem]
            };

            onListsUpdated([...lists, populatedList]);
            setNewListTitle('');
            setShowCreateForm(false);
            showToast(`"${trimmedTitle}" listesi oluşturuldu ve içerik eklendi!`, 'success');
        } catch (err) {
            console.error(err);
            showToast('Yeni liste oluşturulurken bir hata oluştu.', 'error');
        } finally {
            setCreatingList(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    background: 'rgba(10, 20, 45, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '24px',
                    color: '#fff',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 255, 255, 0.1)',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, pt: 2, px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PlaylistAddIcon sx={{ color: 'var(--neon-cyan)' }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '0.5px' }}>
                        Listelere Ekle
                    </Typography>
                </Box>
                <IconButton onClick={handleDialogClose} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2 }}>
                    İçeriği eklemek veya çıkarmak istediğiniz listeleri seçin:
                </Typography>

                {/* Search Bar when there are multiple lists */}
                {selectableLists.length > 3 && (
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
                            mb: 1.5,
                            '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                '&:hover fieldset': { borderColor: 'var(--neon-cyan)' },
                                '&.Mui-focused fieldset': { borderColor: 'var(--neon-cyan)' }
                            }
                        }}
                    />
                )}

                {/* List of user lists with checkboxes & scroll container */}
                <List sx={{
                    width: '100%', bgcolor: 'transparent', p: 0, mb: 2,
                    maxHeight: '260px', overflowY: 'auto', pr: 0.5,
                    '&::-webkit-scrollbar': { width: '5px' },
                    '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.02)', borderRadius: '10px' },
                    '&::-webkit-scrollbar-thumb': { background: 'var(--glass-border)', borderRadius: '10px', '&:hover': { background: 'var(--neon-cyan)' } }
                }}>
                    {filteredLists.length === 0 ? (
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', py: 3, textAlign: 'center', fontSize: '0.85rem' }}>
                            {searchQuery ? `"${searchQuery}" ile eşleşen liste bulunamadı.` : 'Henüz bir liste bulunmuyor.'}
                        </Typography>
                    ) : (
                        filteredLists.map(list => {
                            const isInList = list.contentItems?.some(item => item.movieId === movieId.toString());
                            const isSystemWatchlist = list.type === 'system_watchlist';
                            const isLoading = actionLoading[list._id];

                            return (
                                <ListItem
                                    key={list._id}
                                    disablePadding
                                    sx={{
                                        mb: 1,
                                        borderRadius: '14px',
                                        border: isInList ? '1px solid var(--neon-cyan)' : '1px solid rgba(255,255,255,0.08)',
                                        background: isInList ? 'rgba(0, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            background: 'rgba(0, 255, 255, 0.12)',
                                            borderColor: 'var(--neon-cyan)'
                                        }
                                    }}
                                >
                                    <ListItemButton
                                        onClick={() => handleToggleList(list)}
                                        disabled={isLoading}
                                        sx={{ py: 1.2, px: 2, borderRadius: '14px' }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            {isLoading ? (
                                                <CircularProgress size={20} sx={{ color: 'var(--neon-cyan)' }} />
                                            ) : (
                                                <Checkbox
                                                    edge="start"
                                                    checked={Boolean(isInList)}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    checkedIcon={<BookmarkIcon sx={{ color: 'var(--neon-cyan)' }} />}
                                                    icon={<BookmarkBorderIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />}
                                                />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography sx={{ fontWeight: isInList ? 700 : 500, color: isInList ? '#fff' : 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
                                                    {list.title}
                                                    {isSystemWatchlist && (
                                                        <Typography component="span" sx={{ ml: 1, fontSize: '0.75rem', color: 'var(--neon-cyan)', opacity: 0.8 }}>
                                                            (Varsayılan)
                                                        </Typography>
                                                    )}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
                                                    {list.contentItems?.length || 0} içerik
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })
                    )}
                </List>

                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* Optional / On-Demand New List Creation */}
                {!showCreateForm ? (
                    <Button
                        startIcon={<AddIcon />}
                        onClick={() => setShowCreateForm(true)}
                        fullWidth
                        sx={{
                            mt: 0.5,
                            py: 1.1,
                            color: 'var(--neon-cyan)',
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            border: '1px dashed rgba(0, 255, 255, 0.35)',
                            background: 'rgba(0, 255, 255, 0.03)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: 'var(--neon-cyan)',
                                background: 'rgba(0, 255, 255, 0.09)',
                                boxShadow: '0 0 12px rgba(0, 255, 255, 0.2)'
                            }
                        }}
                    >
                        Yeni Liste Oluştur
                    </Button>
                ) : (
                    <Collapse in={showCreateForm}>
                        <Box component="form" onSubmit={handleCreateAndAdd} sx={{
                            mt: 0.5, p: 2, borderRadius: '16px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(0, 255, 255, 0.25)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                        }}>
                            <Typography variant="caption" sx={{ color: 'var(--neon-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', mb: 1 }}>
                                Yeni Liste Adı
                            </Typography>
                            <TextField
                                autoFocus
                                size="small"
                                fullWidth
                                placeholder="Ör. Hafta Sonu, Favori Bilim Kurgu..."
                                value={newListTitle}
                                onChange={(e) => setNewListTitle(e.target.value)}
                                disabled={creatingList}
                                sx={{
                                    mb: 1.5,
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        borderRadius: '12px',
                                        fontSize: '0.85rem',
                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                        '&:hover fieldset': { borderColor: 'var(--neon-cyan)' },
                                        '&.Mui-focused fieldset': { borderColor: 'var(--neon-cyan)' }
                                    }
                                }}
                            />
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setNewListTitle('');
                                    }}
                                    sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'none', borderRadius: '10px' }}
                                >
                                    Vazgeç
                                </Button>
                                <Button
                                    type="submit"
                                    size="small"
                                    variant="contained"
                                    disabled={!newListTitle.trim() || creatingList}
                                    sx={{
                                        borderRadius: '10px',
                                        backgroundColor: 'var(--neon-cyan)',
                                        color: '#000',
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        px: 2,
                                        '&:hover': { backgroundColor: '#fff' }
                                    }}
                                >
                                    {creatingList ? <CircularProgress size={16} sx={{ color: '#000' }} /> : 'Oluştur ve Ekle'}
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 1, justifyContent: 'flex-end' }}>
                <Button
                    onClick={handleDialogClose}
                    sx={{
                        color: 'rgba(255,255,255,0.7)',
                        textTransform: 'none',
                        borderRadius: '10px',
                        px: 3,
                        '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
                    }}
                >
                    Tamam
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddToListDialog;
