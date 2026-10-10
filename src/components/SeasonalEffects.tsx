
import { useEffect, useState } from 'react';
import { Leaf, Snowflake, Flower2, Sun, EyeOff } from 'lucide-react';

import './SeasonalEffects.css';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

type SeasonalTheme = {
    season: Season;
    month: number;
};

const STORAGE_KEY = 'automarket-seasonal-effects';
const SETTINGS_EVENT = 'automarket-seasonal-settings-change';

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

function getSavedPreference(): boolean {
    try {
        return localStorage.getItem(STORAGE_KEY) !== 'false';
    } catch {
        return true;
    }
}

// Керує сезонним оформленням всього сайту
export default function SeasonalEffects() {
    const [theme, setTheme] = useState(getCurrentTheme);
    const [enabled, setEnabled] = useState(getSavedPreference);

    // Оновлення при зміні налаштування
    useEffect(() => {
        function updatePreference() {
            setEnabled(getSavedPreference());
        }

        window.addEventListener(
            SETTINGS_EVENT,
            updatePreference
        );

        window.addEventListener(
            'storage',
            updatePreference
        );

        return () => {
            window.removeEventListener(
                SETTINGS_EVENT,
                updatePreference
            );

            window.removeEventListener(
                'storage',
                updatePreference
            );
        };
    }, []);

    // Автоматична зміна сезону
    useEffect(() => {
        function checkSeason() {
            const nextTheme = getCurrentTheme();

            setTheme(previous => {
                if (
                    previous.month === nextTheme.month &&
                    previous.season === nextTheme.season
                ) {
                    return previous;
                }

                return nextTheme;
            });
        }

        const interval = window.setInterval(
            checkSeason,
            60 * 60 * 1000
        );

        document.addEventListener(
            'visibilitychange',
            checkSeason
        );

        return () => {
            window.clearInterval(interval);

            document.removeEventListener(
                'visibilitychange',
                checkSeason
            );
        };
    }, []);

    // Встановлення CSS-атрибутів на HTML
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

// Окрема кнопка для футера
export function SeasonalEffectsToggle() {
    const [enabled, setEnabled] = useState(getSavedPreference);
    const [theme, setTheme] = useState(getCurrentTheme);

    useEffect(() => {
        function sync() {
            setEnabled(getSavedPreference());
            setTheme(getCurrentTheme());
        }

        window.addEventListener(SETTINGS_EVENT, sync);
        window.addEventListener('storage', sync);

        return () => {
            window.removeEventListener(SETTINGS_EVENT, sync);
            window.removeEventListener('storage', sync);
        };
    }, []);

    function toggleEffects() {
        const nextValue = !enabled;

        try {
            localStorage.setItem(
                STORAGE_KEY,
                String(nextValue)
            );
        } catch {
            // Якщо localStorage недоступний,
            // повідомляємо про зміну через подію.
        }

        setEnabled(nextValue);

        window.dispatchEvent(
            new Event(SETTINGS_EVENT)
        );
    }

    const seasonIcons = {
        spring: Flower2,
        summer: Sun,
        autumn: Leaf,
        winter: Snowflake,
    };

    const Icon = enabled
        ? seasonIcons[theme.season]
        : EyeOff;

    return (
        <button
            type="button"
            onClick={toggleEffects}
            aria-pressed={enabled}
            className="inline-flex items-center gap-3 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-yellow-400 hover:text-white"
        >
            <Icon
                size={19}
                className={enabled ? 'text-yellow-400' : 'text-gray-500'}
            />

            <span>
                Сезонний фон: {enabled ? 'Увімкнено' : 'Вимкнено'}
            </span>
        </button>
    );
}
