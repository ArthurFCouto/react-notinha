import { DarkMode, LightMode } from '@mui/icons-material';
import {
    Box, Checkbox, Divider, Drawer,
    MenuItem, Typography, useTheme
} from '@mui/material';
import { useRouter } from 'next/navigation';
import MenuLogin from '../MenuLogin';

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
        <Drawer
            anchor='right'
            open={open}
            onClose={onClose}
        >
            <Box
                bgcolor={theme.palette.background.paper}
                flexGrow={1}
                minWidth='60dvw'
                paddingY={1}
            >
                <MenuItem
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingY: 1.5
                    }}
                >
                    <MenuLogin />
                    <Checkbox
                        checked={contextTheme === 'dark'}
                        checkedIcon={<LightMode />}
                        icon={<DarkMode />}
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
    );
};