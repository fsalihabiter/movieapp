import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import Movie from './Movie';
import { Skeleton } from '@mui/material';

const SlideCarousel = (props) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const slidesToSlide = props.slidesToSlide !== "" ? props.slidesToSlide : 1;
  const showDots = false;
  const autoPlaySpeed = props.autoPlaySpeed !== "" ? props.autoPlaySpeed : 5000;

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 7
    },
    tablet: {
      breakpoint: { max: 1024, min: 512 },
      items: 5
    },
    mobile: {
      breakpoint: { max: 512, min: 0 },
      items: 2
    }
  };

  useEffect(() => {
    axios(props.movieUrl)
      .then((resg) => {
        setMovies(resg.data.results);
        // console.log(movies);
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, [props.movieUrl, movies]);

  return (
    <>
    {loading && <Skeleton width={'100%'} height={720} />}
      <Carousel infinite showDots={showDots} arrows responsive={responsive} slidesToSlide={slidesToSlide} autoPlaySpeed={autoPlaySpeed} >
        {movies.map((movie) => (
          movie ? <Movie key={movie.id} movie={movie} /> : <Skeleton width={195} height={298} />
        ))}
      </Carousel>
    </>
  )
}

export default SlideCarousel