import { createTheme } from '@mui/material/styles';

const DarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#01C117',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#FFF110',
        },
        /*
        background: {
            default: '#EFEFEF',
            paper: '#FEFEFE',
        },
        primary: {
            main: '#222831',
            light: '#4E535A',
            dark: '#171C22',
            contrastText: '#EFEFEF'
        },
        secondary: {
            main: '#FD7014',
            light: '#FD8C43',
            dark: '#B14E0E',
            contrastText: '#EFEFEF'
        },
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
            disabled: 'rgba(0, 0, 0, 0.38)',
        }
        */
    },
    typography: {
        fontFamily: '"Montserrat", "Raleway", "Poppins", "Roboto", sans-serif',
        fontSize: 12,
    },
});

export default DarkTheme;
