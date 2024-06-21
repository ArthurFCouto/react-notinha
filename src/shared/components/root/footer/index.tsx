import Link from 'next/link';
import {
    Box, Container, Divider, IconButton,
    Link as MUILink, Stack, Typography
} from '@mui/material';
import { GitHub, LinkedIn, WhatsApp } from '@mui/icons-material';

export default function Footer() {
    const Copyright = () => (
        <Typography variant='body1' >
            {'Copyright © '}
            <MUILink
                color='inherit'
                component={Link}
                href='https://instagram.com/arthur_fcouto'
                title='Conheça meu IG'
            >
                arthur_fcouto
            </MUILink>
            {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );

    const SocialMedia = () => (
        <Stack
            flexDirection='row'
            gap={1}
            justifyContent='end'
            width='100%'
        >
            <IconButton href='https://github.com/ArthurFCouto' size='small' target='_blank'>
                <GitHub />
            </IconButton>
            <IconButton href='https://www.linkedin.com/in/arthur-couto-b8181743/' size='small' target='_blank'>
                <LinkedIn />
            </IconButton>
            <IconButton href='https://wa.me/5538999414205?text=Ol%C3%A1!%20Vim%20pelo%20Notinha!' size='small' target='_blank'>
                <WhatsApp />
            </IconButton>
        </Stack>
    );

    return (
        <Box
            bgcolor={(theme) => theme.palette.background.paper}
            component='footer'
            marginTop='auto'
            paddingY={2}
            paddingX={2}
            width='100%'
        >
            <Container maxWidth='lg'>
                <Copyright />
                <Divider orientation='horizontal' sx={{ marginBottom: 1, marginTop: 2 }} />
                <SocialMedia />
            </Container>
        </Box>
    );
};