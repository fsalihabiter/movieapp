import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import '../assets/css/home.css';

const MyFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                await api.post('/lists/init');
                const res = await api.get('/lists');
                const favList = res.data.find(list => list.type === 'system_favorites');
                
                if (favList && favList.contentItems.length > 0) {
                    // Fetch dynamic localized data from TMDB for each item
                    const localizedFavorites = await Promise.all(favList.contentItems.map(async (item) => {
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
                    setFavorites(localizedFavorites);
                } else {
                    setFavorites([]);
                }
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchFavorites();
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}><CircularProgress sx={{ color: 'var(--neon-cyan)' }} /></Box>;

    return (
        <Box sx={{ px: { xs: 2, md: 5 }, pt: { xs: 2, md: 3 }, pb: 8, minHeight: '80vh', maxWidth: '1400px', margin: '0 auto' }}>
            <Typography variant="h3" mb={4} sx={{ color: '#fff', fontWeight: 800, textShadow: '0 0 15px var(--neon-cyan-faded)' }}>
                FAVORİLERİM
            </Typography>
            
            {favorites.length === 0 ? (
                <Box className="glass-panel" sx={{ p: 5, textAlign: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }}>Henüz bir favoriniz bulunmuyor. Bir filmin detay sayfasından kalbe tıklayarak favorilerinize ekleyebilirsiniz.</Typography>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {favorites.map((item) => (
                        <Grid item xs={6} sm={4} md={3} lg={2.4} key={item.movieId} sx={{ display: 'flex' }}>
                            <Box className="movie glass-panel" sx={{ width: '100%', position: 'relative' }}>
                                <Link to={item.type === 'tv' ? `/seriesdetails/${btoa(item.movieId.toString())}` : `/moviedetails/${btoa(item.movieId.toString())}`} style={{ width: '100%', height: '100%', display: 'block' }}>
                                    {item.posterPath ? (
                                        <img src={`https://image.tmdb.org/t/p/w500${item.posterPath}`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Box className="poster_null">
                                            <Typography className="poster_null_title">{item.title}</Typography>
                                        </Box>
                                    )}
                                    {/* Hover Overlay specifically for favorites to show title if needed */}
                                    <Box sx={{ 
                                        position: 'absolute', bottom: 0, left: 0, right: 0, 
                                        background: 'linear-gradient(to top, rgba(0,0,0,1), transparent)', 
                                        p: 2, pt: 5, 
                                        opacity: 0, transition: '0.4s', 
                                        '.movie:hover &': { opacity: 1 } 
                                    }}>
                                        <Typography sx={{ color: '#fff', fontWeight: 900, textAlign: 'center', textShadow: '0 0 10px rgba(0,255,255,0.8)' }}>
                                            {item.title}
                                        </Typography>
                                    </Box>
                                </Link>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default MyFavorites;