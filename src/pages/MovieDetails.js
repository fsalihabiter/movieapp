
import React from 'react';
import { useParams } from 'react-router-dom';
import Detailed from '../components/MovieDetails/Detailed'

const MovieDetails = () => {

  const { movieId } = useParams();

  return (
    <Detailed movieId={movieId} />
  )
}

export default MovieDetails