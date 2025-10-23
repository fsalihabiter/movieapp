import React from 'react'

import SlideCarousel from './SlideCarousel';

const LastedComedyMovies = (props) => {

    const API_COMEDY = "https://api.themoviedb.org/3/discover/movie?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR&sort_by=primary_release_date.asc&include_adult=false&page=1&year=2023&with_original_language=tr&watch_region=tr";

    return (
        <SlideCarousel movieUrl={API_COMEDY} slidesToSlide={3} autoPlaySpeed={7000} />
    )
}

export default LastedComedyMovies