import { AccountBox, DarkMode, LightMode, PersonAddAlt1 } from '@mui/icons-material';
import {
    Box, Button, ButtonGroup, Checkbox, Divider, Drawer,
    IconButton,
    MenuItem, Typography, useTheme
} from '@mui/material';
import { useRouter } from 'next/navigation';

interface MUIDrawerProps {
    open: boolean,
    onClose: () => void,
    contextTheme: 'light' | 'dark',
    toggleTheme: () => void
}

export default function MUIDrawer({ open, onClose, contextTheme, toggleTheme }: MUIDrawerProps) {
    const theme = useTheme();
    const router = useRouter();

    return (
        <Drawer anchor='right' open={open} onClose={onClose}>
            <Box
                bgcolor={theme.palette.background.paper}
                flexGrow={1}
                minWidth='60dvw'
                paddingY={1}
            >
                <MenuItem
                    sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', paddingY: 1.5 }}
                >
                    <ButtonGroup>
                        <IconButton
                            color='primary'
                            disabled
                            size='medium'
                            sx={{ marginRight: 1.5 }}
                        >
                            <PersonAddAlt1 />
                        </IconButton>
                        <Button
                            color='primary'
                            disabled
                            endIcon={<AccountBox />}
                            size='medium'
                            sx={{ marginRight: 1.5 }}
                            variant='outlined'
                        >
                            Login
                        </Button>
                    </ButtonGroup>
                    <Checkbox
                        checked={contextTheme === 'dark'}
                        checkedIcon={<DarkMode />}
                        icon={<LightMode />}
                        onChange={toggleTheme}
                        size='medium'
                    />
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => router.push('/home')}
                    sx={{ paddingY: 1.5 }}
                >
                    <Typography variant='body1' color='text.primary'>
                        Buscar
                    </Typography>
                </MenuItem>
            </Box>
        </Drawer>
    )
};