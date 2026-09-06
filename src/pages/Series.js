import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Pagination } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import '../assets/css/home.css';

import MovieList from '../components/MovieList';

const Series = () => {
  const [searchParams] = useSearchParams();
  const genreId = searchParams.get('genre');

  const [series, setSeries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeGenreName, setActiveGenreName] = useState("");

  const onChange = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [genreId]);

  useEffect(() => {
    async function getGenres() {
      const resGenres = await axios.get("https://api.themoviedb.org/3/genre/tv/list?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR");
      setGenres(resGenres.data.genres);
      if (genreId) {
         const matchingGenre = resGenres.data.genres.find(g => g.id.toString() === genreId);
         if(matchingGenre) setActiveGenreName(matchingGenre.name);
      } else {
         setActiveGenreName("");
      }
    }
    getGenres();
  }, [genreId]);

  useEffect(() => {
    async function getSeries() {
      let url = "";
      if (genreId) {
          url = `https://api.themoviedb.org/3/discover/tv?api_key=835d874e72bfa8309fafe5737461451b&with_genres=${genreId}&page=${currentPage}&language=tr-TR`;
      } else {
          url = `https://api.themoviedb.org/3/tv/popular?api_key=835d874e72bfa8309fafe5737461451b&page=${currentPage}&language=tr-TR`;
      }
      
      const resSeries = await axios.get(url);
      const formattedSeries = resSeries.data.results.map(s => ({
        ...s,
        title: s.name,
        release_date: s.first_air_date,
        media_type: 'tv'
      }));
      setSeries(formattedSeries);
    }
    getSeries();
  }, [currentPage, genreId]);

  return (
    <Box sx={{ pt: { xs: 12, md: 15 }, pb: 10, px: { xs: 2, md: 5 } }}>
      <h3 className="neonHeading">{genreId && activeGenreName ? `${activeGenreName} Dizileri` : 'Popüler Diziler'}</h3>
      <MovieList movieList={series} genreList={genres} />

      {series.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <Pagination count={500} page={currentPage} onChange={(e, page) => onChange(page)} 
            size="large" color="primary"
            sx={{ '& .MuiPaginationItem-root': { color: '#fff', borderColor: 'rgba(0, 255, 255, 0.3)', '&:hover': { backgroundColor: 'rgba(0, 255, 255, 0.2)' } }, '& .Mui-selected': { backgroundColor: 'rgba(0, 255, 255, 0.6) !important', color: '#000', boxShadow: '0 0 10px rgba(0,255,255,0.8)' } }} />
        </Box>
      )}
    </Box>
  )
}

export default Series;