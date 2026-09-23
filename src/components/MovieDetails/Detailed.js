import { Box, Skeleton, Typography, Button, Avatar, IconButton, Tooltip, Chip } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LanguageIcon from '@mui/icons-material/Language';
import GroupIcon from '@mui/icons-material/Group';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import AddToListDialog from './AddToListDialog';
import AllCastDialog from './AllCastDialog';
import TrailerDialog from './TrailerDialog';

const Detailed = (props) => {
    const movieId = props.movieId;
    const type = props.type || "movie";
    const API_IMAGE = "https://image.tmdb.org/t/p/original/";
    const API_POSTER = "https://image.tmdb.org/t/p/w500/";

    const [movie, setMovie] = useState({});
    const [genres, setGenres] = useState([]);
    const [cast, setCast] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [writers, setWriters] = useState([]);
    const [videos, setVideos] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openCastDialog, setOpenCastDialog] = useState(false);
    const [openTrailerDialog, setOpenTrailerDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const { user } = useContext(AuthContext);
    const [lists, setLists] = useState([]);
    const { showToast } = useToast();

    // Scroll to top when movieId or type changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [movieId, type]);

    useEffect(() => {
        if (user) {
            api.post('/lists/init')
                .then(() => api.get('/lists'))
                .then(res => setLists(res.data))
                .catch(err => {
                    console.error('Listeler yüklenirken hata:', err);
                });
        }
    }, [user]);

    const systemFavList = lists.find(l => l.type === 'system_favorites');
    const isFavorite = systemFavList?.contentItems.some(item => item.movieId === movieId.toString());

    const toggleFavorite = async () => {
        if (!user) {
            showToast('Favorilere eklemek için lütfen giriş yapın.', 'warning');
            return;
        }
        if (!systemFavList) return;
        try {
            if (isFavorite) {
                await api.delete(`/lists/${systemFavList._id}/remove/${movieId}`);
                setLists(lists.map(list => list._id === systemFavList._id ? { ...list, contentItems: list.contentItems.filter(i => i.movieId !== movieId.toString()) } : list));
                showToast('Favorilerden çıkarıldı.', 'info');
            } else {
                const newItem = { movieId: movieId.toString(), posterPath: movie.poster_path, title: movie.title || movie.name, mediaType: type };
                await api.post(`/lists/${systemFavList._id}/add`, newItem);
                setLists(lists.map(list => list._id === systemFavList._id ? { ...list, contentItems: [...list.contentItems, newItem] } : list));
                showToast('Favorilere eklendi!', 'success');
            }
        } catch (e) {
            console.error(e);
            showToast('Favori işlemi sırasında bir hata oluştu.', 'error');
        }
    };

    const handleAddClick = () => {
        if (!user) {
            showToast('Listelere eklemek için lütfen giriş yapın.', 'warning');
            return;
        }
        setOpenAddDialog(true);
    };

    useEffect(() => {
        const fetchMovieData = async () => {
            setLoading(true);
            try {
                const [resTr, resEn] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR`),
                    axios.get(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=835d874e72bfa8309fafe5737461451b&language=en-US`)
                ]);

                const dataTr = resTr.data;
                const dataEn = resEn.data;

                let finalTitle = type === "tv" ? dataTr.name : dataTr.title;
                const originalTitle = type === "tv" ? dataTr.original_name : dataTr.original_title;
                const englishTitle = type === "tv" ? dataEn.name : dataEn.title;

                let finalPoster = dataTr.poster_path;
                let finalBackdrop = dataTr.backdrop_path;

                if (dataTr.original_language !== 'tr' && finalTitle === originalTitle && englishTitle !== originalTitle) {
                    finalTitle = englishTitle;
                    finalPoster = dataEn.poster_path || finalPoster;
                    finalBackdrop = dataEn.backdrop_path || finalBackdrop;
                }

                const finalOverview = dataTr.overview || dataEn.overview;

                const data = {
                    ...dataTr,
                    title: finalTitle,
                    name: finalTitle,
                    overview: finalOverview,
                    poster_path: finalPoster,
                    backdrop_path: finalBackdrop
                };

                if (type === "tv") {
                    data.release_date = dataTr.first_air_date;
                    data.runtime = dataTr.episode_run_time ? dataTr.episode_run_time[0] : null;
                }

                setMovie(data);
                setGenres(data.genres || []);

                // Credits: Cast & Crew
                const creditsRes = await axios.get(`https://api.themoviedb.org/3/${type}/${movieId}/credits?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR`);
                const castList = creditsRes.data.cast || [];
                const crewList = creditsRes.data.crew || [];
                setCast(castList);

                // Extract Directors & Writers
                const dirList = crewList.filter(c => c.job === 'Director' || c.department === 'Directing');
                setDirectors(dirList);

                const writerList = crewList.filter(c => ['Screenplay', 'Writer', 'Author', 'Novel', 'Story', 'Characters'].includes(c.job) || c.department === 'Writing');
                // Unique writers by id
                const uniqueWriters = Array.from(new Map(writerList.map(w => [w.id, w])).values());
                setWriters(uniqueWriters);

                // Videos: Trailers & Teasers
                const videoRes = await axios.get(`https://api.themoviedb.org/3/${type}/${movieId}/videos?api_key=835d874e72bfa8309fafe5737461451b&language=en-US`);
                const filteredVideos = (videoRes.data.results || []).filter(v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
                setVideos(filteredVideos);

                // Recommendations / Similar
                try {
                    let recRes = await axios.get(`https://api.themoviedb.org/3/${type}/${movieId}/recommendations?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR`);
                    if (!recRes.data.results || recRes.data.results.length === 0) {
                        recRes = await axios.get(`https://api.themoviedb.org/3/${type}/${movieId}/similar?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR`);
                    }
                    setRecommendations((recRes.data.results || []).slice(0, 10));
                } catch (recErr) {
                    console.log('Öneriler yüklenemedi:', recErr);
                }

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchMovieData();
    }, [movieId, type]);

    const formatCurrency = (val) => {
        if (!val || val <= 0) return null;
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const getStatusLabel = (status) => {
        const map = {
            'Released': 'Vizyona Girdi',
            'Post Production': 'Yapım Aşamasında',
            'In Production': 'Çekim Aşamasında',
            'Planned': 'Planlanıyor',
            'Returning Series': 'Devam Ediyor',
            'Ended': 'Final Yaptı',
            'Canceled': 'İptal Edildi',
            'Pilot': 'Pilot Bölüm'
        };
        return map[status] || status;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Bilinmiyor';
        try {
            return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    if (loading) return <Skeleton animation="wave" width={'100%'} height={'100vh'} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />;

    return (
        <Box sx={{
            width: '100%', minHeight: '100vh', position: 'relative',
            display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 12, pt: { xs: 2, md: 3 },
        }}>
            {/* Massive Background Image with Dark Fade */}
            <Box sx={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -2,
                backgroundImage: `url(${API_IMAGE + movie.backdrop_path})`,
                backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(10px) brightness(0.35)',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, var(--bg-dark) 10%, rgba(6, 9, 15, 0.85) 60%, rgba(6, 9, 15, 0.95) 100%)'
                }
            }} />

            <Box className="glass-panel animate-entrance" sx={{
                width: '95%',
                maxWidth: '1440px',
                p: { xs: 2.5, sm: 4, md: 6 },
                borderRadius: '32px',
                border: '1px solid rgba(0, 255, 255, 0.2)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0, 255, 255, 0.08)'
            }}>
                {/* TOP HERO SECTION */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 6 } }}>

                    {/* LEFT COLUMN: POSTER & QUICK ACTIONS */}
                    <Box sx={{ width: { xs: '100%', md: '28%' }, flexShrink: 0 }}>
                        <Box sx={{
                            position: 'relative',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            p: 1,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--neon-cyan)',
                            boxShadow: '0 15px 45px rgba(0, 255, 255, 0.15)',
                            transition: 'transform 0.3s ease',
                            '&:hover': { transform: 'translateY(-4px)' }
                        }}>
                            <Box
                                component="img"
                                src={movie.poster_path ? API_POSTER + movie.poster_path : 'https://placehold.co/400x600/101826/ffffff?text=Afiş+Yok'}
                                alt={movie.title || movie.name}
                                sx={{ width: '100%', borderRadius: '18px', display: 'block', boxShadow: '0 10px 30px rgba(0,0,0,0.9)' }}
                            />

                            {/* Vote Widget Overlay */}
                            <Box sx={{
                                position: 'absolute', top: 20, right: 20,
                                background: 'rgba(10, 15, 25, 0.9)', backdropFilter: 'blur(12px)',
                                px: 2, py: 1.2, borderRadius: '18px',
                                border: '1px solid var(--neon-cyan)',
                                display: 'flex', alignItems: 'center', gap: 1,
                                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
                            }}>
                                <StarIcon sx={{ color: '#FFD700', fontSize: '1.4rem' }} />
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.3 }}>
                                        <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', lineHeight: 1 }}>
                                            {movie.vote_average ? movie.vote_average.toFixed(1) : '-'}
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>/10</Typography>
                                    </Box>
                                    <Typography sx={{ color: 'var(--neon-cyan)', fontSize: '0.65rem', fontWeight: 700 }}>
                                        {movie.vote_count ? `${movie.vote_count.toLocaleString('tr-TR')} oy` : 'TMDB'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Quick Trailer Button Under Poster */}
                        {videos.length > 0 ? (
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<PlayArrowIcon />}
                                onClick={() => setOpenTrailerDialog(true)}
                                sx={{
                                    mt: 2.5,
                                    py: 1.8,
                                    borderRadius: '16px',
                                    fontWeight: 800,
                                    fontSize: '0.95rem',
                                    letterSpacing: '0.5px',
                                    backgroundColor: 'var(--neon-magenta)',
                                    color: '#fff',
                                    boxShadow: '0 0 25px rgba(255, 0, 127, 0.4)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: '#fff',
                                        color: 'var(--neon-magenta)',
                                        boxShadow: '0 0 35px var(--neon-magenta)'
                                    }
                                }}
                            >
                                Fragman İzle ({videos.length})
                            </Button>
                        ) : (
                            <Button
                                fullWidth
                                disabled
                                sx={{
                                    mt: 2.5,
                                    py: 1.8,
                                    borderRadius: '16px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'rgba(255, 255, 255, 0.4) !important',
                                    border: '1px solid rgba(255, 255, 255, 0.08)'
                                }}
                            >
                                Fragman Bulunmuyor
                            </Button>
                        )}
                    </Box>

                    {/* MIDDLE COLUMN: TITLE, BADGES, OVERVIEW & DETAILS GRID */}
                    <Box sx={{ width: { xs: '100%', md: '47%' }, display: 'flex', flexDirection: 'column' }}>

                        {/* Top Meta Badges Bar */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
                            <Chip
                                icon={type === 'tv' ? <TvIcon sx={{ fontSize: '0.9rem !important', color: 'inherit' }} /> : <MovieIcon sx={{ fontSize: '0.9rem !important', color: 'inherit' }} />}
                                label={type === 'tv' ? 'Dizi' : 'Film'}
                                sx={{
                                    bgcolor: 'rgba(0, 255, 255, 0.12)',
                                    color: 'var(--neon-cyan)',
                                    border: '1px solid var(--neon-cyan)',
                                    fontWeight: 800,
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase'
                                }}
                            />

                            {movie.release_date && (
                                <Chip
                                    icon={<CalendarMonthIcon sx={{ fontSize: '0.9rem !important', color: 'inherit' }} />}
                                    label={movie.release_date.split('-')[0]}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.06)',
                                        color: '#fff',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        fontWeight: 700,
                                        fontSize: '0.75rem'
                                    }}
                                />
                            )}

                            {type === 'movie' && movie.runtime ? (
                                <Chip
                                    icon={<AccessTimeIcon sx={{ fontSize: '0.9rem !important', color: 'inherit' }} />}
                                    label={`${movie.runtime} Dk`}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.06)',
                                        color: '#fff',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        fontWeight: 700,
                                        fontSize: '0.75rem'
                                    }}
                                />
                            ) : null}

                            {type === 'tv' && movie.number_of_seasons ? (
                                <Chip
                                    label={`${movie.number_of_seasons} Sezon • ${movie.number_of_episodes || '?'} Bölüm`}
                                    sx={{
                                        bgcolor: 'rgba(255, 0, 127, 0.12)',
                                        color: 'var(--neon-magenta)',
                                        border: '1px solid var(--neon-magenta)',
                                        fontWeight: 800,
                                        fontSize: '0.75rem'
                                    }}
                                />
                            ) : null}

                            {movie.status && (
                                <Chip
                                    label={getStatusLabel(movie.status)}
                                    sx={{
                                        bgcolor: 'rgba(0, 255, 128, 0.1)',
                                        color: '#00ff80',
                                        border: '1px solid rgba(0, 255, 128, 0.4)',
                                        fontWeight: 700,
                                        fontSize: '0.75rem'
                                    }}
                                />
                            )}

                            {movie.original_language && (
                                <Chip
                                    icon={<LanguageIcon sx={{ fontSize: '0.9rem !important', color: 'inherit' }} />}
                                    label={movie.original_language.toUpperCase()}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.06)',
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        fontWeight: 700,
                                        fontSize: '0.75rem'
                                    }}
                                />
                            )}
                        </Box>

                        {/* Title and Tagline */}
                        <Typography variant="h2" sx={{
                            color: '#fff',
                            fontWeight: 900,
                            mb: 1,
                            textShadow: '0 0 25px rgba(0,255,255,0.4)',
                            fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.4rem' },
                            lineHeight: 1.15
                        }}>
                            {movie.title || movie.name}
                        </Typography>

                        {movie.tagline && (
                            <Typography variant="subtitle1" sx={{
                                color: 'var(--neon-magenta)',
                                fontStyle: 'italic',
                                mb: 2.5,
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                                fontSize: '1.05rem'
                            }}>
                                “{movie.tagline}”
                            </Typography>
                        )}

                        {/* Interactive Genre Badges */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                            {genres?.map(g => (
                                <Link
                                    to={type === 'tv' ? `/series?genre=${g.id}` : `/movies?genre=${g.id}`}
                                    key={g.id}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Box sx={{
                                        px: 1.8,
                                        py: 0.6,
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        color: '#fff',
                                        background: 'rgba(0, 255, 255, 0.08)',
                                        border: '1px solid rgba(0, 255, 255, 0.35)',
                                        transition: 'all 0.25s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            background: 'var(--neon-cyan)',
                                            color: '#000',
                                            boxShadow: '0 0 15px var(--neon-cyan)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}>
                                        {g.name}
                                    </Box>
                                </Link>
                            ))}
                        </Box>

                        {/* Overview / Konu */}
                        <Box sx={{ mb: 4 }}>
                            <Typography sx={{
                                color: 'var(--neon-cyan)',
                                fontSize: '0.85rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                mb: 1
                            }}>
                                Konu
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: 'rgba(255,255,255,0.85)',
                                fontSize: '1.05rem',
                                lineHeight: 1.75,
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                            }}>
                                {movie.overview || "Bu yapım için henüz Türkçe özet bilgi eklenmemiştir."}
                            </Typography>
                        </Box>

                        {/* Rich Metadata Info Grid */}
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                            gap: 2,
                            p: 2.5,
                            borderRadius: '20px',
                            background: 'rgba(0, 0, 0, 0.35)',
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                            {/* Director or Creator */}
                            <Box>
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, mb: 0.5 }}>
                                    {type === 'tv' && movie.created_by?.length > 0 ? 'Yaratıcı' : 'Yönetmen'}
                                </Typography>
                                <Typography sx={{ color: 'var(--neon-cyan)', fontWeight: 700, fontSize: '0.95rem' }}>
                                    {type === 'tv' && movie.created_by?.length > 0
                                        ? movie.created_by.map(c => c.name).join(', ')
                                        : directors.length > 0 ? directors.slice(0, 2).map(d => d.name).join(', ') : 'Bilinmiyor'}
                                </Typography>
                            </Box>

                            {/* Writers */}
                            <Box>
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, mb: 0.5 }}>
                                    Senaryo / Yazar
                                </Typography>
                                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
                                    {writers.length > 0 ? writers.slice(0, 3).map(w => w.name).join(', ') : 'Bilinmiyor'}
                                </Typography>
                            </Box>

                            {/* Release Date */}
                            <Box>
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, mb: 0.5 }}>
                                    Çıkış Tarihi
                                </Typography>
                                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                                    {formatDate(movie.release_date)}
                                </Typography>
                            </Box>

                            {/* Country / Origin */}
                            <Box>
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, mb: 0.5 }}>
                                    Ülke & Orijinal Dil
                                </Typography>
                                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                                    {movie.production_countries?.length > 0 ? movie.production_countries.map(c => c.name).join(', ') : (movie.origin_country?.join(', ') || 'Bilinmiyor')}
                                    {movie.original_language ? ` (${movie.original_language.toUpperCase()})` : ''}
                                </Typography>
                            </Box>

                            {/* Movie Financials: Budget & Revenue */}
                            {type === 'movie' && (formatCurrency(movie.budget) || formatCurrency(movie.revenue)) && (
                                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' }, display: 'flex', gap: 3, pt: 1, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    {formatCurrency(movie.budget) && (
                                        <Box>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Bütçe</Typography>
                                            <Typography sx={{ color: '#00ff80', fontWeight: 700, fontSize: '0.95rem' }}>{formatCurrency(movie.budget)}</Typography>
                                        </Box>
                                    )}
                                    {formatCurrency(movie.revenue) && (
                                        <Box>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Hasılat</Typography>
                                            <Typography sx={{ color: 'var(--neon-cyan)', fontWeight: 700, fontSize: '0.95rem' }}>{formatCurrency(movie.revenue)}</Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* TV Networks & Platform */}
                            {type === 'tv' && movie.networks?.length > 0 && (
                                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' }, pt: 1, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, mb: 0.5 }}>
                                        Yayıncı / Platform
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                        {movie.networks.map(n => (
                                            <Chip
                                                key={n.id}
                                                icon={<LiveTvIcon sx={{ fontSize: '0.9rem !important', color: 'inherit' }} />}
                                                label={n.name}
                                                sx={{
                                                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Production Companies */}
                            {movie.production_companies?.length > 0 && (
                                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' }, pt: 1, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, mb: 0.5 }}>
                                        Yapım Şirketleri
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                                        {movie.production_companies.slice(0, 4).map(c => c.name).join(' • ')}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {/* RIGHT COLUMN: ACTION CENTER & CAST PREVIEW */}
                    <Box sx={{ width: { xs: '100%', md: '25%' }, display: 'flex', flexDirection: 'column', gap: 3 }}>

                        {/* Action Center */}
                        {user ? (
                            <Box className="glass-panel" sx={{
                                p: 3,
                                textAlign: 'center',
                                borderRadius: '24px',
                                border: '1px solid rgba(0, 255, 255, 0.25)',
                                background: 'rgba(10, 16, 26, 0.75)'
                            }}>
                                <Typography sx={{
                                    color: '#fff',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    mb: 2.5
                                }}>
                                    Aksiyon Merkezi
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<PlaylistAddIcon />}
                                        onClick={handleAddClick}
                                        sx={{
                                            backgroundColor: 'var(--neon-cyan)',
                                            color: '#000',
                                            py: 1.5,
                                            borderRadius: '14px',
                                            fontWeight: 800,
                                            fontSize: '0.9rem',
                                            boxShadow: '0 0 20px var(--neon-cyan-faded)',
                                            transition: 'all 0.25s ease',
                                            '&:hover': {
                                                backgroundColor: '#fff',
                                                boxShadow: '0 0 30px var(--neon-cyan)'
                                            }
                                        }}
                                    >
                                        Listelere Ekle
                                    </Button>

                                    <Tooltip title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}>
                                        <IconButton
                                            onClick={toggleFavorite}
                                            sx={{
                                                bgcolor: isFavorite ? 'rgba(255, 0, 127, 0.2)' : 'rgba(255,255,255,0.06)',
                                                color: isFavorite ? 'var(--neon-magenta)' : '#fff',
                                                border: '1px solid',
                                                borderColor: isFavorite ? 'var(--neon-magenta)' : 'rgba(255,255,255,0.15)',
                                                borderRadius: '14px',
                                                px: 2,
                                                transition: 'all 0.25s ease',
                                                boxShadow: isFavorite ? '0 0 20px rgba(255, 0, 127, 0.4)' : 'none',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 0, 127, 0.25)',
                                                    borderColor: 'var(--neon-magenta)',
                                                    boxShadow: '0 0 25px var(--neon-magenta)'
                                                }
                                            }}
                                        >
                                            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                {/* Active Lists Badges */}
                                {lists.filter(l => l.type !== 'system_favorites' && l.contentItems.some(i => i.movieId === movieId.toString())).length > 0 && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'left' }}>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', fontWeight: 700, mb: 1 }}>
                                            Kayıtlı Listeleriniz:
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                                            {lists.filter(l => l.type !== 'system_favorites' && l.contentItems.some(i => i.movieId === movieId.toString())).map(list => (
                                                <Chip
                                                    key={list._id}
                                                    label={`✓ ${list.title}`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(0, 255, 255, 0.1)',
                                                        color: 'var(--neon-cyan)',
                                                        border: '1px solid var(--neon-cyan)',
                                                        fontWeight: 700,
                                                        fontSize: '0.7rem'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                <AddToListDialog
                                    open={openAddDialog}
                                    onClose={() => setOpenAddDialog(false)}
                                    lists={lists}
                                    movieId={movieId}
                                    movieTitle={movie.title || movie.name}
                                    posterPath={movie.poster_path}
                                    mediaType={type}
                                    onListsUpdated={(updated) => setLists(updated)}
                                />
                            </Box>
                        ) : (
                            <Box className="glass-panel" sx={{
                                p: 3,
                                textAlign: 'center',
                                borderRadius: '24px',
                                border: '1px solid rgba(0, 255, 255, 0.2)',
                                background: 'rgba(10, 16, 26, 0.75)'
                            }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', mb: 2 }}>
                                    Listelerinize veya favorilerinize eklemek için giriş yapın.
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        borderColor: 'var(--neon-cyan)',
                                        color: 'var(--neon-cyan)',
                                        borderRadius: '14px',
                                        py: 1.2,
                                        fontWeight: 800,
                                        textTransform: 'none',
                                        '&:hover': { borderColor: '#fff', color: '#fff', bgcolor: 'rgba(0, 255, 255, 0.1)' }
                                    }}
                                >
                                    Giriş Yap
                                </Button>
                            </Box>
                        )}

                        {/* Featured Cast Preview */}
                        {cast.length > 0 && (
                            <Box className="glass-panel" sx={{
                                p: 3,
                                borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                background: 'rgba(10, 16, 26, 0.75)'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography sx={{
                                        color: 'var(--neon-cyan)',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        fontSize: '0.8rem',
                                        letterSpacing: '1px'
                                    }}>
                                        Öne Çıkan Kadro
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', fontWeight: 700 }}>
                                        {cast.length} Kişi
                                    </Typography>
                                </Box>

                                {/* Mini list of top 4 cast members */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {cast.slice(0, 4).map(actor => (
                                        <Box
                                            component={Link}
                                            to={`/actordetails/${btoa(actor.id.toString())}`}
                                            key={actor.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                textDecoration: 'none',
                                                p: 1,
                                                borderRadius: '14px',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    background: 'rgba(0, 255, 255, 0.08)',
                                                    borderColor: 'var(--neon-cyan)',
                                                    transform: 'translateX(4px)'
                                                }
                                            }}
                                        >
                                            <Avatar
                                                src={actor.profile_path ? API_POSTER + actor.profile_path : ''}
                                                alt={actor.name}
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    border: '1.5px solid var(--neon-cyan)'
                                                }}
                                            />
                                            <Box sx={{ overflow: 'hidden' }}>
                                                <Typography sx={{
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    fontSize: '0.85rem',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {actor.name}
                                                </Typography>
                                                <Typography sx={{
                                                    color: 'rgba(255, 255, 255, 0.5)',
                                                    fontSize: '0.75rem',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {actor.character || 'Oyuncu'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

                                <Button
                                    onClick={() => setOpenCastDialog(true)}
                                    fullWidth
                                    startIcon={<GroupIcon />}
                                    sx={{
                                        mt: 2.5,
                                        py: 1.2,
                                        color: 'var(--neon-cyan)',
                                        borderRadius: '14px',
                                        textTransform: 'none',
                                        fontWeight: 800,
                                        fontSize: '0.85rem',
                                        border: '1px solid rgba(0, 255, 255, 0.3)',
                                        background: 'rgba(0, 255, 255, 0.05)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            color: '#fff',
                                            borderColor: 'var(--neon-cyan)',
                                            background: 'rgba(0, 255, 255, 0.15)',
                                            boxShadow: '0 0 20px rgba(0, 255, 255, 0.25)'
                                        }
                                    }}
                                >
                                    Tüm Kadroyu Gör ({cast.length})
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* BOTTOM SECTION: RECOMMENDATIONS / SIMILAR */}
                {recommendations.length > 0 && (
                    <Box sx={{ mt: 8, pt: 6, borderTop: '1px solid rgba(0, 255, 255, 0.15)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{
                                    width: 4,
                                    height: 28,
                                    background: 'var(--neon-cyan)',
                                    borderRadius: '2px',
                                    boxShadow: '0 0 10px var(--neon-cyan)'
                                }} />
                                <Typography variant="h5" sx={{
                                    color: '#fff',
                                    fontWeight: 900,
                                    letterSpacing: '0.5px',
                                    fontSize: { xs: '1.2rem', md: '1.5rem' }
                                }}>
                                    Benzer ve Önerilen Yapımlar
                                </Typography>
                            </Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                                {recommendations.length} Öneri
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'repeat(2, 1fr)',
                                sm: 'repeat(3, 1fr)',
                                md: 'repeat(4, 1fr)',
                                lg: 'repeat(5, 1fr)'
                            },
                            gap: 2.5
                        }}>
                            {recommendations.map(item => {
                                const itemTitle = item.title || item.name;
                                const itemYear = (item.release_date || item.first_air_date)?.split('-')[0];
                                const targetUrl = type === 'tv'
                                    ? `/seriesdetails/${btoa(item.id.toString())}`
                                    : `/moviedetails/${btoa(item.id.toString())}`;

                                return (
                                    <Box
                                        component={Link}
                                        to={targetUrl}
                                        key={item.id}
                                        sx={{
                                            textDecoration: 'none',
                                            borderRadius: '18px',
                                            overflow: 'hidden',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            p: 1.2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                transform: 'translateY(-6px)',
                                                borderColor: 'var(--neon-cyan)',
                                                background: 'rgba(0, 255, 255, 0.04)',
                                                boxShadow: '0 12px 30px rgba(0, 255, 255, 0.2)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', width: '100%', pt: '145%', borderRadius: '14px', overflow: 'hidden', mb: 1.5 }}>
                                            <Box
                                                component="img"
                                                src={item.poster_path ? API_POSTER + item.poster_path : 'https://placehold.co/300x450/101826/ffffff?text=Afiş+Yok'}
                                                alt={itemTitle}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            {item.vote_average > 0 && (
                                                <Box sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    background: 'rgba(0, 0, 0, 0.8)',
                                                    backdropFilter: 'blur(8px)',
                                                    px: 1,
                                                    py: 0.3,
                                                    borderRadius: '10px',
                                                    border: '1px solid var(--neon-cyan)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.4
                                                }}>
                                                    <StarIcon sx={{ color: '#FFD700', fontSize: '0.85rem' }} />
                                                    <Typography sx={{ color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>
                                                        {item.vote_average.toFixed(1)}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        <Typography sx={{
                                            color: '#fff',
                                            fontWeight: 800,
                                            fontSize: '0.9rem',
                                            lineHeight: 1.3,
                                            mb: 0.5,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {itemTitle}
                                        </Typography>

                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', fontWeight: 600 }}>
                                            {itemYear || 'Bilinmiyor'} • {type === 'tv' ? 'Dizi' : 'Film'}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Dialogs */}
            <AllCastDialog
                open={openCastDialog}
                onClose={() => setOpenCastDialog(false)}
                cast={cast}
                mediaTitle={movie.title || movie.name}
            />

            <TrailerDialog
                open={openTrailerDialog}
                onClose={() => setOpenTrailerDialog(false)}
                videos={videos}
                mediaTitle={movie.title || movie.name}
            />
        </Box>
    );
};

export default Detailed;