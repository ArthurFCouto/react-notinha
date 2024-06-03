/* https://medium.com/readytowork-org/implementing-a-qr-code-scanner-in-react-4c8f4e3c6f2e
 * https://www.npmjs.com/package/qr-scanner
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Cameraswitch } from '@mui/icons-material';
import QrScanner from 'qr-scanner';
import { Player } from '@lottiefiles/react-lottie-player';
import lottieLoading from '@/shared/assets/loading-qrCode.json';

interface QrReaderProps {
    getCode: (code: string) => void,
    onError: (message: string) => void,
    openCamera: boolean
}

export default function QrReader({ getCode, onError, openCamera }: QrReaderProps) {
    const [preferredCamera, setPreferredCamera] = useState<'environment' | 'user'>('environment');
    const [startingCamera, setStartingCamera] = useState(true);
    const scanner = useRef<QrScanner>();
    const videoElement = useRef<HTMLVideoElement>(null);

    const onScanSuccess = (result: QrScanner.ScanResult) => {
        getCode(result.data);
        scanner?.current?.stop();
    };

    const handleCameraswitch = () => {
        setPreferredCamera((prev) => prev === 'environment' ? 'user' : 'environment');
        scanner.current?.setCamera(preferredCamera);
    }

    useEffect(() => {
        return () => {
            if (!openCamera) {
                setStartingCamera(true);
                scanner?.current?.stop();
            }
        };
    }, [openCamera]);

    useEffect(() => {
        if (videoElement?.current && !scanner.current) {
            scanner.current = new QrScanner(videoElement?.current, onScanSuccess, {
                highlightScanRegion: true,
                highlightCodeOutline: true,
            });
            scanner.current.start()
                .then(() => setStartingCamera(false))
                .catch((error) => {
                    console.error('Erro ao iniciar a camera', error);
                    onError('A câmera está bloqueada ou inacessível. Por favor, altere as permissões da câmera no seu navegador e recarregue a página.');
                });
        }
        // 🧹 Limpando ao desmontar
        // 🚨 Isso remove o QR Scanner da renderização e do uso da câmera quando ele é fechado ou removido da IU.
        return () => {
            if (!videoElement?.current) {
                scanner?.current?.stop();
            }
        };
    }, []);

    return (
        <Box
            height={350}
            position='relative'
            paddingTop={2}
        >
            <Box
                component='video'
                ref={videoElement}
                width='100%'
                height='100%'
                sx={{ objectFit: 'cover' }}
            />
            {
                startingCamera && (
                    <Player
                        autoplay
                        keepLastFrame
                        loop
                        src={lottieLoading}
                        style={{
                            bottom: '25%',
                            height: 200,
                            left: '25%',
                            position: 'absolute',
                            right: '25%',
                            top: '25%',
                            width: 200
                        }}
                    />
                )
            }
            <IconButton
                color='primary'
                onClick={handleCameraswitch}
                size='large'
                sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10
                }}
            >
                <Cameraswitch fontSize='inherit' />
            </IconButton>
        </Box >
    )
}