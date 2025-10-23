import React from "react";

import "../assets/css/home.css";
import "react-multi-carousel/lib/styles.css";

import PopularMovies from "../components/PopularMovies";
import ReleasedMovies from "../components/ReleasedMovies";
import LastedMovies from "../components/LastedMovies";
import PopularSeries from "../components/PopularSeries";
import LastedComedyMovies from "../components/LastedComedyMovies";
import Turk2022Movies from "../components/Turk2022Movies";

const Home = () => {
	return (
		<>
			<h3>Popüler Filmler</h3>
			<PopularMovies />

			<hr />

			<h3>Yayımlanan Filmler</h3>
			<ReleasedMovies />

			<hr />

			<h3>Son Çıkan Filmler</h3>
			<LastedMovies />

			<hr />

			<h3>Popüler Diziler</h3>
			<PopularSeries />

			<hr />

			<h3>Son Çıkan Komedi Filmleri</h3>
			<LastedComedyMovies />

			<hr />

			<h3>2025 Türk Filmleri</h3>
			<Turk2022Movies />
		</>
	);
};

export default Home;
