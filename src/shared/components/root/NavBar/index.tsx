'use client';

import { useState } from 'react';
import {
    AppBar, Button, Box, MenuItem,
    Toolbar, Typography, useTheme,
    IconButton
} from '@mui/material';
import { AccountBox, Menu } from '@mui/icons-material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MUIDrawer from '../MUIDrawer';

export default function NavBar() {
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const toggleDrawer = () => setOpenDrawer((prev) => !prev);
    const router = useRouter();

    return (
        <AppBar
            color='primary'
            position='fixed'
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                height: theme.spacing(11),
                marginTop: 2,
            }}
        >
            <Box
                marginX='auto'
                maxWidth='lg'
                paddingX={1.5}
                width='100%'
            >
                <Toolbar
                    variant='regular'
                    sx={(theme) => ({
                        alignItems: 'center',
                        display: 'flex',
                        backdropFilter: 'blur(24px)',
                        bgcolor: theme.palette.background.paper,
                        borderRadius: '100px',
                        boxShadow: theme.palette.mode === 'light'
                            ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                            : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                        justifyContent: 'space-between',
                    })}
                >
                    <Box
                        alignItems='center'
                        display='flex'
                        flexGrow={1}
                        gap={2}
                        paddingX={0}
                    >
                        <Image
                            alt='Notinha'
                            src='/logo-name.png'
                            height={50}
                            width={130}
                        />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }} gap={1}>
                            <MenuItem
                                onClick={() => router.push('/home')}
                                sx={{
                                    paddingY: 0.75,
                                    paddingX: 1.5
                                }}
                            >
                                <Typography variant='body1' color='text.primary'>
                                    Buscar
                                </Typography>
                            </MenuItem>
                        </Box>
                    </Box>
                    <Box
                        alignItems='center'
                        gap={1}
                        sx={{ display: { xs: 'none', md: 'flex' } }}
                    >
                        <Button
                            color='primary'
                            disabled
                            size='medium'
                            variant='text'
                        >
                            Cadastrar
                        </Button>
                        <Button
                            color='primary'
                            disabled
                            endIcon={<AccountBox />}
                            size='medium'
                            sx={{ borderRadius: '50px' }}
                            variant='contained'
                        >
                            Login
                        </Button>
                    </Box>
                    <Box sx={{ display: { md: 'none' } }}>
                        <IconButton color='primary' onClick={toggleDrawer} size='medium'>
                            <Menu />
                        </IconButton>
                        <MUIDrawer open={openDrawer} onClose={toggleDrawer} />
                    </Box>
                </Toolbar>
            </Box>
        </AppBar >
    );
};