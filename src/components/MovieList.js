import React from 'react'
import Movie from './Movie'

const MovieList = ( params ) => {

  return (
    <>
      <div className='movie-list'>
        {params.movieList.map((movie) => (
          <Movie key={movie.id} movie={movie} genreList={params.genreList} />
        ))} 
      </div>
    </>
  )
}

export default MovieList