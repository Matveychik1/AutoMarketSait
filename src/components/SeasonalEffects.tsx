
import { useEffect, useState, useSyncExternalStore } from 'react';
import {
    EyeOff,
    Flower2,
    Leaf,
    Snowflake,
    Sun,
} from 'lucide-react';

import './SeasonalEffects.css';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

type SeasonalTheme = {
    season: Season;
    month: number;
};

const STORAGE_KEY = 'automarket-seasonal-effects';

function getCurrentTheme(): SeasonalTheme {
    const month = new Date().getMonth();

    if (month >= 2 && month <= 4) {
        return { season: 'spring', month };
    }

    if (month >= 5 && month <= 7) {
        return { season: 'summer', month };
    }

    if (month >= 8 && month <= 10) {
        return { season: 'autumn', month };
    }

    return { season: 'winter', month };
}

function readSavedPreference(): boolean {
    try {
        return localStorage.getItem(STORAGE_KEY) !== 'false';
    } catch {
        return true;
    }
}

// Спільний стан для сезонного фону і кнопки Header
let effectsEnabled = readSavedPreference();

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

function getSnapshot(): boolean {
    return effectsEnabled;
}

function setEffectsEnabled(value: boolean) {
    effectsEnabled = value;

    try {
        localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
        // Перемикач працюватиме навіть без localStorage
    }

    listeners.forEach(listener => listener());
}

function useEffectsEnabled() {
    return useSyncExternalStore(subscribe, getSnapshot);
}

// Головний компонент керує CSS-оформленням
export default function SeasonalEffects() {
    const enabled = useEffectsEnabled();
    const [theme, setTheme] = useState(getCurrentTheme);

    useEffect(() => {
        function updateSeason() {
            const next = getCurrentTheme();

            setTheme(previous => {
                if (
                    previous.month === next.month &&
                    previous.season === next.season
                ) {
                    return previous;
                }

                return next;
            });
        }

        function syncFromStorage(event: StorageEvent) {
            if (event.key === STORAGE_KEY || event.key === null) {
                const next = readSavedPreference();

                if (next !== effectsEnabled) {
                    effectsEnabled = next;
                    listeners.forEach(listener => listener());
                }
            }
        }

        const interval = window.setInterval(
            updateSeason,
            60 * 60 * 1000
        );

        document.addEventListener(
            'visibilitychange',
            updateSeason
        );

        window.addEventListener('storage', syncFromStorage);

        return () => {
            window.clearInterval(interval);

            document.removeEventListener(
                'visibilitychange',
                updateSeason
            );

            window.removeEventListener(
                'storage',
                syncFromStorage
            );
        };
    }, []);

    useEffect(() => {
        const root = document.documentElement;

        root.dataset.amSeason = theme.season;
        root.dataset.amEffects = enabled ? 'on' : 'off';

        if (theme.month === 9) {
            root.dataset.amHoliday = 'halloween';
        } else if (theme.month === 11) {
            root.dataset.amHoliday = 'christmas';
        } else {
            root.dataset.amHoliday = 'none';
        }

        return () => {
            delete root.dataset.amSeason;
            delete root.dataset.amEffects;
            delete root.dataset.amHoliday;
        };
    }, [theme, enabled]);

    return null;
}

// Компактна кнопка для Header
export function SeasonalEffectsToggle() {
    const enabled = useEffectsEnabled();
    const [theme, setTheme] = useState(getCurrentTheme);

    useEffect(() => {
        function updateSeason() {
            setTheme(getCurrentTheme());
        }

        const interval = window.setInterval(
            updateSeason,
            60 * 60 * 1000
        );

        document.addEventListener(
            'visibilitychange',
            updateSeason
        );

        return () => {
            window.clearInterval(interval);

            document.removeEventListener(
                'visibilitychange',
                updateSeason
            );
        };
    }, []);

    const icons = {
        spring: Flower2,
        summer: Sun,
        autumn: Leaf,
        winter: Snowflake,
    };

    const Icon = enabled
        ? icons[theme.season]
        : EyeOff;

    return (
        <button
            type="button"
            onClick={() => setEffectsEnabled(!enabled)}
            aria-pressed={enabled}
            aria-label={
                enabled
                    ? 'Вимкнути сезонні ефекти'
                    : 'Увімкнути сезонні ефекти'
            }
            title={
                enabled
                    ? 'Вимкнути сезонні ефекти'
                    : 'Увімкнути сезонні ефекти'
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-gray-700 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-yellow-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-gray-950"
        >
            <Icon
                size={20}
                className={enabled ? 'text-yellow-500' : ''}
            />
        </button>
    );
}
