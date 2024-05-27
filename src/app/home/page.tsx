'use client';

import { useEffect, useRef, useState } from 'react';
import {
    Avatar, Box, Button, Container,
    Divider, Fab, IconButton, InputBase, List, ListItem,
    ListItemAvatar, ListItemText, Paper, Stack, Typography,
} from '@mui/material';
import {
    Assignment, Clear, FilterList, North,
    QrCode, Refresh, Update
} from '@mui/icons-material';
import { Player } from '@lottiefiles/react-lottie-player';
import { addTaxReceipet, getPrices, getUrlInvoice } from '@/shared/Server/Actions/actions';
import { Precos } from '@/shared/service/firebase';
import ModalQrReader from '@/shared/components/home/ModalQrReader';
import lottieLoading from '@/shared/assets/loading-2.json';
import { BRCurrencyFormat } from '@/shared/util';
import Footer from '@/shared/components/footer';

const listUrl = [
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650060002663641256820902|2|1|1|e36cdc053b3b2922eb81e63e4cb09cd09271cc20"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240525834847003541651390000306311070547663|2|1|1|08C2604D2B0E01D3FF09FA64FFC912CC748E8EA2"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000955431663696391|2|1|1|00353286E1AEE9BB65C84DE432092258BF70C731"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650120001114521284740434|2|1|1|DE4DA9F317839064ECA4A9A32088B29BE785B738"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240521560153000163650050000801851159654559|2|1|1|20F18AF9BB929CD9914C234316947B9E44881EF1"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240525834847003541651370000382361689932910|2|1|1|2346EBEC1A1DDA94A3E0E80AA7938AA575CC2BC5"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650040003217001204755066|2|1|1|8268d27ac527d60de354e822d3847ca9fcff9003"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240525834847003541651400000379449794945270|2|1|07|22.30|72667348416f72526e686a6d544d6a6a4738394d4e3941715831513d|1|62C51E0EB0D6205A7D524A1013A044AE0319EAD8"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650040003219851173286530|2|1|1|c937ca6279518f6c5c3bc740057d0fbafdd3b69f"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000966041470583716|2|1|1|E96DF0CFCC91AE293E899ACFF9635668CF0C4195"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000967941046630543|2|1|1|853946743B3D264F5E13D86221D8D7A9F300568F"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650040003235861149757654|2|1|1|d1ca47d639972e28bf31aafb6b44aa1948a25d48"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650050002323961314056040|2|1|1|c15787504709afc38186411d90e9c315316f3629"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240521560153000163650060000582621605814762|2|1|1|53664AD48423AF39DE4194F05FB276C29241BC26"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000983061066016896|2|1|1|7E59E1356AE8B34F443147CC757EA3AE7697A24B"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650170001244411356947809|2|1|1|127E688BDF4DE5FC0BBDD3A35E5D5087A58BBFB1"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240525834847003541651370000395789259961120|2|1|18|14.64|714a78454253314162383557564a6d585a6f662b772f37415346343d|1|AAD86681779F6959C09C536F1A8EFB42BC3DDEB8"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240402274225000161650060002641121203294580|2|1|1|1db0595783faa2997d7535cdfb49ffb681a50dda"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240403111258000153650140001028831133159854|2|1|1|9770CECA91303C7A350860AE5ED15386163E268E"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240421560153000163650040001367649023640840|2|1|20|42.19|7047326F753335396D342B66684D663157546369453679664C64633D|1|EC3D7C78FA5A70F6CE73EBCCC676B3BA185DC416"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650050002328981178750190|2|1|1|d6d8b79b04a8ba3fd03f3528c337a8212588e4df"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650050002330161830154782|2|1|1|efb1800cb7652f49756b183ef942dc84124fdc3e"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650060002704471110352034|2|1|1|ec8072fae92d2d3ccb75a1648be257a1e1db5109"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650060002705371244242089|2|1|1|a10bb7bcbb90a2ded9e5d7a9d522c06426397741"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650050002332181109727950|2|1|1|128992ebdda363d1ac35397661c48d2486cccfd8"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650060002706009734690178|2|1|22|40.79|4d6273357141724543624a625476356e4e4e7178706f4c4d3477383d|1|e13f9786e2ab0f7d496e8b14cb487470df9fdb2d"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000995181671654290|2|1|1|C28D63261E1BECB314585CA0DF5E68EB285B1E1D"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650060002710101112100043|2|1|1|0eadc3dc0cb5960900eb19ecd5c89f00e1b6a6d1"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240525834847003541651390000330401450823980|2|1|1|1F5DEA6082549AC830ACADABE677F482D23075C6"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240402274225000161650040003195201165010981|2|1|1|641c767ef4f193bcb2a1e919210842158f832e80"
    },
    {
        "url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240403111258000153650140001043801889016202|2|1|1|5918C21E87DC2BD385AE1013A751146C712B2379"
    }
];

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [lottieRef, setLottieRef] = useState<any>(null);
    const [openQR, setOpenQR] = useState(false);
    const [prices, setPrices] = useState<Precos[]>([]);
    const [pricesConst, setPricesConst] = useState<Precos[]>([]);
    const [showToTopButton, setShowToTopButton] = useState(false);
    const filterRef = useRef<HTMLInputElement>(null);

    const sendUrl = async (url: string) => {
        if (loading) {
            alert('Aguarde e tente mais tarde...');
            return;
        }
        setLoading(true);
        await addTaxReceipet(url)
            .then((response) => {
                alert('Obrigado pelo envio da sua NF. Em breve os novos preços aparecerão abaixo.');
            })
            .catch((error) => {
                alert('Houve um erro ao enviar a NF: ' + error.message);
            })
        setLoading(false);
    };

    const updatePrices = async () => {
        if (loading) return;
        setLoading(true);
        setPrices([]);
        setPricesConst([]);
        await getPrices()
            .then((precos) => {
                if (precos.length === 0)
                    alert('Não há precos cadastrados no momento.');
                else {
                    setPrices(removeRepeated(precos));
                    setPricesConst(removeRepeated(precos));
                }
            })
            .catch((error) => {
                alert(`Tente mais tarde. Erro: ${error}`);
            });
        setLoading(false);
    }

    const removeRepeated = (originalList: Precos[]): Precos[] => {
        if (originalList.length === 0)
            return originalList;
        const map: {
            [key: string]: Precos
        } = {};

        originalList.forEach(preco => {
            const { produto, data, mercado } = preco;
            const key = produto + '_' + mercado;
            if (map[key]) {
                if (new Date(data) > new Date(map[key].data)) {
                    map[key] = preco;
                }
            } else {
                map[key] = preco;
            }
        });
        return Object.values(map);
    }

    const sendInvoices = async () => {
        setLoading(true);
        for (const url of listUrl) {
            await addTaxReceipet(url.url)
                .then(() => {
                    console.log('Url cadastrada', url.url);
                })
                .catch((error) => {
                    console.error('Houve um erro ao enviar a NF: ', error.message);
                })
        }
        setLoading(false);
    }

    const filterList = (value: string) => {
        if (pricesConst.length === 0 || loading) return
        setPrices(pricesConst.filter((price) => (price.mercado.toLowerCase().includes(value.toLowerCase()) || price.produto.toLowerCase().includes(value.toLowerCase()) || price.data.toLowerCase().includes(value.toLowerCase()))));
        setLoading(false);
    }

    const clearFilter = () => {
        setPrices(pricesConst);
        if (filterRef.current !== null)
            filterRef.current.value = '';
    }

    const goToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    useEffect(() => {
        const handleShowToTopButton = () => {
            window.scrollY > window.innerHeight / 2 ? setShowToTopButton(true) : setShowToTopButton(false);
        }
        window.addEventListener('scroll', handleShowToTopButton);

        return () => {
            window.addEventListener('scroll', handleShowToTopButton);
        }
    }, []);

    useEffect(() => {
        if (lottieRef !== null) {
            if (loading)
                lottieRef.play();
            else
                lottieRef.stop();

        }
    }, [loading]);

    return (
        <Box
            display='flex'
            flexDirection='column'
            height='100%'
        >
            <Container component='main' sx={{ mt: 8, mb: 2 }} maxWidth='lg'>
                <Typography variant='h4' gutterBottom>
                    Bem vindo(a) ao nosso sistema ainda sem nome!
                </Typography>
                <Typography variant='h5' gutterBottom>
                    Acompanhe o preço dos produtos de mercado com informações reais e atualizadas.
                </Typography>
                <Typography variant='body1' gutterBottom>
                    Se tem em mãos um cupom fiscal de mercado, baste ler o QRCode dela para atualizarmos nossos preços.
                </Typography>
                <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    paddingY={5}
                    gap={3}
                >
                    <Stack direction='row' gap={2}>
                        <Button endIcon={<QrCode />} onClick={() => setOpenQR(true)} variant='outlined'>Escanear</Button>
                        <Button endIcon={<Refresh />} onClick={updatePrices} variant='contained'>Listar Itens</Button>
                        <Button endIcon={<Update />} onClick={() => sendUrl(listUrl[3].url)} variant='contained'>Testar</Button>
                    </Stack>
                    {/*
                    <IconButton
                        color='primary'
                        sx={{
                            position: 'absolute',
                            top: 15,
                            right: 15,
                            height: 20,
                        }}
                        onClick={sendInvoices}
                    >
                        <Update />
                    </IconButton>
                    */}
                </Box>
                <Player
                    lottieRef={(ref) => { setLottieRef(ref) }}
                    keepLastFrame
                    loop
                    src={lottieLoading}
                    style={{
                        height: 100
                    }}
                />
                <Paper
                    alignItems='center'
                    component={Box}
                    display='flex'
                    marginBottom={0.5}
                    paddingX={0.5}
                    paddingY={1}
                    width='100%'
                >
                    <IconButton>
                        <FilterList />
                    </IconButton>
                    <InputBase
                        inputRef={filterRef}
                        onChange={(e) => filterList(e.target.value)}
                        placeholder='Filtrar esta lista'
                        sx={{ flex: 1 }}
                    />
                    <Divider sx={{ height: '30px' }} orientation='vertical' />
                    <IconButton
                        color='primary'
                        onClick={clearFilter}
                    >
                        <Clear />
                    </IconButton>
                </Paper>
                {
                    (prices.length > 0 && !loading) && (
                        <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
                            {
                                prices.map((price, index) => (
                                    <div key={price.id}>
                                        <ListItem alignItems='flex-start'>
                                            <ListItemAvatar color='primary'>
                                                <Avatar>
                                                    <Assignment />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${price.produto} (${price.unidadeMedida})`}
                                                secondary={
                                                    <>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component='span'
                                                            variant='body2'
                                                            color='text.primary'
                                                        >
                                                            {price.data}
                                                        </Typography>
                                                        {` — ${BRCurrencyFormat(parseFloat(price.valor))} no ${price.mercado}`}
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        {
                                            index < prices.length - 1 && <Divider variant='inset' component='li' />
                                        }
                                    </div>
                                ))
                            }
                        </List>
                    )
                }
            </Container>
            <ModalQrReader
                closeQr={() => setOpenQR(false)}
                getCode={(code) => sendUrl(code)}
                openQr={openQR}
            />
            {
                showToTopButton && (
                    <Fab
                        color='primary'
                        sx={{
                            position: 'fixed',
                            bottom: 15,
                            right: 15
                        }}
                        onClick={goToTop}
                    >
                        <North />
                    </Fab>
                )
            }
            <Footer />
        </Box>
    )
}