
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
      setMovies(resMovies.data.results.slice(0,10));
    }
    
    getGenres();
    getMovies();

  }, [currentPage]);

    console.log(movies);

  return (
    <>
      
      <MovieList movieList={movies} genreList={genres} />

      <div className='pages'>
        <div showQuickJumper defaultCurrent={currentPage} total={10000} onChange={onChange} />
      </div>
    </>
  )
}

export default Home