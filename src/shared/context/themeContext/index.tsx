'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import LightTheme from '../../themes/light';
import DarkTheme from '../../themes/dark';

interface ThemeContextData {
    themeName: 'light' | 'dark';
    toggleTheme: () => void;
}

interface AppThemeProviderProps {
    children: React.ReactNode;
}

const ThemeContext = createContext<Partial<ThemeContextData>>({});

export const useAppThemeContext = () => useContext(ThemeContext);

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
    //const defaultTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const [themeName, setThemeName] = useState<'light' | 'dark'>('light');

    const toggleTheme = useCallback(() => {
        setThemeName(oldThemeName => oldThemeName === 'light' ? 'dark' : 'light');
    }, []);

    const theme = useMemo(() => {
        return themeName === 'light' ? LightTheme : DarkTheme;
    }, [themeName]);

    return (
        <ThemeContext.Provider value={{ themeName, toggleTheme }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}