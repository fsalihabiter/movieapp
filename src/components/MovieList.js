import React from 'react'
import Movie from './Movie'
import { Grid } from '@mui/material'

const MovieList = ({ movieList, genreList }) => {
  return (
    <Grid container spacing={3} sx={{ my: 2 }}>
      {movieList.map((movie) => (
        <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.id}>
          <Movie movie={movie} genreList={genreList} />
        </Grid>
      ))} 
    </Grid>
  )
}

export default MovieList