import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Skeleton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Hero = () => {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch a trending movie to showcase in Hero
        axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR`)
            .then((res) => {
                const results = res.data.results;
                // Get top trending movie or random top 5
                const randomMovie = results[Math.floor(Math.random() * 5)];
                setMovie(randomMovie);
            })
            .catch((e) => console.log(e))
            .finally(() => setLoading(false));
    }, []);

    if (loading || !movie) return <Skeleton variant="rectangular" width="100%" height="80vh" sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 4 }} />;

    return (
        <Box sx={{
            width: '100%',
            height: '85vh',
            backgroundImage: `linear-gradient(to top, #05051a 0%, rgba(21, 0, 48, 0.6) 40%, rgba(0, 0, 0, 0.1) 100%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: { xs: 4, md: 8 },
            mb: 2,
            marginTop: '-68.5px' // Navbar height negative margin to allow absolute positioning seamlessly
        }}>
            <Box sx={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <Typography variant="h2" mb={2} fontWeight={800} sx={{ textShadow: '2px 2px 20px rgba(0,0,0,0.8)', fontSize: { xs: '2.5rem', md: '4rem' } }}>
                    {movie.title || movie.name}
                </Typography>
                <Typography variant="body1" mb={4} sx={{ maxWidth: '600px', textShadow: '1px 1px 10px rgba(0,0,0,0.8)', fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
                    {movie.overview.length > 250 ? movie.overview.substring(0, 250) + "..." : movie.overview}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Link to={`/moviedetails/${movie.id}`}>
                        <Button variant="contained" size="large" sx={{ 
                            backgroundColor: 'rgba(0, 255, 255, 0.9)', 
                            color: '#000', 
                            fontWeight: 800, 
                            borderRadius: '12px',
                            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
                            px: 4, py: 1.5,
                            '&:hover': { backgroundColor: '#fff', boxShadow: '0 0 35px rgba(0, 255, 255, 0.9)' }
                        }} startIcon={<PlayArrowIcon />}>
                            Hemen İncele
                        </Button>
                    </Link>
                    <Button variant="contained" size="large" sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                        color: '#fff', 
                        fontWeight: 700, 
                        px: 4, py: 1.5,
                        borderRadius: '12px',
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: 'rgba(255, 255, 255, 0.5)' }
                    }} startIcon={<InfoOutlinedIcon />}>
                        Daha Fazla Bilgi
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Hero;
