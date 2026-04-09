import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Typography, Box } from '@mui/material';

const Logout = () => {
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        logout();
    }, [logout]);

    return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">Güvenli bir şekilde çıkış yapılıyor, lütfen bekleyin...</Typography>
        </Box>
    );
};

export default Logout;