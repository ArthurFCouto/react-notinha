import { useEffect, useState } from 'react';
import { Fab, Fade } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

export default function ButtonGoToTop() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleShowToTopButton = () => setShowButton(window.scrollY > window.innerHeight);
        window.addEventListener('scroll', handleShowToTopButton);
        return () => {
            window.removeEventListener('scroll', handleShowToTopButton);
        }
    }, []);

    return (
        <Fade in={showButton}>
            <Fab
                color='primary'
                sx={{
                    position: 'fixed',
                    bottom: 15,
                    right: 15
                }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <KeyboardArrowUp />
            </Fab>
        </Fade>
    )
};