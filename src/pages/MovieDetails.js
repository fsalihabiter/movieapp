
import React from 'react';
import { useParams } from 'react-router-dom';
import Detailed from '../components/MovieDetails/Detailed'

const MovieDetails = ({ type = "movie" }) => {

  const { movieId } = useParams();

  return (
    <Detailed movieId={movieId} type={type} />
  )
}

export default MovieDetails