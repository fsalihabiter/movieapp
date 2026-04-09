import React from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

import "../assets/css/home.css";
import "react-multi-carousel/lib/styles.css";

import Hero from "../components/Hero";
import RecommendedMovies from "../components/RecommendedMovies";
import PopularMovies from "../components/PopularMovies";
import ReleasedMovies from "../components/ReleasedMovies";
import LastedMovies from "../components/LastedMovies";
import PopularSeries from "../components/PopularSeries";
import LastedComedyMovies from "../components/LastedComedyMovies";
import Turk2022Movies from "../components/Turk2022Movies";

const Home = () => {
	const { t } = useTranslation();
	return (
		<Box sx={{ width: '100%', pb: 5 }}>
            <Hero />
            <RecommendedMovies />

            <Box sx={{ pl: { xs: 2, md: 5 }, pr: { xs: 2, md: 0 } }}>
                <h3 className="neonHeading">{t('home.popular_movies')}</h3>
                <Box sx={{ mb: 6 }}><PopularMovies /></Box>

                <h3 className="neonHeading">{t('home.released_movies')}</h3>
                <Box sx={{ mb: 6 }}><ReleasedMovies /></Box>

                <h3 className="neonHeading">{t('home.lasted_movies')}</h3>
                <Box sx={{ mb: 6 }}><LastedMovies /></Box>

                <h3 className="neonHeading">{t('home.popular_series')}</h3>
                <Box sx={{ mb: 6 }}><PopularSeries /></Box>

                <h3 className="neonHeading">{t('home.lasted_comedy')}</h3>
                <Box sx={{ mb: 6 }}><LastedComedyMovies /></Box>

                <h3 className="neonHeading">{t('home.turk_2022')}</h3>
                <Box sx={{ mb: 6 }}><Turk2022Movies /></Box>
            </Box>
		</Box>
	);
};

export default Home;
