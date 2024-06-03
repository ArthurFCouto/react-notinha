import { createTheme } from '@mui/material';
import { cyan } from '@mui/material/colors';

export const DarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff',
            dark: '#ffffff85',
            light: '#ffffff60',
            contrastText: '#ffffff',
        },
        secondary: {
            main: cyan[500],
            dark: cyan[400],
            light: cyan[300],
            contrastText: '#121212',
        },
        background: {
            paper: '#313131',
            default: '#212121',
        },
    },
    typography: {
        allVariants: {
            color: 'white',
        },
        fontFamily: [
            '"lato"',
            '"Montserrat"',
            '"Helvetica Neue"',
            '"-apple-system"',
            'sans-serif',
        ].join(','),
    }
});