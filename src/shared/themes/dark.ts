import { createTheme } from '@mui/material';

const DarkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#303030',
            paper: '#010101',
        },
    },
    typography: {
        fontFamily: '"Montserrat", "Raleway", "Poppins", sans-serif',
        fontSize: 12,
    },
});

export default DarkTheme;