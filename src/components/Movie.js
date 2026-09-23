import { Skeleton } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const API_IMAGE = "https://image.tmdb.org/t/p/w500/";

const Movie = (props) => {
  const item = props.movie;
  if (!item) {
    return <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '150%', borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.05)' }} />;
  }

  const isTv = item.media_type === 'tv' || Boolean(item.first_air_date) || Boolean(item.name && !item.title);
  const linkPath = isTv 
    ? `/seriesdetails/${btoa(item.id.toString())}` 
    : `/moviedetails/${btoa(item.id.toString())}`;

  const title = item.title || item.name || 'İçerik';
  const posterUrl = item.poster_path ? `${API_IMAGE}${item.poster_path}` : null;

  return (
    <div key={item.id} className="movie glass-panel">
      {posterUrl ? (
        <Link to={linkPath} style={{ width: '100%', height: '100%', display: 'block' }}>
          <img 
            src={posterUrl} 
            alt={title}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/300x450/101826/ffffff?text=Afiş+Yok';
            }}
          />
        </Link>
      ) : (
        <div className='poster_null'>
          <h3 className='poster_null_title'>
            <Link to={linkPath} style={{ color: 'inherit', textDecoration: 'none' }}>{title}</Link>
          </h3>
        </div>
      )}
    </div>
  );
};

export default Movie;