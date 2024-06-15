'use client';

import * as React from 'react';
import {
    AppBar, Button, Box, Container,
    Divider, Drawer, MenuItem, Toolbar, Typography,
    useTheme
} from '@mui/material';
import { AccountBox, HistoryEdu, Menu } from '@mui/icons-material';

export default function NavBar() {
    const [open, setOpen] = React.useState(false);
    //const router = useRouter();
    const theme = useTheme();

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <AppBar
            position='fixed'
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                marginTop: 2,
            }}
        >
            <Container maxWidth='lg'>
                <Toolbar
                    variant='regular'
                    sx={(theme) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexShrink: 0,
                        borderRadius: '999px',
                        bgcolor: theme.palette.background.paper,
                        backdropFilter: 'blur(24px)',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow:
                            theme.palette.mode === 'light'
                                ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                                : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                    })}
                >
                    <Box
                        alignItems='center'
                        display='flex'
                        flexGrow={1}
                        paddingX={0}
                    >
                        <Typography
                            variant='h4'
                            color='text.primary'
                            gutterBottom
                            sx={{
                                alignItems: 'center',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'start'
                            }}
                        >
                            <HistoryEdu fontSize='inherit' />
                            Notinha
                        </Typography>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <MenuItem
                                //onClick={() => router.push('/home')}
                                sx={{ marginLeft: 1, py: 0.75, px: 1.5 }}
                            >
                                <Typography variant='body2' color='text.primary'>
                                    Buscar
                                </Typography>
                            </MenuItem>
                        </Box>
                    </Box>
                    <Box
                        alignItems='center'
                        gap={1}
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                        }}
                    >
                        <Button
                            color='primary'
                            size='small'
                            variant='text'
                        >
                            Cadastrar
                        </Button>
                        <Button
                            color='primary'
                            endIcon={<AccountBox />}
                            size='small'
                            variant='contained'
                        >
                            Login
                        </Button>
                    </Box>
                    <Box sx={{ display: { sm: '', md: 'none' } }}>
                        <Button
                            variant='text'
                            color='primary'
                            aria-label='menu'
                            onClick={toggleDrawer(true)}
                        >
                            <Menu />
                        </Button>
                        <Drawer anchor='right' open={open} onClose={toggleDrawer(false)}>
                            <Box
                                bgcolor={theme.palette.background.paper}
                                flexGrow={1}
                                minWidth='60dvw'
                                padding={0.25}
                            >
                                <MenuItem >
                                    Buscar
                                </MenuItem>
                                <Divider />
                                <MenuItem>
                                    <Button
                                        color='primary'
                                        variant='contained'
                                        sx={{ width: '100%' }}
                                    >
                                        Cadastrar
                                    </Button>
                                </MenuItem>
                                <MenuItem>
                                    <Button
                                        color='primary'
                                        endIcon={<AccountBox />}
                                        variant='outlined'
                                        sx={{ width: '100%' }}
                                    >
                                        Login
                                    </Button>
                                </MenuItem>
                            </Box>
                        </Drawer>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar >
    );
}