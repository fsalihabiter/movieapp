import { Box, Card, CardContent, CardMedia, Skeleton, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { grey, teal } from '@mui/material/colors';

const MovieDetails = (props) => {

    // console.log(props);

    const movieId = props.movieId;

    const API_IMAGE = "https://image.tmdb.org/t/p/w500/";

    const [movie, setMovie] = useState({});
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    // console.table(API_MOVIE_DETAILS);

    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR`)
            .then((res) => {
                setMovie(res.data);
                setGenres(res.data.genres);
            })
            .catch((e) => console.log(e))
            .finally(() => setLoading(false));
    }, [movieId]);

    return (
        <>
            {loading && <Skeleton animation="wave" width={'100%'} height={350} />}
            {!loading &&
                <Card sx={{ display: 'flex' }}>
                    <CardMedia component="img" sx={{ width: '40%' }} image={API_IMAGE + movie.backdrop_path} alt={movie.title} />
                    <Box width={'60%'} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5" color={teal['A700']}>{movie.title}</Typography>
                            <Typography component="div" variant="body3" color={grey[500]}>{movie.overview}</Typography>
                            <Typography component="div" variant="body4" color={grey[500]} >{movie.runtime} dk</Typography>
                            <Typography component="div" variant="body5" color={grey[500]}>
                                Filmin Türü : {genres.map((genre, index) => <span key={genre.id} >{genre.name}{genres.length - 1 !== index && ", "}</span>)}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>}
        </>
    )
}

export default MovieDetails