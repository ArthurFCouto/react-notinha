import { createTheme } from '@mui/material/styles';

const LightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#fefeee',
          },
        primary: {
            main: '#01c117',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#fff110',
        },
        /*
        background: {
            default: '#EFEFEF',
            paper: '#FEFEFE',
        },
        primary: {
            main: '#44040b',
            light: '#69363B',
            dark: '#2F0207',
            contrastText: '#EFEFEF'
        },
        secondary: {
            main: '#CB1228',
            light: '#D54153',
            dark: '#8E0C1C',
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

export default LightTheme;