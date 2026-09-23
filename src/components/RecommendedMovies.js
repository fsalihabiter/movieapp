import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Box, Typography, Skeleton } from '@mui/material';
import Carousel from 'react-multi-carousel';
import Movie from './Movie';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { teal } from '@mui/material/colors';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const RecommendedMovies = () => {
    const { user } = useContext(AuthContext);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_KEY = "835d874e72bfa8309fafe5737461451b";

    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 7 },
        tablet: { breakpoint: { max: 1024, min: 512 }, items: 5 },
        mobile: { breakpoint: { max: 512, min: 0 }, items: 2 }
    };

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchRecommendations = async () => {
            try {
                // 1. Zevk analizini başlat, kullanıcının veritabanındaki her şeyini al.
                const res = await api.get('/lists');
                const allLists = res.data;
                const favoritesList = allLists.find(l => l.type === 'system_favorites');

                if (!favoritesList || favoritesList.contentItems.length === 0) {
                    setLoading(false);
                    return; // Hiç favorisi yoksa motoru çalıştırma
                }

                const favItems = favoritesList.contentItems;
                
                // 2. Karakteristik belirleme - Rastgele 2 favori filmi referans al
                const sampleSize = Math.min(2, favItems.length);
                const shuffled = [...favItems].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, sampleSize);

                // 3. Kullanıcının halihazırda bildiği (listelerinde olan) tüm filmleri depola
                const knownMovieIds = new Set();
                allLists.forEach(list => {
                    list.contentItems.forEach(item => knownMovieIds.add(item.movieId.toString()));
                });

                // 4. TMDB yapay zeka/öneri ağından referans filmlere benzerleri paralel olarak çek
                let aggregatedRecs = [];
                for (let movie of selected) {
                    const recRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie.movieId}/recommendations?api_key=${API_KEY}&language=tr-TR`);
                    aggregatedRecs = [...aggregatedRecs, ...recRes.data.results];
                }

                // 5. Bilinmeyenleri süz ve kopyaları yok et (Filtreleme Ağı)
                const uniqueRecsMap = new Map();
                aggregatedRecs.forEach(movie => {
                    // Kullanıcıda VEYA filtreden geçmiş listede yoksa yepyeni kesindir.
                    if (!knownMovieIds.has(movie.id.toString()) && !uniqueRecsMap.has(movie.id) && movie.poster_path) {
                        uniqueRecsMap.set(movie.id, movie);
                    }
                });

                // Maksimum 15 film göster
                const finalMovies = Array.from(uniqueRecsMap.values()).slice(0, 15);
                setMovies(finalMovies);

            } catch (e) {
                // Oturum geçersiz olduğunda veya veri çekilemediğinde öneri alanını sessizce gizle
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user]);

    // Eğer giriş yapılmamışsa veya önerilecek film bulunamadıysa bileşeni gizle
    if (!user || (!loading && movies.length === 0)) return null;

    return (
        <Box sx={{ mb: 6, px: { xs: 2, md: 5 } }}>
            <Typography variant="h5" mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: teal[300], fontWeight: 700 }}>
                <AutoAwesomeIcon /> Sizin İçin Özel Öneriler
            </Typography>
            {loading ? (
                <Skeleton width={'100%'} height={300} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />
            ) : (
                <Carousel infinite showDots={false} arrows responsive={responsive} slidesToSlide={2}>
                    {movies.map((movie) => (
                        <Box sx={{ pr: 2, height: '100%' }} key={'rec-'+movie.id}>
                            <Movie movie={movie} />
                        </Box>
                    ))}
                </Carousel>
            )}
        </Box>
    ); 
};

export default RecommendedMovies;
