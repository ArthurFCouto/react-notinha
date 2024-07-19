import { createTheme } from '@mui/material/styles';

const LightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#EFEFEF',
          },
        primary: {
            main: '#01C117',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#FFF110',
        },
    },
    typography: {
        fontFamily: '"Montserrat", "Raleway", "Poppins", "Roboto", sans-serif',
        fontSize: 12,
    },
});

export default LightTheme;
