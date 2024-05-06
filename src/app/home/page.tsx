'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Button, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Link as MUILink, Typography } from '@mui/material';
import { createPrices } from "@/app/actions";
import QrReader from '@/components/home/QrReader';

export default function Home() {
    const [openQR, setOpenQR] = useState(false);

    const handleClick = async (code: string) => await createPrices(code);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <CssBaseline />
            <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="lg">
                <Typography variant="h3" component="h2" gutterBottom>
                    Bem vindo ao Notinha
                </Typography>
                <Typography variant="h5" component="h3" gutterBottom>
                    Descubra o preço dos produtos de mercado com informações reais e atualizadas.
                </Typography>
                <Typography variant="h5" component="h3" gutterBottom>
                    E se você está com aquela notinha do mercado em mãos, baste ler o QRCode dela para atualizarmos nossos preços.
                </Typography>
                <Typography variant="body1">Em breve melhoraremos nosso layout.</Typography>
                <Box display='flex' justifyContent='center' alignItems='center' paddingY={5}>
                    <Button onClick={() => setOpenQR(true)}>Escanear</Button>
                </Box>
            </Container>
            <QrReader
                closeQr={() => setOpenQR(false)}
                getCode={(code) => handleClick(code)}
                openQr={openQR}
            />
            <Box
                component="footer"
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
                <Container maxWidth="xl">
                    <Copyright />
                </Container>
            </Box>
        </Box>
    )
}

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary">
            {'Copyright © '}
            <MUILink component={Link} color="inherit" href="https://instagram.com/arthurfcouto">
                ArthurFCouto
            </MUILink>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}