import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Box, Typography, Card, CardContent, CircularProgress, Button, TextField, Collapse, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { teal, red } from '@mui/material/colors';

const MyLists = () => {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openNewList, setOpenNewList] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');

    const fetchLists = async () => {
        try {
            await api.post('/lists/init'); // Creates system lists automatically if missing
            const res = await api.get('/lists');
            setLists(res.data);
        } catch (err) {
            console.error(err);
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
            fetchLists(); 
        } catch(err) {
            console.error(err);
        }
    };

    const handleDeleteList = async (id) => {
        try {
            await api.delete(`/lists/${id}`);
            fetchLists();
        } catch (err) {
            alert(err.response?.data || "Silinemedi");
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4, minHeight: '80vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" color={teal[200]}>Kişisel Listelerim</Typography>
                <Button variant="contained" sx={{ backgroundColor: teal[500], '&:hover': { backgroundColor: teal[700]} }} onClick={() => setOpenNewList(!openNewList)}>
                    + YENİ LİSTE
                </Button>
            </Box>

            <Collapse in={openNewList} sx={{ mb: 4 }}>
                <Card sx={{ p: 3, backgroundColor: '#212121' }}>
                    <Typography variant="h6" mb={2}>Yeni Liste Oluştur</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField 
                            label="Liste Adı" 
                            variant="outlined" 
                            size="small" 
                            value={newListTitle}
                            onChange={(e) => setNewListTitle(e.target.value)}
                            sx={{ input: { color: '#fff' }, flexGrow: 1 }}
                            InputLabelProps={{ style: { color: teal[100] } }}
                        />
                        <Button variant="contained" onClick={handleCreateList}>Oluştur</Button>
                    </Box>
                </Card>
            </Collapse>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {lists.map(list => (
                    <Card key={list._id} sx={{ backgroundColor: '#1A2027', border: `1px solid ${teal[900]}` }}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h6" color="#fff">{list.title} {list.type !== 'custom' && <Typography component="span" fontSize="0.8rem" color={teal[200]}>(Sistem)</Typography>}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {list.contentItems.length} İçerik Eklendi
                                </Typography>
                            </Box>
                            {list.type === 'custom' && (
                                <IconButton onClick={() => handleDeleteList(list._id)} sx={{ color: red[400] }}>
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default MyLists;