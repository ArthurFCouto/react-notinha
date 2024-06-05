import { createTheme } from '@mui/material';

const LightTheme = createTheme({
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

export default LightTheme;