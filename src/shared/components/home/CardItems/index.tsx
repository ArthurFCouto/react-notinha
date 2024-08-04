import { History } from '@mui/icons-material';
import {
    Box, Card, CardActionArea, CardActions, CardContent, Divider, Fade, Grid, IconButton, List,
    ListItem, ListItemAvatar,
    ListItemText, Paper, Skeleton, Stack, Tooltip, Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { Price } from '@/shared/service/firebase';
import { BRCurrencyFormat } from '@/shared/util';

const monts = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

interface CardItemsProps {
    items: Price[],
    clickOnHistory: (query: string) => void,
}

export default function CardItems({ items, clickOnHistory }: CardItemsProps) {
    const transitionValue = (value: number) => value > 20 ? '1000ms' : `${value * 50}ms`;
    const theme = useTheme();
    const mdDownScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Grid container>
            {
                items.map((item: Price, index: number) => (
                    <Grid
                        item
                        key={item.id}
                        md={4}
                        padding={0.5}
                        sm={6}
                        xs={12}
                    >
                        <Fade in style={{ transitionDelay: transitionValue(index) }} >
                            <Card>
                                <CardActionArea>
                                    <CardContent >
                                        <Stack
                                            flexDirection='row'
                                            gap={1}
                                            justifyContent='space-between'
                                            width='100%'
                                        >
                                            <Tooltip arrow title={item.produto}>
                                                <Box overflow='hidden'>
                                                    <Typography
                                                        component='div'
                                                        fontWeight={500}
                                                        noWrap
                                                        overflow='hidden'
                                                        textOverflow='ellipsis'
                                                        textTransform='capitalize'
                                                        variant={mdDownScreen ? 'h6' : 'h5'}
                                                    >
                                                        {item.produto.toLowerCase()}
                                                    </Typography>
                                                    <Typography
                                                        color='text.secondary'
                                                        gutterBottom
                                                        variant={mdDownScreen ? 'caption' : 'body2'}
                                                    >
                                                        Unidade de medida <strong>{item.unidadeMedida}</strong>
                                                    </Typography>
                                                    <Typography
                                                        color='primary.dark'
                                                        component='div'
                                                        fontWeight={500}
                                                        gutterBottom
                                                        variant={mdDownScreen ? 'body2' : 'body1'}
                                                    >
                                                        {item.mercado}
                                                    </Typography>
                                                </Box>
                                            </Tooltip>
                                            <Tooltip title='Data do preço mais recente'>
                                                <Box
                                                    alignItems='center'
                                                    bgcolor={(theme) => theme.palette.divider}
                                                    borderRadius={2}
                                                    component={Paper}
                                                    display='flex'
                                                    justifyContent='center'
                                                    marginBottom='auto'
                                                    paddingX={1.5}
                                                    paddingY={0.5}
                                                >
                                                    <Typography
                                                        fontWeight={500}
                                                        textAlign='center'
                                                        variant='button'
                                                    >
                                                        {item.data.slice(0, 2)}
                                                        <br />
                                                        {monts[parseInt(item.data.slice(3, 5)) - 1]}
                                                    </Typography>
                                                </Box>
                                            </Tooltip>
                                        </Stack>
                                    </CardContent>
                                </CardActionArea>
                                <Divider orientation='horizontal' />
                                <CardActions>
                                    <Stack
                                        alignItems='center'
                                        flexDirection='row'
                                        gap={1}
                                        justifyContent='space-between'
                                        paddingLeft={1}
                                        width='100%'
                                    >
                                        <Typography
                                            color='text.primary'
                                            component='div'
                                            fontWeight={500}
                                            letterSpacing={1}
                                            variant={mdDownScreen ? 'h6' : 'h5'}
                                        >
                                            {BRCurrencyFormat(parseFloat(item.valor))}
                                        </Typography>
                                        <IconButton onClick={() => clickOnHistory(item.produto)}>
                                            <History color='primary' fontSize='inherit' />
                                        </IconButton>
                                    </Stack>
                                </CardActions>
                            </Card>
                        </Fade>
                    </Grid>
                ))
            }
        </Grid>
    );
};

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
};