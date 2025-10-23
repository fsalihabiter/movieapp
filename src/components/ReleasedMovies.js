import React from 'react'

import SlideCarousel from './SlideCarousel';

const ReleasedMovies = (props) => {

    const API_TURK_RELEASED = "https://api.themoviedb.org/3/discover/movie?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR&region=tr&sort_by=popularity.desc&include_adult=false&page=1&with_original_language=tr&watch_region=en";

    return (
        <SlideCarousel movieUrl={API_TURK_RELEASED} slidesToSlide={3} autoPlaySpeed={7000} />
    )
}

export default ReleasedMovies