import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Button,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const TrailerDialog = ({ open, onClose, videos = [], mediaTitle = '' }) => {
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

    const activeVideo = videos[selectedVideoIndex] || videos[0];

    const handleClose = () => {
        setSelectedVideoIndex(0);
        onClose();
    };

    if (!videos || videos.length === 0) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'rgba(13, 17, 23, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--neon-cyan)',
                    borderRadius: '24px',
                    boxShadow: '0 0 40px rgba(0, 255, 255, 0.25)',
                    color: '#fff',
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                p: 2.5
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        p: 1,
                        borderRadius: '10px',
                        background: 'rgba(255, 0, 127, 0.15)',
                        border: '1px solid var(--neon-magenta)',
                        color: 'var(--neon-magenta)',
                        display: 'flex'
                    }}>
                        <PlayArrowIcon />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                            {mediaTitle} - Fragman & Teaser
                        </Typography>
                        {activeVideo?.name && (
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                {activeVideo.name}
                            </Typography>
                        )}
                    </Box>
                </Box>
                <IconButton onClick={handleClose} sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#fff' } }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, bgcolor: '#000' }}>
                {/* 16:9 Video Player */}
                <Box sx={{ position: 'relative', width: '100%', pt: '56.25%' }}>
                    {activeVideo ? (
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${activeVideo.key}?autoplay=1&rel=0&modestbranding=1`}
                            title={activeVideo.name || mediaTitle}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                        />
                    ) : (
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'rgba(255, 255, 255, 0.5)'
                        }}>
                            Oynatılacak video bulunamadı.
                        </Box>
                    )}
                </Box>

                {/* Multiple Video Selection & External Link Bar */}
                <Box sx={{
                    p: 2,
                    bgcolor: 'rgba(13, 17, 23, 0.95)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5
                }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                        {videos.length > 1 && (
                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', mr: 0.5 }}>
                                Videolar:
                            </Typography>
                        )}
                        {videos.slice(0, 4).map((v, index) => (
                            <Chip
                                key={v.id || index}
                                label={v.type === 'Trailer' ? `Fragman ${index + 1}` : v.type || `Video ${index + 1}`}
                                onClick={() => setSelectedVideoIndex(index)}
                                sx={{
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    bgcolor: selectedVideoIndex === index ? 'var(--neon-magenta)' : 'rgba(255, 255, 255, 0.08)',
                                    color: selectedVideoIndex === index ? '#fff' : 'rgba(255, 255, 255, 0.8)',
                                    border: selectedVideoIndex === index ? '1px solid var(--neon-magenta)' : '1px solid rgba(255, 255, 255, 0.15)',
                                    boxShadow: selectedVideoIndex === index ? '0 0 10px var(--neon-magenta-faded)' : 'none',
                                    '&:hover': {
                                        bgcolor: selectedVideoIndex === index ? 'var(--neon-magenta)' : 'rgba(255, 255, 255, 0.15)'
                                    }
                                }}
                            />
                        ))}
                    </Box>

                    {activeVideo && (
                        <Button
                            href={`https://www.youtube.com/watch?v=${activeVideo.key}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            endIcon={<OpenInNewIcon sx={{ fontSize: '1rem' }} />}
                            sx={{
                                color: 'var(--neon-cyan)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                textTransform: 'none',
                                '&:hover': { color: '#fff', textDecoration: 'underline' }
                            }}
                        >
                            YouTube'da Aç
                        </Button>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default TrailerDialog;
