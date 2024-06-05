import { createTheme } from '@mui/material';

const DarkTheme = createTheme({
    typography: {
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