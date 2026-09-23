import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        try {
            if (isRegister) {
                await register(username, email, password);
                setIsRegister(false);
                setSuccessMsg('Kayıt başarılı! Lütfen giriş yapın.');
            } else {
                await login(username, password);
                navigate('/home');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Kullanıcı adı veya şifre hatalı!');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)', px: 2, pt: 3, pb: 6 }}>
            {/* Background glowing orb */}
            <Box sx={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--neon-cyan) 0%, transparent 60%)', filter: 'blur(80px)', opacity: 0.15, zIndex: -1 }} />

            <Box className="glass-panel animate-entrance" sx={{ width: '100%', maxWidth: '420px', p: 5, borderRadius: '24px', border: '1px solid var(--neon-cyan-faded)', boxShadow: '0 0 40px rgba(0, 255, 255, 0.05)' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 1, textAlign: 'center', letterSpacing: '1px', textShadow: '0 0 10px rgba(0,255,255,0.4)' }}>
                    {isRegister ? 'YENI HESAP' : 'GİRİŞ YAP'}
                </Typography>
                
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', mb: 4, fontSize: '0.9rem' }}>
                    Siberpunk evrenine {isRegister ? 'katılmak için bilgilerini doldur' : 'dönüş yap'}
                </Typography>

                {error && <Typography sx={{ color: 'var(--neon-magenta)', textAlign: 'center', mb: 2, bgcolor: 'rgba(255,0,255,0.1)', py: 1, borderRadius: '8px', border: '1px solid var(--neon-magenta-faded)', textShadow: '0 0 10px var(--neon-magenta)' }}>{error}</Typography>}
                {successMsg && <Typography sx={{ color: 'var(--neon-cyan)', textAlign: 'center', mb: 2, bgcolor: 'rgba(0,255,255,0.1)', py: 1, borderRadius: '8px', border: '1px solid var(--neon-cyan-faded)' }}>{successMsg}</Typography>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <TextField
                        fullWidth label="Kullanıcı Adı" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} required
                        InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#fff', bgcolor: 'rgba(0,0,0,0.3)', borderRadius: '12px',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                '&:hover fieldset': { borderColor: 'var(--neon-cyan-faded)' },
                                '&.Mui-focused fieldset': { borderColor: 'var(--neon-cyan)', boxShadow: '0 0 10px var(--neon-cyan-faded)' },
                            }
                        }}
                    />
                    {isRegister && (
                        <TextField
                            fullWidth label="E-Posta" type="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} required
                            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff', bgcolor: 'rgba(0,0,0,0.3)', borderRadius: '12px',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                    '&:hover fieldset': { borderColor: 'var(--neon-cyan-faded)' },
                                    '&.Mui-focused fieldset': { borderColor: 'var(--neon-cyan)', boxShadow: '0 0 10px var(--neon-cyan-faded)' },
                                }
                            }}
                        />
                    )}
                    <TextField
                        fullWidth label="Şifre" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} required
                        InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#fff', bgcolor: 'rgba(0,0,0,0.3)', borderRadius: '12px',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                '&:hover fieldset': { borderColor: 'var(--neon-cyan-faded)' },
                                '&.Mui-focused fieldset': { borderColor: 'var(--neon-cyan)', boxShadow: '0 0 10px var(--neon-cyan-faded)' },
                            }
                        }}
                    />

                    <Button fullWidth variant="contained" type="submit" 
                        sx={{ 
                            mt: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 800, borderRadius: '12px', 
                            background: isRegister ? 'var(--neon-magenta)' : 'var(--neon-cyan)', 
                            color: '#000', transition: '0.3s',
                            boxShadow: `0 0 20px ${isRegister ? 'var(--neon-magenta-faded)' : 'var(--neon-cyan-faded)'}`,
                            '&:hover': { background: '#fff', boxShadow: `0 0 30px ${isRegister ? 'var(--neon-magenta)' : 'var(--neon-cyan)'}` }
                        }}>
                        {isRegister ? 'Sisteme Kaydol' : 'Giriş Yap'}
                    </Button>

                    <Button fullWidth onClick={() => { setIsRegister(!isRegister); setError(''); setSuccessMsg(''); }} 
                        sx={{ color: 'rgba(255,255,255,0.6)', '&:hover':{ color: '#fff' }, textTransform: 'none', mt: 1 }}>
                        {isRegister ? 'Zaten hesabın var mı? Giriş Ekranına Dön' : 'Hesabın yok mu? Yeni Sistem Kaydı Oluştur'}
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default Login;