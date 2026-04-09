import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Box, Typography, Grid, Card, CardMedia, CardContent, CircularProgress } from '@mui/material';
import { teal } from '@mui/material/colors';
import { Link } from 'react-router-dom';

const MyFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                // Initialize system lists if not exist
                await api.post('/lists/init');
                const res = await api.get('/lists');
                const favList = res.data.find(list => list.type === 'system_favorites');
                if (favList) {
                    setFavorites(favList.contentItems);
                }
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchFavorites();
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4, minHeight: '80vh' }}>
            <Typography variant="h4" mb={4} color={teal[200]}>Favorilerim</Typography>
            {favorites.length === 0 ? (
                <Typography color="text.secondary">Henüz bir favoriniz bulunmuyor.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {favorites.map((item) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.movieId}>
                            <Card sx={{ backgroundColor: '#212121', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Link to={`/moviedetails/${item.movieId}`} style={{ textDecoration: 'none' }}>
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={item.posterPath ? `https://image.tmdb.org/t/p/w500${item.posterPath}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                                        alt={item.title}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" color="#fff" fontSize="1rem" noWrap>
                                            {item.title}
                                        </Typography>
                                    </CardContent>
                                </Link>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default MyFavorites;