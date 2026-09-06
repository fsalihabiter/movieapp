
import React from 'react';
import { useParams } from 'react-router-dom';
import Detailed from '../components/MovieDetails/Detailed'

const MovieDetails = ({ type = "movie" }) => {

  const { movieId } = useParams();
  let decodedId = movieId;
  try { decodedId = atob(movieId); } catch(e) {}

  return (
    <Detailed movieId={decodedId} type={type} />
  )
}

export default MovieDetails