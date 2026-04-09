import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { teal } from '@mui/material/colors';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(username, email, password);
        setIsRegister(false);
        setError('Kayıt başarılı, lütfen giriş yapın.');
      } else {
        await login(username, password);
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data || 'Bir hata oluştu!');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400, backgroundColor: '#1A2027' }}>
        <Typography variant="h5" color={teal[200]} mb={3} textAlign="center">
          {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
        </Typography>
        {error && <Typography color="error" textAlign="center" mb={2}>{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Kullanıcı Adı"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            InputLabelProps={{ style: { color: teal[100] } }}
            sx={{ input: { color: '#fff' } }}
          />
          {isRegister && (
            <TextField
              fullWidth
              label="E-Posta"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputLabelProps={{ style: { color: teal[100] } }}
              sx={{ input: { color: '#fff' } }}
            />
          )}
          <TextField
            fullWidth
            label="Şifre"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputLabelProps={{ style: { color: teal[100] } }}
            sx={{ input: { color: '#fff' } }}
          />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 3, backgroundColor: teal[500], '&:hover': { backgroundColor: teal[700] } }}>
            {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
          </Button>
          <Button fullWidth sx={{ mt: 1, color: teal[200] }} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Zaten hesabın var mı? Giriş Yap' : 'Hesabın yok mu? Kayıt Ol'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;