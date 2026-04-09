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

  const linkPath = item.media_type === 'tv' ? `/seriesdetails/${item.id}` : `/moviedetails/${item.id}`;

  const posterPath = item.poster_path != null
    ? <Link to={linkPath}><img src={API_IMAGE + item.poster_path} alt={item.title} /></Link>
    : <div className='poster_null'>
      <h3 className='poster_null_title'><Link to={linkPath} className='movie-title'>{item.title}</Link></h3>
    </div>;

  const backdropPath = item.backdrop_path != null
    ? <Link to={linkPath}><img src={API_IMAGE + item.backdrop_path} alt={item.title} /></Link>
    : <></>;

  return ( item ? 
    <div key={item.id} className="movie" >
      {posterPath}
    </div>
    : <Skeleton variant="rectangular" width={200} height={300} />
  )
}

export default Movie


// metin.length

// var str = "Mazda,Opel,Toyota";
// var result = str.substr(6,4); // Opel