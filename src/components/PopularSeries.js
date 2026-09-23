import React from "react";

import SlideCarousel from "./SlideCarousel";

const PopularSeries = () => {
	const API_POPULAR_SERIES =
		"https://api.themoviedb.org/3/tv/popular?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR&page=2";

	return <SlideCarousel movieUrl={API_POPULAR_SERIES} slidesToSlide={3} autoPlaySpeed={7000} />;
};

export default PopularSeries;
