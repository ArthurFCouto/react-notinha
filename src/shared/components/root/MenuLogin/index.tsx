import { useState } from 'react';
import {
    Box, Divider, IconButton, ListItemIcon,
    ListItemText, Menu, MenuItem, Tooltip
} from '@mui/material';
import {
    AccountBox, AccountCircle, Logout,
    PersonAdd, Settings
} from '@mui/icons-material';

export default function MenuLogin() {
    const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorMenu);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorMenu(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorMenu(null);
    };

    return (
        <>
            <Box
                alignItems='center'
                display='flex'
                textAlign='center'
            >
                <Tooltip title='Acesso a conta'>
                    <IconButton onClick={handleClick} size='large'>
                        <AccountCircle />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorMenu}
                id='account-menu'
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem disabled onClick={handleClose}>
                    <ListItemIcon>
                        <AccountBox />
                    </ListItemIcon>
                    <ListItemText>
                        Acessar Conta
                    </ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <PersonAdd fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>
                        Criar Conta
                    </ListItemText>
                </MenuItem>
                <MenuItem disabled onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>
                        Configurações
                    </ListItemText>
                </MenuItem>
                <MenuItem disabled onClick={handleClose}>
                    <ListItemIcon>
                        <Logout fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>
                        Sair
                    </ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};