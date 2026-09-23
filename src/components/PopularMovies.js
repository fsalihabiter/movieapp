import React from "react";

import SlideCarousel from "../components/SlideCarousel";

const PopularMovies = () => {
	const API_POPULAR =
		"https://api.themoviedb.org/3/movie/popular?api_key=835d874e72bfa8309fafe5737461451b&language=tr-TR";

	return (
		<>
			<SlideCarousel movieUrl={API_POPULAR} slidesToSlide={3} autoPlaySpeed={7000} />
		</>
	);
};

export default PopularMovies;
