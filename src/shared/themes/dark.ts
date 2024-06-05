import { createTheme } from '@mui/material';

const DarkTheme = createTheme({
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

export default DarkTheme;