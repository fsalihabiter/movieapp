import { Skeleton } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const API_IMAGE = "https://image.tmdb.org/t/p/w500/";

const Movie = (props) => {
  
  const item = props.movie ? props.movie : null;

  const summary = item.overview !== ""
    ? (item.overview.split(".")[0].length > 200
      ? item.overview.split(".")[0].substr(0, 200) + " ..."
      : item.overview.split(".")[0] + ".")
    : "";

  const posterPath = item.poster_path != null
    ? <img src={API_IMAGE + item.poster_path} alt={item.title} />
    : <div className='poster_null'>
      <h3 className='poster_null_title'><Link to={`/moviedetails/${item.id}`} className='movie-title'>{item.title}</Link></h3>
    </div>;

  const backdropPath = item.backdrop_path != null
    ? <img src={API_IMAGE + item.backdrop_path} alt={item.title} />
    : <></>;

  return ( item ? 
    <div key={item.id} className="movie" >
      {posterPath}
      <div className='movie-detail' >
        {backdropPath}
        <span className='vote'>{item.vote_average}</span>
        <Link to={`/moviedetails/${item.id}`} className='movie-title'>{item.title}</Link>
        <div className='movie-overview'>
          <p> {summary} </p>
        </div>
      </div>
    </div>
    : <Skeleton />
  )
}

export default Movie


// metin.length

// var str = "Mazda,Opel,Toyota";
// var result = str.substr(6,4); // Opel