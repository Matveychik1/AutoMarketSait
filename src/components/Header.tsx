
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import {
    ChevronDown,
    Menu,
    Moon,
    Phone,
    Sun,
    X,
} from 'lucide-react';

import { SeasonalEffectsToggle } from './SeasonalEffects';

const phoneNumbers = [
    {
        label: '067 100 21 24',
        href: 'tel:+380671002124',
    },
    {
        label: '050 200 21 24',
        href: 'tel:+380502002124',
    },
];

const navigation = [
    {
        label: 'Головна',
        to: '/',
    },
    {
        label: 'Каталог',
        to: '/catalog',
    },
    {
        label: 'Про нас',
        to: '/about',
    },
];

function getInitialTheme(): boolean {
    try {
        const saved = localStorage.getItem('theme');

        if (saved === 'dark') return true;
        if (saved === 'light') return false;
    } catch {
        // Якщо localStorage недоступний
    }

    return document.documentElement.classList.contains('dark');
}

export function Header() {
    const location = useLocation();

    const [isDark, setIsDark] = useState(getInitialTheme);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Застосування світлої / темної теми
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);

        try {
            localStorage.setItem(
                'theme',
                isDark ? 'dark' : 'light'
            );
        } catch {
            // Тема продовжить працювати в поточній вкладці
        }
    }, [isDark]);

    // Закриваємо мобільне меню при переході
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname, location.search]);

    function toggleTheme() {
        setIsDark(previous => !previous);
    }

    const navClass = ({ isActive }: { isActive: boolean }) =>
        `rounded-lg px-4 py-2 text-sm font-semibold transition ${
            isActive
                ? 'bg-yellow-400/15 text-yellow-600 dark:text-yellow-400'
                : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-yellow-400'
        }`;

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95">

            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

                {/* Логотип */}
                <Link
                    to="/"
                    aria-label="AutoMarket Rivne — головна"
                    className="flex min-w-0 shrink items-center"
                >
                    <img
                        src="/PhotoAutoMarket/LogoAutoMarketBlack.png"
                        alt="AutoMarket Rivne"
                        className="h-12 w-auto max-w-[145px] object-contain sm:h-14 sm:max-w-[190px] dark:hidden"
                    />

                    <img
                        src="/PhotoAutoMarket/LogoAutoMarketWhite.png"
                        alt="AutoMarket Rivne"
                        className="hidden h-12 w-auto max-w-[145px] object-contain sm:h-14 sm:max-w-[190px] dark:block"
                    />
                </Link>

                {/* Навігація на комп'ютері */}
                <nav
                    aria-label="Основна навігація"
                    className="hidden items-center gap-1 lg:flex"
                >
                    {navigation.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={navClass}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Кнопки праворуч */}
                <div className="flex shrink-0 items-center gap-2">

                    {/* Сезонний ефект */}
                    <SeasonalEffectsToggle />

                    {/* Перемикач теми */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={
                            isDark
                                ? 'Увімкнути світлу тему'
                                : 'Увімкнути темну тему'
                        }
                        title={
                            isDark
                                ? 'Світла тема'
                                : 'Темна тема'
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-gray-700 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-yellow-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-gray-950"
                    >
                        {isDark ? (
                            <Sun size={20} />
                        ) : (
                            <Moon size={20} />
                        )}
                    </button>

                    {/* Телефони на комп'ютері */}
                    <details className="group relative hidden sm:block">
                        <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-xl bg-yellow-400 px-4 font-bold text-gray-950 transition hover:bg-yellow-500 [&::-webkit-details-marker]:hidden">
                            <Phone size={18} />

                            <span className="hidden xl:inline">
                                Зателефонувати
                            </span>

                            <ChevronDown
                                size={16}
                                className="transition-transform group-open:rotate-180"
                            />
                        </summary>

                        <div className="absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900">

                            <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                Оберіть номер телефону
                            </p>

                            {phoneNumbers.map(phone => (
                                <a
                                    key={phone.href}
                                    href={phone.href}
                                    className="flex items-center gap-3 rounded-xl px-3 py-3 font-semibold text-gray-900 transition hover:bg-yellow-50 dark:text-white dark:hover:bg-gray-800"
                                >
                                    <Phone
                                        size={17}
                                        className="text-yellow-500"
                                    />

                                    {phone.label}
                                </a>
                            ))}
                        </div>
                    </details>

                    {/* Дзвінок на малих екранах */}
                    <a
                        href="tel:+380671002124"
                        aria-label="Зателефонувати 067 100 21 24"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-gray-950 sm:hidden"
                    >
                        <Phone size={19} />
                    </a>

                    {/* Мобільне меню */}
                    <button
                        type="button"
                        onClick={() =>
                            setIsMobileMenuOpen(previous => !previous)
                        }
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-navigation"
                        aria-label={
                            isMobileMenuOpen
                                ? 'Закрити меню'
                                : 'Відкрити меню'
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-gray-900 transition hover:bg-yellow-400 lg:hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:text-gray-950"
                    >
                        {isMobileMenuOpen ? (
                            <X size={22} />
                        ) : (
                            <Menu size={22} />
                        )}
                    </button>

                </div>
            </div>

            {/* Мобільна навігація */}
            {isMobileMenuOpen && (
                <nav
                    id="mobile-navigation"
                    aria-label="Мобільна навігація"
                    className="border-t border-gray-200 bg-white px-4 py-4 lg:hidden dark:border-gray-800 dark:bg-gray-950"
                >
                    <div className="mx-auto flex max-w-7xl flex-col gap-2">

                        {navigation.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/'}
                                onClick={() =>
                                    setIsMobileMenuOpen(false)
                                }
                                className={navClass}
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        <div className="mt-3 border-t border-gray-200 pt-4 dark:border-gray-800">
                            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                Наші телефони
                            </p>

                            <div className="flex flex-col gap-3">
                                {phoneNumbers.map(phone => (
                                    <a
                                        key={phone.href}
                                        href={phone.href}
                                        className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white"
                                    >
                                        <Phone
                                            size={17}
                                            className="text-yellow-500"
                                        />

                                        {phone.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>
            )}
        </header>
    );
}
