
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Pagination } from '@mui/material';
import '../assets/css/home.css';

import MovieList from '../components/MovieList';


const Home = () => {

  const API_POPULAR = "https://api.themoviedb.org/3/movie/popular?api_key=835d874e72bfa8309fafe5737461451b&language=tr&page=";
  const API_GENRES = "https://api.themoviedb.org/3/genre/movie/list?api_key=835d874e72bfa8309fafe5737461451b&language=tr";

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const onChange = (pageNumber) => {
    console.log('Page: ', pageNumber);
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    async function getGenres() {
      const resGenres = await axios.get(API_GENRES);
      setGenres(resGenres.data.genres);
    }

    async function getMovies() {
      const resMovies = await axios.get(API_POPULAR+currentPage);
      setMovies(resMovies.data.results);
    }
    
    getGenres();
    getMovies();

  }, [currentPage]);

    console.log(movies);

  return (
    <Box sx={{ pt: { xs: 12, md: 15 }, pb: 10, px: { xs: 2, md: 5 } }}>
      <h3 className="neonHeading">Popüler Filmler</h3>
      <MovieList movieList={movies} genreList={genres} />

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <Pagination 
          count={500} 
          page={currentPage} 
          onChange={(e, page) => onChange(page)} 
          size="large"
          color="primary"
          sx={{ 
            '& .MuiPaginationItem-root': { color: '#fff', borderColor: 'rgba(0, 255, 255, 0.3)', '&:hover': { backgroundColor: 'rgba(0, 255, 255, 0.2)' } },
            '& .Mui-selected': { backgroundColor: 'rgba(0, 255, 255, 0.6) !important', color: '#000', boxShadow: '0 0 10px rgba(0,255,255,0.8)' }
          }} 
        />
      </Box>
    </Box>
  )
}

export default Home