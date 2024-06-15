'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import LightTheme from '@/shared/themes/light';
import DarkTheme from '@/shared/themes/dark';

interface ThemeContextData {
    themeName: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = createContext<Partial<ThemeContextData>>({});

export const useAppThemeContext = () => useContext(ThemeContext);

export const AppThemeProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const [themeName, setThemeName] = useState<'light' | 'dark'>(prefersDarkMode);

    const toggleTheme = useCallback(() => {
        setThemeName((oldThemeName) => oldThemeName === 'light' ? 'dark' : 'light');
    }, []);

    const theme = useMemo(() => {
        return themeName === 'light' ? LightTheme : DarkTheme;
    }, [themeName]);

    return (
        <ThemeContext.Provider value={{ themeName, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}