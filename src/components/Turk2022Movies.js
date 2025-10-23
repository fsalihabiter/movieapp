import React from "react";

import SlideCarousel from "./SlideCarousel";

const Turk2022Movies = (props) => {
	const API_TURK_2022 =
		"https://api.themoviedb.org/3/discover/movie?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR&region=tr&sort_by=primary_release_date.desc&include_adult=false&page=1&year=2025&with_original_language=tr&watch_region=tr";

	return <SlideCarousel movieUrl={API_TURK_2022} slidesToSlide={3} autoPlaySpeed={7000} />;
};

export default Turk2022Movies;
