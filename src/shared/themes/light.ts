import { createTheme } from '@mui/material';

const LightTheme = createTheme({
    palette: {
        mode: 'light',
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

export default LightTheme;