import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Skeleton, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarIcon from '@mui/icons-material/Star';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Hero = () => {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                // Fetch trending movies and TV series
                const res = await axios.get(
                    `https://api.themoviedb.org/3/trending/all/week?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR`
                );
                const results = res.data.results || [];
                // Only select items that have both a backdrop and a poster
                const validItems = results.filter(item => item.backdrop_path && item.poster_path);
                const pool = validItems.length > 0 ? validItems : results;

                if (pool.length > 0) {
                    const selected = pool[Math.floor(Math.random() * Math.min(8, pool.length))];

                    // If overview is empty in Turkish, fetch English overview
                    if (!selected.overview) {
                        try {
                            const isTv = selected.media_type === 'tv' || Boolean(selected.first_air_date);
                            const mediaType = isTv ? 'tv' : 'movie';
                            const enRes = await axios.get(
                                `https://api.themoviedb.org/3/${mediaType}/${selected.id}?api_key=835d874e72bfa8309fafe5737461451b&language=en-US`
                            );
                            if (enRes.data?.overview) {
                                selected.overview = enRes.data.overview;
                            }
                        } catch (e) {
                            // ignore fallback error
                        }
                    }
                    setMovie(selected);
                }
            } catch (e) {
                console.error('Hero yüklenirken hata:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    if (loading || !movie) {
        return (
            <Skeleton
                variant="rectangular"
                width="100%"
                height="80vh"
                sx={{ bgcolor: 'rgba(255,255,255,0.02)', mb: 4 }}
            />
        );
    }

    const isTv = movie.media_type === 'tv' || Boolean(movie.first_air_date) || Boolean(movie.name && !movie.title);
    const movieTitle = movie.title || movie.name || 'Öne Çıkan Yapım';
    const releaseYear = (movie.release_date || movie.first_air_date)?.split('-')[0] || '';
    const targetLink = isTv
        ? `/seriesdetails/${btoa(movie.id.toString())}`
        : `/moviedetails/${btoa(movie.id.toString())}`;

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : (movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : '');

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '';

    const overviewText = movie.overview && movie.overview.trim().length > 0
        ? (movie.overview.length > 220 ? movie.overview.substring(0, 220) + "..." : movie.overview)
        : "Bu popüler yapım için Türkçe özet henüz eklenmemiştir. Detayları keşfetmek için inceleyin.";

    return (
        <Box sx={{
            width: '100%',
            minHeight: { xs: '80vh', md: '88vh' },
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            px: { xs: 2.5, sm: 5, md: 8 },
            pb: { xs: 6, md: 8 },
            mb: 4,
            marginTop: '-80px',
            pt: { xs: '100px', md: '120px' },
            overflow: 'hidden',
            isolation: 'isolate'
        }}>
            {/* Cinematic Backdrop Image Layer */}
            {backdropUrl && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    backgroundImage: `url(${backdropUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    filter: 'brightness(0.7)',
                    transform: 'scale(1.02)',
                    transition: 'transform 8s ease-out',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, var(--bg-dark) 8%, rgba(0, 2, 10, 0.75) 45%, rgba(0,0,0,0.3) 100%), linear-gradient(to right, var(--bg-dark) 15%, rgba(0, 2, 10, 0.8) 55%, rgba(0,0,0,0.2) 100%)'
                    }
                }} />
            )}

            {/* Foreground Content */}
            <Box sx={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '1440px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                gap: { xs: 4, md: 6 }
            }} className="animate-entrance">

                {/* Left Column: Details & Buttons */}
                <Box sx={{ flex: 1, maxWidth: { md: '65%' } }}>
                    {/* Badges Bar */}
                    <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
                        <Chip
                            icon={isTv ? <TvIcon sx={{ fontSize: '0.9rem !important', color: 'inherit' }} /> : <MovieIcon sx={{ fontSize: '0.9rem !important', color: 'inherit' }} />}
                            label={isTv ? 'Dizi' : 'Film'}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(0, 255, 255, 0.15)',
                                color: 'var(--neon-cyan)',
                                border: '1px solid var(--neon-cyan)',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                textTransform: 'uppercase'
                            }}
                        />

                        {movie.vote_average > 0 && (
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                bgcolor: 'rgba(0,0,0,0.7)',
                                border: '1px solid rgba(255, 215, 0, 0.4)',
                                px: 1.2,
                                py: 0.3,
                                borderRadius: '16px'
                            }}>
                                <StarIcon sx={{ color: '#FFD700', fontSize: '1rem' }} />
                                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.8rem' }}>
                                    {movie.vote_average.toFixed(1)}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                                    TMDB
                                </Typography>
                            </Box>
                        )}

                        {releaseYear && (
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 700 }}>
                                {releaseYear}
                            </Typography>
                        )}

                        <Typography sx={{
                            color: 'var(--neon-magenta)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            letterSpacing: '1px',
                            textTransform: 'uppercase'
                        }}>
                            • Haftanın Öne Çıkanı
                        </Typography>
                    </Box>

                    {/* Big Title */}
                    <Typography variant="h1" sx={{
                        fontWeight: 900,
                        fontSize: { xs: '2.4rem', sm: '3.4rem', md: '4.4rem' },
                        lineHeight: 1.1,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: '#fff',
                        mb: 2,
                        textShadow: '0 0 25px rgba(0,255,255,0.4), 0 0 50px rgba(0,255,255,0.2)'
                    }}>
                        {movieTitle}
                    </Typography>

                    {/* Overview */}
                    <Typography variant="body1" sx={{
                        maxWidth: '720px',
                        fontSize: { xs: '1rem', md: '1.15rem' },
                        color: 'rgba(255,255,255,0.85)',
                        lineHeight: 1.7,
                        mb: 4,
                        textShadow: '0 2px 10px rgba(0,0,0,0.9)'
                    }}>
                        {overviewText}
                    </Typography>

                    {/* CTA Actions */}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            component={Link}
                            to={targetLink}
                            variant="contained"
                            size="large"
                            startIcon={<PlayArrowIcon fontSize="large" />}
                            sx={{
                                backgroundColor: 'var(--neon-cyan)',
                                color: '#000',
                                fontWeight: 800,
                                borderRadius: '30px',
                                px: { xs: 3.5, md: 4.5 },
                                py: 1.6,
                                fontSize: '1rem',
                                letterSpacing: '0.5px',
                                boxShadow: '0 0 25px var(--neon-cyan-faded), 0 10px 30px rgba(0,0,0,0.6)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: '#fff',
                                    boxShadow: '0 0 40px var(--neon-cyan), 0 10px 40px rgba(0,0,0,0.8)',
                                    transform: 'translateY(-3px)'
                                }
                            }}
                        >
                            Hemen İncele
                        </Button>

                        <Button
                            component={Link}
                            to={targetLink}
                            variant="outlined"
                            size="large"
                            startIcon={<InfoOutlinedIcon fontSize="medium" />}
                            sx={{
                                color: '#fff',
                                fontWeight: 700,
                                px: { xs: 3, md: 4 },
                                py: 1.6,
                                fontSize: '1rem',
                                borderRadius: '30px',
                                borderColor: 'rgba(255, 255, 255, 0.25)',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 0, 127, 0.15)',
                                    borderColor: 'var(--neon-magenta)',
                                    color: '#fff',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 0 25px var(--neon-magenta-faded)'
                                }
                            }}
                        >
                            Daha Fazla Bilgi
                        </Button>
                    </Box>
                </Box>

                {/* Right Column: Featured Poster Card */}
                {posterUrl && (
                    <Box sx={{
                        display: { xs: 'none', sm: 'flex' },
                        flexShrink: 0,
                        width: { sm: '210px', md: '280px', lg: '320px' }
                    }}>
                        <Link to={targetLink} style={{ textDecoration: 'none', width: '100%' }}>
                            <Box sx={{
                                position: 'relative',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                p: 1,
                                background: 'rgba(255, 255, 255, 0.04)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid var(--neon-cyan)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 35px rgba(0, 255, 255, 0.2)',
                                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                '&:hover': {
                                    transform: 'translateY(-8px) scale(1.02)',
                                    boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 50px var(--neon-cyan)'
                                }
                            }}>
                                <Box
                                    component="img"
                                    src={posterUrl}
                                    alt={movieTitle}
                                    sx={{
                                        width: '100%',
                                        display: 'block',
                                        borderRadius: '18px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                                    }}
                                />
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: 18,
                                    left: 18,
                                    right: 18,
                                    py: 1,
                                    px: 2,
                                    borderRadius: '12px',
                                    background: 'rgba(6, 12, 24, 0.85)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(0,255,255,0.4)',
                                    textAlign: 'center'
                                }}>
                                    <Typography sx={{ color: 'var(--neon-cyan)', fontWeight: 800, fontSize: '0.85rem' }}>
                                        Afişi ve Detayları Gör
                                    </Typography>
                                </Box>
                            </Box>
                        </Link>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Hero;
