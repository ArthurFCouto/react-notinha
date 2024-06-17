'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import LightTheme from '@/shared/themes/light';
import DarkTheme from '@/shared/themes/dark';

interface ThemeContextData {
    themeName: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = createContext<Partial<ThemeContextData>>({});

export const useAppThemeContext = () => useContext(ThemeContext);

export const AppThemeProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true }) ? 'dark' : 'light';
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
};