import { Box, Card, CardContent, CardMedia, Skeleton, Typography, Button, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { grey, teal } from '@mui/material/colors';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const Detailed = (props) => {

    const movieId = props.movieId;
    const type = props.type || "movie";

    const API_IMAGE = "https://image.tmdb.org/t/p/w500/";

    const [movie, setMovie] = useState({});
    const [genres, setGenres] = useState([]);
    const [cast, setCast] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useContext(AuthContext);
    const [lists, setLists] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        if(user) {
            api.get('/lists').then(res => setLists(res.data)).catch(err => console.log(err));
        }
    }, [user]);

    const handleAddClick = (event) => setAnchorEl(event.currentTarget);
    const handleAddClose = () => setAnchorEl(null);

    const handleAddToList = async (listId) => {
        handleAddClose();
        try {
            await api.post(`/lists/${listId}/add`, { 
                movieId: movie.id.toString(), 
                posterPath: movie.poster_path, 
                title: movie.title 
            });
            alert('Film listeye eklendi!');
        } catch (err) {
            console.error(err);
            alert('Eklerken bir hata oluştu');
        }
    };

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const res = await axios.get(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR`);
                const data = res.data;
                if (type === "tv") {
                    data.title = data.name;
                    data.release_date = data.first_air_date;
                    data.runtime = data.episode_run_time ? data.episode_run_time[0] : null;
                }
                setMovie(data);
                setGenres(data.genres);

                const castRes = await axios.get(`https://api.themoviedb.org/3/${type}/${movieId}/credits?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR`);
                setCast(castRes.data.cast.slice(0, 15));

                const videoRes = await axios.get(`https://api.themoviedb.org/3/${type}/${movieId}/videos?api_key=835d874e72bfa8309fafe5737461451b&language=en-US`);
                setVideos(videoRes.data.results.filter(v => v.type === "Trailer" || v.type === "Teaser"));
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        fetchMovieData();
    }, [movieId, type]);

    return (
        <Box sx={{
            width: '100%',
            minHeight: '100vh',
            backgroundImage: movie.backdrop_path ? `linear-gradient(to top, #020a1f 0%, rgba(6, 25, 59, 0.7) 50%, rgba(0, 0, 0, 0.5) 100%), url(${API_IMAGE + movie.backdrop_path})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundAttachment: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 15, md: 15 },
            pb: 10,
        }}>
            {loading ? <Skeleton animation="wave" width={'80%'} height={400} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} /> : (
                <Box sx={{
                    width: '90%', maxWidth: '1400px',
                    borderRadius: '24px', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
                    backgroundColor: 'rgba(6, 25, 59, 0.4)', border: '1px solid rgba(0, 255, 255, 0.3)',
                    boxShadow: '0 0 30px rgba(0, 255, 255, 0.2), 0 0 60px rgba(255, 0, 255, 0.15), inset 0 0 20px rgba(255, 170, 0, 0.1)',
                    p: { xs: 3, md: 5 }
                }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5 }}>
                        
                        {/* SOL KOLON: POSTER */}
                        <Box sx={{ width: { xs: '100%', md: '25%' }, flexShrink: 0 }}>
                            <Box component="img" src={API_IMAGE + movie.poster_path} sx={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }} />
                            
                            {/* Puan Kartı (Resimdeki Cehennem Puanı veya IMDb stili) */}
                            <Box sx={{ backgroundColor: 'rgba(0,0,0,0.6)', p: 3, mt: 3, borderRadius: '16px', border: '1px solid rgba(255, 170, 0, 0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 'bold', mb: 1 }}>Sistem Puanı</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="h3" sx={{ color: '#ffaa00', fontWeight: 'bold', textShadow: '0 0 20px rgba(255,170,0,0.5)' }}>
                                        {movie.vote_average ? movie.vote_average.toFixed(1) : '-'}
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', mt: 1 }}>/10</Typography>
                                </Box>
                                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', mt: 1 }}>{movie.vote_count} Oy</Typography>
                            </Box>
                        </Box>

                        {/* ORTA KOLON: BİLGİ VE LİSTE */}
                        <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, mb: 1, textShadow: '0 0 15px rgba(0,255,255,0.5)' }}>{movie.title}</Typography>
                            {movie.tagline && <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', mb: 3 }}>"{movie.tagline}"</Typography>}
                            
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.8, mb: 4 }}>
                                {movie.overview || "Özet bilgi bulunamadı."}
                            </Typography>

                            {/* DİKEY METADATA TABLOSU (Katalog Yapısı) */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, backgroundColor: 'rgba(0,0,0,0.3)', p: 3, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>
                                    <Typography sx={{ width: '120px', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>Süre</Typography>
                                    <Typography sx={{ color: '#00ffff', fontWeight: 'bold' }}>{movie.runtime ? `${movie.runtime} dakika` : 'Bilinmiyor'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>
                                    <Typography sx={{ width: '120px', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>Yıl - Ülke</Typography>
                                    <Typography sx={{ color: '#fff' }}>{movie.release_date?.split('-')[0]} {movie.production_countries?.length > 0 ? `/ ${movie.production_countries[0].name}` : ''}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>
                                    <Typography sx={{ width: '120px', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>Türler</Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {genres?.map(g => ( <span key={g.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', color: '#fff' }}>{g.name}</span> ))}
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography sx={{ width: '120px', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>Kategori</Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>{type === 'tv' ? 'Diziler' : 'Filmler'}</Typography>
                                </Box>
                            </Box>

                            {/* YUVARLAK KARTLI KADRO (Dikey tablo sonrası yerleşim) */}
                            {cast.length > 0 && (
                                <Box>
                                    <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>Oyuncu Kadrosu</Typography>
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', pb: 2 }}>
                                        {cast.map(actor => (
                                            <Link to={`/actordetails/${actor.id}`} key={actor.id} style={{ textDecoration: 'none' }}>
                                                <Box sx={{ width: '75px', flexShrink: 0, '&:hover': { transform: 'scale(1.05)' }, transition: '0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <Box component="img" src={actor.profile_path ? API_IMAGE + actor.profile_path : 'https://via.placeholder.com/100?text=Yok'} 
                                                         sx={{ width: '65px', height: '65px', borderRadius: '50%', objectFit: 'cover', mb: 1, border: '2px solid rgba(0,255,255,0.3)', boxShadow: '0 0 10px rgba(0,255,255,0.2)' }} />
                                                    <Typography sx={{ color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', lineHeight: 1.1, textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{actor.name}</Typography>
                                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{actor.character}</Typography>
                                                </Box>
                                            </Link>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        {/* SAĞ KOLON: AKSİYONLAR */}
                        <Box sx={{ width: { xs: '100%', md: '25%' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            
                            {/* Fragman Butonu */}
                            {videos.length > 0 ? (
                                <Button variant="contained" href={`https://www.youtube.com/watch?v=${videos[0].key}`} target="_blank"
                                        sx={{ 
                                            backgroundColor: 'rgba(255, 0, 0, 0.2)', color: '#ff4444', py: 2, borderRadius: '16px', border: '1px solid rgba(255,0,0,0.3)',
                                            fontWeight: 'bold', letterSpacing: '1px', transition: 'all 0.3s',
                                            '&:hover': { backgroundColor: 'rgba(255,0,0,0.8)', color: '#fff', boxShadow: '0 0 25px rgba(255,0,0,0.6)', borderColor: 'rgba(255,0,0,1)' }
                                        }}>
                                    ▶ Fragman İzle
                                </Button>
                            ) : (
                                <Button variant="contained" disabled
                                        sx={{ py: 2, borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.05) !important', color: 'grey !important' }}>
                                    Fragman Yok
                                </Button>
                            )}

                            {/* Etkileşim Paneli */}
                            {user ? (
                                <Box sx={{ backgroundColor: 'rgba(255,255,255,0.03)', p: 3, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>Etkileşimler</Typography>
                                    
                                    <Button fullWidth variant="outlined" sx={{ 
                                        color: '#ffaa00', borderColor: 'rgba(255,170,0,0.5)', py: 1.5, borderRadius: '12px', mb: 2,
                                        '&:hover': { backgroundColor: 'rgba(255,170,0,0.1)', borderColor: '#ffaa00', color: '#fff' }
                                    }}>
                                        İzledim (Puan Ver)
                                    </Button>

                                    <Button fullWidth variant="contained" sx={{ 
                                        backgroundColor: '#00ffff', color: '#000', py: 1.5, borderRadius: '12px', fontWeight: 'bold',
                                        '&:hover': { backgroundColor: '#fff', color: '#000', boxShadow: '0 0 20px rgba(0,255,255,0.5)' }
                                    }} startIcon={<PlaylistAddIcon />} onClick={handleAddClick}>
                                        Listeye Ekle
                                    </Button>
                                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleAddClose} PaperProps={{ sx: { bgcolor: 'rgba(21, 0, 48, 0.9)', color: '#fff', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 255, 255, 0.3)' } }}>
                                        {lists.map(list => (
                                            <MenuItem key={list._id} onClick={() => handleAddToList(list._id)} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
                                                {list.title} {list.type !== 'custom' && <Typography component="span" fontSize="0.75rem" color={teal[200]} ml={1}>(Sistem)</Typography>}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                            ) : (
                                <Box sx={{ backgroundColor: 'rgba(255,255,255,0.03)', p: 3, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Listeye eklemek için giriş yapmalısınız.</Typography>
                                </Box>
                            )}
                        </Box>
                        
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default Detailed