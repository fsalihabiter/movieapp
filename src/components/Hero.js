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
        axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR`)
            .then((res) => {
                const results = res.data.results;
                const randomMovie = results[Math.floor(Math.random() * 5)];
                setMovie(randomMovie);
            })
            .catch((e) => console.log(e))
            .finally(() => setLoading(false));
    }, []);

    if (loading || !movie) return <Skeleton variant="rectangular" width="100%" height="100vh" sx={{ bgcolor: 'rgba(255,255,255,0.02)', mb: 4 }} />;

    return (
        <Box sx={{
            width: '100%',
            height: '100vh',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: { xs: 4, md: 8 },
            mb: 5,
            marginTop: '-90px',
            pt: '100px',
        }}>
            {/* Background Layer with Gradient Fade to Theme Dark */}
            <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                backgroundSize: 'cover', backgroundPosition: 'top center',
                '&::after': {
                    content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: `linear-gradient(to top, var(--bg-dark) 0%, rgba(0, 2, 10, 0.7) 30%, rgba(0,0,0,0) 100%), linear-gradient(to right, var(--bg-dark) 0%, rgba(0,0,0,0) 50%)`
                }
            }} />

            <Box sx={{ maxWidth: '1200px', width: '100%', zIndex: 1 }} className="animate-entrance">
                <Typography variant="h1" mb={2} sx={{ 
                    fontWeight: 900, 
                    fontSize: { xs: '3rem', md: '5rem' }, 
                    lineHeight: 1.1,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: '#fff',
                    textShadow: '0 0 20px rgba(0,255,255,0.4), 0 0 40px rgba(0,255,255,0.2)'
                }}>
                    {movie.title || movie.name}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Typography sx={{ color: 'var(--neon-cyan)', fontWeight: 'bold', border: '1px solid var(--neon-cyan)', px: 1.5, py: 0.5, borderRadius: '4px', bgcolor: 'rgba(0,255,255,0.1)' }}>
                        {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} TMDB
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', px: 1, py: 0.5 }}>
                        {movie.release_date ? movie.release_date.split('-')[0] : ''}
                    </Typography>
                </Box>

                <Typography variant="body1" mb={5} sx={{ 
                    maxWidth: '700px', 
                    fontSize: '1.25rem', 
                    color: 'rgba(255,255,255,0.85)', 
                    lineHeight: 1.7,
                    textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                }}>
                    {movie.overview.length > 250 ? movie.overview.substring(0, 250) + "..." : movie.overview}
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Link to={movie.media_type === 'tv' ? `/seriesdetails/${btoa(movie.id.toString())}` : `/moviedetails/${btoa(movie.id.toString())}`}>
                        <Button variant="contained" size="large" sx={{ 
                            backgroundColor: 'var(--neon-cyan)', color: '#000', fontWeight: 800, 
                            borderRadius: '30px', px: 5, py: 1.8, fontSize: '1.1rem',
                            boxShadow: '0 0 20px var(--neon-cyan-faded), 0 10px 30px rgba(0,0,0,0.5)',
                            transition: '0.4s',
                            '&:hover': { backgroundColor: '#fff', boxShadow: '0 0 40px var(--neon-cyan), 0 10px 40px rgba(0,0,0,0.8)', transform: 'translateY(-3px)' }
                        }} startIcon={<PlayArrowIcon fontSize="large" />}>
                            Hemen İncele
                        </Button>
                    </Link>
                    <Button variant="outlined" size="large" sx={{ 
                        color: '#fff', fontWeight: 700, px: 5, py: 1.8, fontSize: '1.1rem', borderRadius: '30px',
                        borderColor: 'var(--glass-border)', backgroundColor: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)', transition: '0.3s',
                        '&:hover': { backgroundColor: 'var(--neon-magenta-faded)', borderColor: 'var(--neon-magenta)', color: '#fff', transform: 'translateY(-3px)', boxShadow: '0 0 30px var(--neon-magenta-faded)' }
                    }} startIcon={<InfoOutlinedIcon fontSize="large" />}>
                        Daha Fazla Bilgi
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Hero;
