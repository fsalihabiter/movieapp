import * as React from 'react';
import { Box } from '@mui/material';

import MenuBar from './components/MenuBar';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Actors from './pages/Actors';
import Profile from './pages/Profile';
import MyLists from './pages/MyLists';
import MovieDetails from './pages/MovieDetails';
import ActorDetails from './pages/ActorDetails';
import MyFavorites from './pages/MyFavorites';
import Logout from './pages/Logout';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <MenuBar />
      <Box sx={{ width: '100%', minHeight: '100vh', m: 0, p: 0, pb: 10, pt: '80px' }}>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/series' element={<Series />} />
          <Route path='/actors' element={<Actors />} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/mylists' element={<ProtectedRoute><MyLists /></ProtectedRoute>} />
          <Route path='/moviedetails/:movieId' element={<MovieDetails type="movie" />} />
          <Route path='/seriesdetails/:movieId' element={<MovieDetails type="tv" />} />
          <Route path='/actordetails/:actorId' element={<ActorDetails />} />
          <Route path='/myfavorites' element={<ProtectedRoute><MyFavorites /></ProtectedRoute>} />
          <Route path='/logout' element={<Logout />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}
export default App;