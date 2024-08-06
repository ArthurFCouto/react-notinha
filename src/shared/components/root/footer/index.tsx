import {
    Box, Divider, IconButton,
    Link, Stack, Tooltip, Typography
} from '@mui/material';
import { GitHub, LinkedIn, WhatsApp } from '@mui/icons-material';

export default function Footer() {
    const Copyright = () => (
        <Typography variant='body1'>
            {'Copyright © '}
            <Tooltip title='Conheça meu IG'>
                <Link color='inherit' href='https://instagram.com/arthur_fcouto' target='_blank'>
                    arthur_fcouto
                </Link>
            </Tooltip>
            {` ${new Date().getFullYear()}.`}
        </Typography>
    );

    const SocialMedia = () => (
        <Stack
            flexDirection='row'
            gap={1}
            justifyContent='center'
            width='100%'
        >
            <Tooltip title='Meu GitHub'>
                <IconButton color='primary' href='https://github.com/ArthurFCouto' size='medium' target='_blank'>
                    <GitHub />
                </IconButton>
            </Tooltip>
            <Tooltip title='Meu linkedIn'>
                <IconButton color='primary' href='https://www.linkedin.com/in/arthur-couto-b8181743/' size='medium' target='_blank'>
                    <LinkedIn />
                </IconButton>
            </Tooltip>
            <Tooltip title='Meu Whatsapp'>
                <IconButton color='primary' href='https://wa.me/5538999414205?text=Ol%C3%A1!%20Vim%20pelo%20Notinha!' size='medium' target='_blank'>
                    <WhatsApp />
                </IconButton>
            </Tooltip>
        </Stack>
    );

    return (
        <Box
            bgcolor={(theme) => theme.palette.background.paper}
            boxShadow='0px 10px 10px 5px #000'
            component='footer'
            marginTop='auto'
            paddingY={2}
            width='100%'
        >
            <Stack direction='column' marginX='auto' maxWidth='xl' paddingX={2}>
                <Copyright />
                <Divider orientation='horizontal' sx={{ marginBottom: 1, marginTop: 2 }} />
                <SocialMedia />
            </Stack>
        </Box>
    );
};