import Link from 'next/link';
import { Box, BoxProps, Container, Link as MUILink, Typography } from '@mui/material';

export default function Footer(props: BoxProps) {
    const Copyright = () => (
        <Typography variant='body1' >
            {'Copyright © '}
            <MUILink
            color='inherit'
            component={Link}
            href='https://instagram.com/arthur_fcouto'
            title='Conheça meu IG'
            >
                arthur_fCouto
            </MUILink>
            {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );

    return (
        <Box
            bgcolor={(theme) => theme.palette.background.paper}
            component='footer'
            marginTop='auto'
            paddingY={3}
            paddingX={2}
            width='100%'
            {...props}
        >
            <Container maxWidth='lg'>
                <Copyright />
            </Container>
        </Box>
    )
}