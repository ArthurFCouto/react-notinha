import { createTheme } from '@mui/material';

export const DarkTheme = createTheme({
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