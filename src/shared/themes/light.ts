import { createTheme } from '@mui/material';

export const LightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#121212',
            dark: '#12121280',
            light: '#12121250',
            contrastText: '#121212',
        },
        secondary: {
            main: '#333333',
            dark: '#33333380',
            light: '#33333350',
            contrastText: '#ffffff',
        },
        background: {
            paper: '#f5f6f7',
            default: '#ffffff',
        }
    },
    typography: {
        allVariants: {
            color: 'black',
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