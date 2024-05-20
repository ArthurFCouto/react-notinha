import Link from 'next/link';
import { Box, Container, Link as MUILink, Typography } from '@mui/material';

export default function Footer() {
    const Copyright = () => (
        <Typography variant='body2' color='text.secondary'>
            {'Copyright © '}
            <MUILink component={Link} color='inherit' href='https://instagram.com/arthur_fcouto'>
                ArthurFCouto
            </MUILink>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );

    return (
        <Box
            component='footer'
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        >
            <Container maxWidth='xl'>
                <Copyright />
            </Container>
        </Box>
    )
}