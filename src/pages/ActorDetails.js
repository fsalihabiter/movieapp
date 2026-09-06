import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Skeleton } from '@mui/material';
import MovieList from '../components/MovieList';

const ActorDetails = () => {
    const { actorId } = useParams();
    let decodedId = actorId;
    try { decodedId = atob(actorId); } catch(e) {}
    
    const API_IMAGE = "https://image.tmdb.org/t/p/w500/";
    
    const [actor, setActor] = useState({});
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActorData = async () => {
            try {
                const res = await axios.get(`https://api.themoviedb.org/3/person/${decodedId}?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR`);
                setActor(res.data);

                const creditsRes = await axios.get(`https://api.themoviedb.org/3/person/${decodedId}/movie_credits?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR`);
                // Sort by popularity to show best movies first
                const sortedMovies = creditsRes.data.cast.sort((a, b) => b.popularity - a.popularity).slice(0, 20);
                setMovies(sortedMovies);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        fetchActorData();
    }, [actorId]);

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', pt: { xs: 12, md: 15 }, pb: 10, px: { xs: 2, md: 5 } }}>
            {loading ? <Skeleton animation="wave" width="100%" height={500} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} /> : (
                <>
                    <Box sx={{
                        display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                        backgroundColor: 'rgba(6, 25, 59, 0.4)',
                        borderRadius: '24px', backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(0, 255, 255, 0.3)',
                        boxShadow: '0 0 30px rgba(0, 255, 255, 0.2), 0 0 60px rgba(255, 0, 255, 0.15), inset 0 0 20px rgba(255, 170, 0, 0.1)',
                        overflow: 'hidden', mb: 8
                    }}>
                        <Box component="img" src={actor.profile_path ? API_IMAGE + actor.profile_path : 'https://via.placeholder.com/500x750?text=No+Image'} 
                            sx={{ width: { xs: '100%', md: '30%' }, objectFit: 'cover' }} />
                        <Box sx={{ p: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: { xs: '100%', md: '70%' } }}>
                            <Typography variant="h2" sx={{ color: '#fff', fontWeight: 800, mb: 1, textShadow: '0 0 15px rgba(0,255,255,0.5)' }}>{actor.name}</Typography>
                            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                                {actor.birthday && <Typography sx={{ color: '#00ffff', fontWeight: 'bold' }}>Doğum: {actor.birthday}</Typography>}
                                {actor.place_of_birth && <Typography sx={{ color: '#ffaa00', fontWeight: 'bold' }}>Yer: {actor.place_of_birth}</Typography>}
                            </Box>
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                                {actor.biography || "Biyografi bulunamadı."}
                            </Typography>
                        </Box>
                    </Box>

                    <h3 className="neonHeading">Rol Aldığı Filmler (Filmografi)</h3>
                    <MovieList movieList={movies} genreList={[]} />
                </>
            )}
        </Box>
    )
}
export default ActorDetails;
