import { Box, Skeleton, Typography, Button, Menu, MenuItem, Avatar, IconButton, Tooltip } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { teal } from '@mui/material/colors';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const Detailed = (props) => {
    const movieId = props.movieId;
    const type = props.type || "movie";
    const API_IMAGE = "https://image.tmdb.org/t/p/original/";
    const API_POSTER = "https://image.tmdb.org/t/p/w500/";

    const [movie, setMovie] = useState({});
    const [genres, setGenres] = useState([]);
    const [cast, setCast] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useContext(AuthContext);
    const [lists, setLists] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [listError, setListError] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (user) {
            api.post('/lists/init')
                .then(() => api.get('/lists'))
                .then(res => setLists(res.data))
                .catch(err => {
                    console.log(err);
                    setListError(err.response ? err.response.status + " " + err.response.data : err.message);
                });
        }
    }, [user]);

    const systemFavList = lists.find(l => l.type === 'system_favorites');
    const isFavorite = systemFavList?.contentItems.some(item => item.movieId === movieId.toString());

    const toggleFavorite = async () => {
        if (!systemFavList) return;
        try {
            if (isFavorite) {
                await api.delete(`/lists/${systemFavList._id}/remove/${movieId}`);
                setLists(lists.map(list => list._id === systemFavList._id ? { ...list, contentItems: list.contentItems.filter(i => i.movieId !== movieId.toString()) } : list));
            } else {
                const newItem = { movieId: movieId.toString(), posterPath: movie.poster_path, title: movie.title || movie.name, mediaType: type };
                await api.post(`/lists/${systemFavList._id}/add`, newItem);
                setLists(lists.map(list => list._id === systemFavList._id ? { ...list, contentItems: [...list.contentItems, newItem] } : list));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddClick = (event) => setAnchorEl(event.currentTarget);
    const handleAddClose = () => setAnchorEl(null);

    const handleAddToList = async (listId) => {
        handleAddClose();

        const targetList = lists.find(l => l._id === listId);
        if (targetList && targetList.contentItems.some(i => i.movieId === movieId.toString())) {
            showToast(`Bu içerik zaten "${targetList.title}" listesinde mevcut!`, 'warning');
            return;
        }

        try {
            await api.post(`/lists/${listId}/add`, { movieId: movieId.toString(), posterPath: movie.poster_path, title: movie.title || movie.name, mediaType: type });
            showToast(`İçerik başarıyla "${targetList ? targetList.title : 'seçilen'}" listesine eklendi!`, 'success');
            // Optimistically update the list state to reflect the addition immediately
            setLists(lists.map(list => list._id === listId ? { ...list, contentItems: [...list.contentItems, { movieId: movieId.toString(), mediaType: type }] } : list));
        } catch (err) {
            console.error(err);
            showToast('Listeye eklerken bir hata oluştu.', 'error');
        }
    };

    useEffect(() => {
        const fetchMovieData = async () => {
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

                // Eğer filmin orijinal dili Türkçe değilse ve eldeki başlık orijinal başlıkla aynıysa (yani çevrilmemişse),
                // İngilizce de farklıysa İngilizce ismi kullan. 
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
                setGenres(data.genres);

                const castRes = await axios.get(`https://api.themoviedb.org/3/${type}/${movieId}/credits?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR`);
                setCast(castRes.data.cast.slice(0, 15));

                const videoRes = await axios.get(`https://api.themoviedb.org/3/${type}/${movieId}/videos?api_key=835d874e72bfa8309fafe5737461451b&language=en-US`);
                setVideos(videoRes.data.results.filter(v => v.type === "Trailer" || v.type === "Teaser"));
            } catch (e) {
                console.log(e);
            } finally { setLoading(false); }
        };
        fetchMovieData();
    }, [movieId, type]);

    if (loading) return <Skeleton animation="wave" width={'100%'} height={'100vh'} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />;

    return (
        <Box sx={{
            width: '100%', minHeight: '100vh', position: 'relative',
            display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 10, pt: { xs: 15, md: 20 },
        }}>
            {/* Massive Background Image with Dark Fade */}
            <Box sx={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -2,
                backgroundImage: `url(${API_IMAGE + movie.backdrop_path})`,
                backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(5px) brightness(0.4)',
                '&::after': { content: '""', position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-dark), transparent)' }
            }} />

            <Box className="glass-panel animate-entrance" sx={{ width: '95%', maxWidth: '1400px', p: { xs: 3, md: 6 }, borderRadius: '30px' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>

                    {/* LEFT COLUMN: NEON POSTER */}
                    <Box sx={{ width: { xs: '100%', md: '30%' }, flexShrink: 0 }}>
                        <Box sx={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', boxShadow: '0 0 30px rgba(0,255,255,0.1)' }}>
                            <Box component="img" src={API_POSTER + movie.poster_path} sx={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }} />

                            {/* Vote Widget Overlay */}
                            <Box sx={{ position: 'absolute', top: 20, right: 20, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', p: 1.5, borderRadius: '16px', border: '1px solid var(--neon-cyan)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 0 15px var(--neon-cyan-faded)' }}>
                                <Typography sx={{ color: 'var(--neon-cyan)', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>{movie.vote_average ? movie.vote_average.toFixed(1) : '-'}</Typography>
                                <Typography sx={{ color: '#fff', fontSize: '0.7rem', mt: 0.5 }}>TMDB</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* MIDDLE COLUMN: INFO GRID */}
                    <Box sx={{ width: { xs: '100%', md: '45%' }, display: 'flex', flexDirection: 'column' }}>

                        {/* Saved Lists Indicator */}
                        {lists.filter(l => l.type !== 'system_favorites' && l.contentItems.some(i => i.movieId === movieId.toString())).length > 0 && (
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                {lists.filter(l => l.type !== 'system_favorites' && l.contentItems.some(i => i.movieId === movieId.toString())).map(list => (
                                    <Tooltip key={list._id} title="Bu film bu listede kayıtlı">
                                        <Box sx={{
                                            display: 'inline-flex', alignItems: 'center', px: 1.5, py: 0.5,
                                            borderRadius: '20px', background: 'rgba(0,255,255,0.1)', color: 'var(--neon-cyan)',
                                            border: '1px solid var(--neon-cyan)', fontSize: '0.75rem', fontWeight: 'bold',
                                            textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 0 10px rgba(0,255,255,0.2)',
                                            cursor: 'default'
                                        }}>
                                            ✓ {list.title}
                                        </Box>
                                    </Tooltip>
                                ))}
                            </Box>
                        )}

                        <Typography variant="h2" sx={{ color: '#fff', fontWeight: 900, mb: 1, textShadow: '0 0 20px rgba(0,255,255,0.4)', fontSize: { xs: '2rem', md: '3.5rem' }, lineHeight: 1.2 }}>{movie.title || movie.name}</Typography>
                        {movie.tagline && <Typography variant="subtitle1" sx={{ color: 'var(--neon-magenta)', fontStyle: 'italic', mb: 3, fontWeight: 'bold', letterSpacing: '1px' }}>{movie.tagline}</Typography>}

                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.8, mb: 4, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            {movie.overview || "Özet bilgi bulunamadı."}
                        </Typography>

                        {/* Metadata Grid */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 4 }}>
                            <Box className="glass-panel" sx={{ p: 2 }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Süre / Tür</Typography>
                                <Typography sx={{ color: 'var(--neon-cyan)', fontWeight: 'bold', fontSize: '0.95rem' }}>{movie.runtime ? `${movie.runtime} Dk` : 'Bilinmiyor'} • {type === 'tv' ? 'Dizi' : 'Film'}</Typography>
                            </Box>
                            <Box className="glass-panel" sx={{ p: 2 }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Çıkış Yılı</Typography>
                                <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>{movie.release_date?.split('-')[0]}</Typography>
                            </Box>
                            <Box className="glass-panel" sx={{ p: 2 }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Menşei / Ülke</Typography>
                                <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.95rem' }}>{movie.production_countries?.length > 0 ? movie.production_countries.map(c => c.name).join(', ') : 'Bilinmiyor'}</Typography>
                            </Box>
                            <Box className="glass-panel" sx={{ p: 2, gridColumn: 'span 3' }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', mb: 1 }}>Kategoriler</Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {genres?.map(g => (
                                        <Link to={type === 'tv' ? `/series?genre=${g.id}` : `/movies?genre=${g.id}`} key={g.id} style={{ textDecoration: 'none' }}>
                                            <span style={{ border: '1px solid var(--neon-cyan)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', color: '#fff', background: 'rgba(0,255,255,0.1)', cursor: 'pointer', transition: '0.3s', display: 'inline-block' }}
                                                onMouseOver={(e) => { e.currentTarget.style.background = 'var(--neon-cyan)'; e.currentTarget.style.color = '#000'; e.currentTarget.style.boxShadow = '0 0 10px var(--neon-cyan)'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,255,255,0.1)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = 'none'; }}
                                            >
                                                {g.name}
                                            </span>
                                        </Link>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* RIGHT COLUMN: ACTIONS & CAST */}
                    <Box sx={{ width: { xs: '100%', md: '25%' }, display: 'flex', flexDirection: 'column', gap: 3 }}>

                        {videos.length > 0 ? (
                            <Button variant="contained" href={`https://www.youtube.com/watch?v=${videos[0].key}`} target="_blank"
                                sx={{
                                    backgroundColor: 'var(--neon-magenta)', color: '#fff', py: 2, borderRadius: '16px',
                                    fontWeight: 800, letterSpacing: '1px', transition: 'all 0.3s',
                                    boxShadow: '0 0 20px var(--neon-magenta-faded)',
                                    '&:hover': { backgroundColor: '#fff', color: 'var(--neon-magenta)', boxShadow: '0 0 35px var(--neon-magenta)' }
                                }}>
                                ▶ Fragman İzle
                            </Button>
                        ) : (
                            <Button disabled sx={{ py: 2, borderRadius: '16px', background: 'var(--glass-bg)', color: 'gray !important' }}>Fragman Yok</Button>
                        )}

                        {user ? (
                            <Box className="glass-panel" sx={{ p: 3, textAlign: 'center' }}>
                                <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>Aksiyon Merkezİ</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                                    <Button fullWidth variant="contained" sx={{
                                        backgroundColor: 'var(--neon-cyan)', color: '#000', py: 1.5, borderRadius: '12px', fontWeight: 800,
                                        boxShadow: '0 0 15px var(--neon-cyan-faded)', '&:hover': { backgroundColor: '#fff' }
                                    }} startIcon={<PlaylistAddIcon />} onClick={handleAddClick}>
                                        {listError ? 'HATA: ' + listError.substring(0, 10) : (lists.length > 0 ? 'Listeye Ekle' : 'Yükleniyor...')}
                                    </Button>
                                    <Tooltip title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}>
                                        <IconButton onClick={toggleFavorite} sx={{
                                            bgcolor: 'rgba(255,255,255,0.05)', color: isFavorite ? 'var(--neon-magenta)' : '#fff',
                                            border: '1px solid', borderColor: isFavorite ? 'var(--neon-magenta)' : 'transparent',
                                            borderRadius: '12px', px: 2, transition: '0.3s',
                                            '&:hover': { bgcolor: 'rgba(255, 0, 255, 0.1)', borderColor: 'var(--neon-magenta)', boxShadow: '0 0 15px var(--neon-magenta-faded)' }
                                        }}>
                                            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleAddClose} PaperProps={{ sx: { bgcolor: 'rgba(10, 20, 45, 0.95)', border: '1px solid var(--glass-border)', color: '#fff' } }}>
                                    {lists.filter(l => l.type !== 'system_favorites').map(list => <MenuItem key={list._id} onClick={() => handleAddToList(list._id)} sx={{ '&:hover': { bgcolor: 'rgba(0, 255, 255, 0.1)', color: 'var(--neon-cyan)' } }}>{list.title}</MenuItem>)}
                                </Menu>
                            </Box>
                        ) : (
                            <Box className="glass-panel" sx={{ p: 3, textAlign: 'center' }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Listeye eklemek için giriş yapmalısınız.</Typography>
                            </Box>
                        )}

                        {/* Cast Preview Widget */}
                        {cast.length > 0 && (
                            <Box className="glass-panel" sx={{ p: 3, overflow: 'visible' }}>
                                <Typography sx={{ color: 'var(--neon-cyan)', fontWeight: 'bold', mb: 2, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Öne Çıkan Kadro</Typography>
                                <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', overflowY: 'visible', pb: 1, pl: 1, pr: 1, '&::-webkit-scrollbar': { height: '4px' } }}>
                                    {cast.slice(0, 5).map(actor => (
                                        <Link to={`/actordetails/${btoa(actor.id.toString())}`} key={actor.id} title={actor.name} style={{ flexShrink: 0 }}>
                                            <Avatar
                                                src={actor.profile_path ? API_POSTER + actor.profile_path : ''}
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    border: '2px solid var(--neon-cyan)',
                                                    transition: 'transform 0.2s ease-out',
                                                    zIndex: 10,
                                                    '&:hover': {
                                                        transform: 'scale(1.1)',
                                                        boxShadow: '0 0 10px var(--neon-cyan)'
                                                    }
                                                }}
                                            />
                                        </Link>
                                    ))}
                                </Box>
                                <Button component={Link} to={`/actors`} fullWidth sx={{ mt: 2, color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>Tüm Kadro</Button>
                            </Box>
                        )}
                    </Box>

                </Box>
            </Box>
        </Box>
    );
}

export default Detailed;