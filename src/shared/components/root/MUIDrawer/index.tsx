import { AccountBox } from '@mui/icons-material';
import {
    Box, Button, Divider, Drawer,
    MenuItem, Typography, useTheme
} from '@mui/material';
import { useRouter } from 'next/navigation';

interface MUIDrawerProps {
    open: boolean,
    onClose: () => void
}

export default function MUIDrawer({ open, onClose }: MUIDrawerProps) {
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
                    onClick={() => router.push('/home')}
                    sx={{ paddingY: 1.5 }}
                >
                    <Typography variant='body1' color='text.primary'>
                        Buscar
                    </Typography>
                </MenuItem>
                <Divider />
                <MenuItem>
                    <Button
                        color='primary'
                        disabled
                        variant='contained'
                        sx={{ width: '100%' }}
                    >
                        Cadastrar
                    </Button>
                </MenuItem>
                <MenuItem>
                    <Button
                        color='primary'
                        disabled
                        endIcon={<AccountBox />}
                        variant='outlined'
                        sx={{ width: '100%' }}
                    >
                        Login
                    </Button>
                </MenuItem>
            </Box>
        </Drawer>
    )
};