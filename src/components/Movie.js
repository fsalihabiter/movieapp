import { Skeleton } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const API_IMAGE = "https://image.tmdb.org/t/p/w500/";

const Movie = (props) => {
  const item = props.movie ? props.movie : null;
  const linkPath = item.media_type === 'tv' ? `/seriesdetails/${btoa(item.id.toString())}` : `/moviedetails/${btoa(item.id.toString())}`;

  const posterPath = item.poster_path != null
    ? <Link to={linkPath} style={{ width: '100%', height: '100%', display: 'block' }}>
        <img src={API_IMAGE + item.poster_path} alt={item.title} />
      </Link>
    : <div className='poster_null'>
        <h3 className='poster_null_title'>
            <Link to={linkPath} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title || item.name}</Link>
        </h3>
      </div>;

  return ( item ? 
    <div key={item.id} className="movie glass-panel">
      {posterPath}
    </div>
    : <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '150%', borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.05)' }} />
  )
}

export default Movie;