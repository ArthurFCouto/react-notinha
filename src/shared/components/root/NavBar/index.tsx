'use client';

import { useState } from 'react';
import {
    AppBar, Button, Box, Checkbox,
    IconButton, Link as MUILink, MenuItem,
    Toolbar, Typography, useTheme
} from '@mui/material';
import { AccountBox, DarkMode, LightMode, Menu } from '@mui/icons-material';
import Image from 'next/image';
import MUIDrawer from '../MUIDrawer';
import { useAppThemeContext } from '@/shared/context/themeContext';
import Link from 'next/link';

export default function NavBar() {
    const { themeName, toggleTheme } = useAppThemeContext();
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = useState(false);
    const toggleDrawer = () => setOpenDrawer((prev) => !prev);

    return (
        <AppBar
            color='primary'
            position='fixed'
            sx={{
                bgcolor: theme.palette.primary.main,
                backgroundImage: 'none',
                height: theme.spacing(12),
                paddingTop: 2
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
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box
                        alignItems='center'
                        display='flex'
                        flexGrow={1}
                        gap={2}
                    >
                        <MUILink component={Link} href='/' underline='none'>
                            <Image
                                alt='Notinha logo'
                                src='/logo-name.png'
                                height={50}
                                width={130}
                            />
                        </MUILink>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }} gap={1}>
                            <MenuItem
                                sx={{
                                    paddingY: 0.75,
                                    paddingX: 1.5
                                }}
                            >
                                <MUILink component={Link} href='/home' underline='none'>
                                    <Typography color='text.primary' fontWeight={600} variant='body1'>
                                        Buscar
                                    </Typography>
                                </MUILink>
                            </MenuItem>
                        </Box>
                    </Box>
                    <Box
                        alignItems='center'
                        gap={1}
                        sx={{ display: { xs: 'none', md: 'flex' } }}
                    >
                        <Checkbox
                            checked={themeName === 'dark'}
                            checkedIcon={<LightMode />}
                            icon={<DarkMode />}
                            onChange={toggleTheme}
                            size='medium'
                        />
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
                        <IconButton onClick={toggleDrawer} size='medium'>
                            <Menu />
                        </IconButton>
                        <MUIDrawer
                            open={openDrawer}
                            onClose={toggleDrawer}
                            contextTheme={themeName}
                            toggleTheme={toggleTheme}
                        />
                    </Box>
                </Toolbar>
            </Box>
        </AppBar >
    );
};