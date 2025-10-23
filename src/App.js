import * as React from 'react';
import { styled } from '@mui/material/styles';

import { Grid } from '@mui/material';
import Paper from '@mui/material/Paper';

import MenuBar from './components/MenuBar';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Actors from './pages/Actors';
import Profile from './pages/Profile';
import MyLists from './pages/MyLists';
import MovieDetails from './pages/MovieDetails';
import MyFavorites from './pages/MyFavorites';
import Logout from './pages/Logout';

function App() {

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: 0,
    margin: '1rem 2rem',
  }));

  return (
    <BrowserRouter>
      <MenuBar />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item>
            <Routes>
              <Route exact path='/' element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path='/movies' element={<Movies />} />
              <Route path='/series' element={<Series />} />
              <Route path='/actors' element={<Actors />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/mylists' element={<MyLists />} />
              <Route path='/moviedetails/:movieId' element={<MovieDetails />} />
              <Route path='/myfavorites' element={<MyFavorites />} />
              <Route path='/logout' element={<Logout />} />
            </Routes>
          </Item>
        </Grid>
      </Grid>
    </BrowserRouter>
  );
}
export default App;