
import { useState } from 'react';
import { Menu, X, Phone, Moon, Sun, Copy, Check } from 'lucide-react';

const PHONE_NUMBER = '+380671002124';

const navigation = [
    { label: 'Головна', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    { label: 'Про нас', href: '/about' },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPhoneOpen, setIsPhoneOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const [isDark, setIsDark] = useState(
        () => localStorage.getItem('theme') === 'dark'
    );

    function toggleTheme() {
        const nextTheme = !isDark;

        setIsDark(nextTheme);
        localStorage.setItem('theme', nextTheme ? 'dark' : 'light');

        document.documentElement.classList.toggle('dark', nextTheme);
    }

    async function copyPhone() {
        try {
            await navigator.clipboard.writeText(PHONE_NUMBER);
            setIsCopied(true);
        } catch {
            setIsCopied(false);
        }
    }

    return (
        <header className="relative z-50 border-b border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">

                {/* Логотип */}

                <a
                    href="/"
                    className="shrink-0"
                    aria-label="AutoMarket Rivne — головна"
                >
                    {/* Світла тема — чорний логотип */}
                    <img
                        src="/PhotoAutoMarket/LogoAutoMarket_black.png"
                        alt="AutoMarket Rivne"
                        className="block h-14 w-auto object-contain dark:hidden"
                    />

                    {/* Темна тема — білий логотип */}
                    <img
                        src="/PhotoAutoMarket/LogoAutoMarket.png"
                        alt="AutoMarket Rivne"
                        className="hidden h-14 w-auto object-contain dark:block"
                    />
                </a>


                {/* Навігація для комп'ютера */}
                <nav aria-label="Основна навігація" className="hidden md:block">
                    <ul className="flex items-center gap-8">
                        {navigation.map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className="text-sm font-semibold transition-colors hover:text-yellow-500"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Кнопки */}
                <div className="flex items-center gap-3">

                    {/* Перемикач теми */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Перемкнути тему"
                        className="rounded-xl bg-gray-100 p-3 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Телефон */}
                    <button
                        type="button"
                        onClick={() => setIsPhoneOpen(!isPhoneOpen)}
                        aria-expanded={isPhoneOpen}
                        className="flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-gray-900 transition hover:bg-yellow-500"
                    >
                        <Phone size={19} />
                        <span className="hidden sm:inline">Зателефонувати</span>
                    </button>

                    {/* Мобільне меню */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
                        aria-expanded={isMenuOpen}
                        className="rounded-xl bg-gray-100 p-3 md:hidden dark:bg-gray-800"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Вікно телефону */}
            {isPhoneOpen && (
                <div className="absolute right-4 top-full mt-3 w-72 animate-in rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-700 dark:bg-gray-800 sm:right-8">
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        Зв'яжіться з нами
                    </p>

                    <p className="mb-4 text-xl font-bold">
                        {PHONE_NUMBER}
                    </p>

                    <div className="flex gap-2">
                        <a
                            href={`tel:${PHONE_NUMBER}`}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-3 py-2 font-semibold text-gray-900 hover:bg-yellow-500"
                        >
                            <Phone size={16} />
                            Дзвінок
                        </a>

                        <button
                            type="button"
                            onClick={copyPhone}
                            aria-label="Скопіювати номер"
                            className="rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
                        >
                            {isCopied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
            )}

            {/* Мобільна навігація */}
            {isMenuOpen && (
                <nav
                    aria-label="Мобільна навігація"
                    className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-900 md:hidden"
                >
                    <ul className="flex flex-col gap-2">
                        {navigation.map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block rounded-lg px-4 py-3 font-medium transition hover:bg-yellow-400 hover:text-gray-900"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    );
}
