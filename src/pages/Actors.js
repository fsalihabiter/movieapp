import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Pagination, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Actors = () => {
  const API_POPULAR = "https://api.themoviedb.org/3/person/popular?api_key=835d874e72bfa8309fafe5737461451b&language=tr&page=";
  const API_IMAGE = "https://image.tmdb.org/t/p/w500/";

  const [actors, setActors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const onChange = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(API_POPULAR + currentPage);
      setActors(res.data.results);
    }
    fetchData();
  }, [currentPage]);

  return (
    <Box sx={{ pt: { xs: 2, md: 3 }, pb: 10, px: { xs: 2, md: 5 } }}>
      <Typography variant="h3" className="neonHeading">Popüler Oyuncular</Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {actors.map(actor => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={actor.id}>
            <Link to={`/actordetails/${actor.id}`} style={{ textDecoration: 'none' }}>
              <Box sx={{ 
                width: '100%', 
                backgroundColor: 'rgba(21,0,48,0.5)', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                border: '1px solid rgba(0,255,255,0.1)', 
                transition: 'all 0.3s', 
                '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 10px 25px rgba(0,255,255,0.3)', borderColor: 'rgba(0,255,255,0.5)' } 
              }}>
                {actor.profile_path ? (
                  <Box component="img" src={API_IMAGE + actor.profile_path} sx={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }} />
                ) : (
                  <Box sx={{ width: '100%', aspectRatio: '2/3', bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="gray">Yok</Typography></Box>
                )}
                <Box sx={{ p: 2 }}>
                  <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem', mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{actor.name}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Popülerlik: {actor.popularity.toFixed(0)}</Typography>
                </Box>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <Pagination count={500} page={currentPage} onChange={(e, page) => onChange(page)} 
          size="large" color="primary"
          sx={{ '& .MuiPaginationItem-root': { color: '#fff', borderColor: 'rgba(0, 255, 255, 0.3)' }, '& .Mui-selected': { backgroundColor: 'rgba(0, 255, 255, 0.6) !important', color: '#000', boxShadow: '0 0 10px rgba(0,255,255,0.8)' } }} />
      </Box>
    </Box>
  )
}

export default Actors;