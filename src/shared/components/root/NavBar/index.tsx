'use client';

import { useState } from 'react';
import {
    AppBar, Button, Box, Checkbox,
    IconButton, Link as MUILink, MenuItem,
    Toolbar, Typography, useTheme,
    useMediaQuery
} from '@mui/material';
import { AccountBox, DarkMode, LightMode, Menu } from '@mui/icons-material';
import Image from 'next/image';
import MUIDrawer from '../MUIDrawer';
import { useAppThemeContext } from '@/shared/context/themeContext';
import Link from 'next/link';

export default function NavBar() {
    const { themeName, toggleTheme } = useAppThemeContext();
    const theme = useTheme();
    const mdDownScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [openDrawer, setOpenDrawer] = useState(false);
    const toggleDrawer = () => setOpenDrawer((prev) => !prev);
    const linkColor = themeName === 'dark' ? 'text.primary' : 'primary.contrastText'

    return (
        <AppBar
            color='primary'
            position='fixed'
            sx={{
                bgcolor: theme.palette.primary.main,
                backgroundImage: 'none',
                height: mdDownScreen ? theme.spacing(9) : theme.spacing(12),
            }}
        >
            <Box
                height='100%'
                marginX='auto'
                maxWidth='xl'
                width='100%'
            >
                <Toolbar
                    variant='regular'
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        height: '100%',
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
                                    <Typography color={linkColor} fontWeight={600} variant='body1'>
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
                            checkedIcon={<LightMode color='action' />}
                            icon={<DarkMode color='action' />}
                            onChange={toggleTheme}
                            size='medium'
                        />
                        <Button
                            color='secondary'
                            disabled
                            size='large'
                            variant='outlined'
                            sx={{
                                borderRadius: '50px'
                            }}
                        >
                            Cadastrar
                        </Button>
                        <Button
                            color='secondary'
                            disabled
                            endIcon={<AccountBox />}
                            size='large'
                            sx={{ borderRadius: '50px' }}
                            variant='contained'
                        >
                            Login
                        </Button>
                    </Box>
                    <Box sx={{ display: { md: 'none' } }}>
                        <IconButton onClick={toggleDrawer} size='large'>
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