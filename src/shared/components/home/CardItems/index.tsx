import { Timeline } from '@mui/icons-material';
import {
    Avatar, Divider, IconButton, List,
    ListItem, ListItemAvatar, ListItemIcon,
    ListItemText, Skeleton, Typography
} from '@mui/material';
import { Price } from '@/shared/service/firebase';
import { BRCurrencyFormat } from '@/shared/util';

interface CardItemsProps {
    items: Price[],
    clickOnHistory: (query: string) => void,
}

export default function CardItems({ items, clickOnHistory }: CardItemsProps) {
    return (
        <List sx={{ width: '100%' }}>
            {
                items.map((item, index) => (
                    <div key={item.id}>
                        <ListItem alignItems='flex-start'>
                            <ListItemAvatar color='primary'>
                                <Avatar>
                                    {item.unidadeMedida.slice(0, 2)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.produto}
                                secondary={
                                    <>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component='span'
                                            variant='body2'
                                            color='text.primary'
                                        >
                                            {`${BRCurrencyFormat(parseFloat(item.valor))} no ${item.mercado} `}
                                        </Typography>
                                        {item.data}
                                    </>
                                }
                            />
                            <ListItemIcon>
                                <IconButton onClick={() => clickOnHistory(item.produto)}>
                                    <Timeline color='primary' fontSize='inherit' />
                                </IconButton>
                            </ListItemIcon>
                        </ListItem>
                        {
                            index < items.length - 1 && <Divider variant='inset' component='li' />
                        }
                    </div>
                ))
            }
        </List>
    )
}

const createNumbersArray = (amount: number) => {
    const array = [];
    for (let i = 0; i < amount; i++)
        array.push(i);
    return array;
}

export function CardItemsLoading({ amount }: Readonly<{ amount: number }>) {

    const LoadingSkeleton = () => (
        <ListItem alignItems='flex-start'>
            <ListItemAvatar color='primary'>
                <Skeleton
                    variant='circular'
                    width={40}
                    height={40}
                    animation='wave'
                />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Skeleton
                        animation='wave'
                        sx={{ fontSize: '1rem' }}
                        variant='text'
                    />
                }
                secondary={
                    <Skeleton
                        animation='wave'
                        variant='rectangular'
                    />
                }
            />
        </ListItem>
    )
    return (
        <List sx={{ width: '100%' }}>
            {
                createNumbersArray(amount).map((index) => <LoadingSkeleton key={index} />)
            }
        </List>
    )
}                        