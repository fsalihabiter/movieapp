import React from 'react'

import SlideCarousel from './SlideCarousel';

const LastedMovies = (props) => {

    const API_TURK_LASTED = "https://api.themoviedb.org/3/discover/movie?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR&region=tr&include_adult=false&page=1&year=2025&with_original_language=tr&watch_region=tr";

    return (
        <SlideCarousel movieUrl={API_TURK_LASTED} slidesToSlide={3} autoPlaySpeed={7000} />
    )
}

export default LastedMovies