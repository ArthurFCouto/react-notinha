import { createTheme } from '@mui/material';

const LightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#ebebeb',
            paper: '#ffffff'
        },
    },
    typography: {
        fontFamily: '"Montserrat", "Poppins", sans-serif',
        fontSize: 12,
        htmlFontSize: 12,
    },
});

export default LightTheme;