
import { useState } from 'react';

import {
    Link,
    NavLink,
    Outlet,
    useNavigate,
} from 'react-router-dom';

import {
    ArrowUpRight,
    LayoutDashboard,
    LogOut,
    Menu,
    Plus,
    ShieldCheck,
    Truck,
    X,
} from 'lucide-react';

import { logOutAdmin } from '../../api/adminAuth';

// ========================================
// НАВІГАЦІЯ АДМІН-ПАНЕЛІ
// ========================================

const navigation = [
    {
        label: 'Головна',
        to: '/admin',
        icon: LayoutDashboard,
        end: true,
    },
    {
        label: 'Автомобілі',
        to: '/admin/cars',
        icon: Truck,
        end: true,
    },
    {
        label: 'Додати автомобіль',
        to: '/admin/cars/new',
        icon: Plus,
        end: true,
    },
];

// ========================================
// ГОЛОВНИЙ КОМПОНЕНТ
// ========================================

export default function AdminLayout() {
    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    const [loggingOut, setLoggingOut] =
        useState(false);

    const [logoutError, setLogoutError] =
        useState('');

    function closeMobileMenu() {
        setMobileMenuOpen(false);
    }

    async function handleLogout() {
        if (loggingOut) return;

        setLoggingOut(true);
        setLogoutError('');

        try {
            await logOutAdmin();

            navigate('/admin/login', {
                replace: true,
            });
        } catch {
            setLogoutError(
                'Не вдалося вийти. Перевір з’єднання з API та спробуй ще раз.'
            );
        } finally {
            setLoggingOut(false);
        }
    }

    // ========================================
    // ВМІСТ БІЧНОГО МЕНЮ
    // ========================================

    const sidebarContent = (
        <div className="flex h-full flex-col">

            {/* Логотип */}
            <div className="border-b border-white/10 px-6 py-6">

                <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="block"
                >
                    <img
                        src="/PhotoAutoMarket/LogoAutoMarket.png"
                        alt="AutoMarket Rivne"
                        className="h-14 w-auto max-w-[200px] object-contain"
                    />
                </Link>

                <div className="mt-4 flex items-center gap-2">

                    <ShieldCheck
                        size={15}
                        className="text-yellow-400"
                    />

                    <span className="text-xs font-medium tracking-wide text-gray-400">
                        Панель адміністратора
                    </span>

                </div>
            </div>

            {/* Основна навігація */}
            <nav
                aria-label="Навігація адміністратора"
                className="flex-1 space-y-2 overflow-y-auto px-4 py-6"
            >

                <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
                    Керування
                </p>

                {navigation.map(item => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={closeMobileMenu}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                    isActive
                                        ? 'bg-yellow-400 text-gray-950'
                                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                }`
                            }
                        >
                            <Icon
                                size={20}
                                className="shrink-0"
                            />

                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}

            </nav>

            {/* Нижня частина меню */}
            <div className="border-t border-white/10 p-4">

                <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                    Перейти на сайт
                    <ArrowUpRight size={19} />
                </Link>

                {/* Вихід */}
                <button
                    type="button"
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
                >
                    <LogOut size={19} />

                    {loggingOut
                        ? 'Вихід...'
                        : 'Вийти з адмінки'}
                </button>

                {logoutError && (
                    <p
                        role="alert"
                        className="mt-2 px-3 text-xs text-red-300"
                    >
                        {logoutError}
                    </p>
                )}

            </div>
        </div>
    );

    // ========================================
    // ІНТЕРФЕЙС АДМІН-ПАНЕЛІ
    // ========================================

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">

            {/* Бічне меню на комп'ютері */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-[#101827] text-white lg:block">
                {sidebarContent}
            </aside>

            {/* Мобільне меню */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[90] lg:hidden">

                    <button
                        type="button"
                        onClick={closeMobileMenu}
                        aria-label="Закрити меню адміністратора"
                        className="absolute inset-0 bg-black/60"
                    />

                    <aside
                        id="admin-mobile-navigation"
                        className="absolute inset-y-0 left-0 w-[min(290px,85vw)] bg-[#101827] text-white shadow-2xl"
                    >
                        {sidebarContent}

                        <button
                            type="button"
                            onClick={closeMobileMenu}
                            aria-label="Закрити меню"
                            className="absolute right-3 top-3 rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
                        >
                            <X size={20} />
                        </button>
                    </aside>

                </div>
            )}

            {/* Основна частина */}
            <div className="min-h-screen lg:pl-72">

                {/* Верхня панель */}
                <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">

                    <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-8">

                        <div className="flex items-center gap-3">

                            {/* Мобільне меню */}
                            <button
                                type="button"
                                onClick={() =>
                                    setMobileMenuOpen(true)
                                }
                                aria-label="Відкрити меню адміністратора"
                                aria-expanded={mobileMenuOpen}
                                aria-controls="admin-mobile-navigation"
                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-900 lg:hidden dark:bg-gray-800 dark:text-white"
                            >
                                <Menu size={23} />
                            </button>

                            <div>
                                <p className="font-extrabold text-gray-900 dark:text-white">
                                    Панель керування
                                </p>

                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    AutoMarket Rivne
                                </p>
                            </div>

                        </div>

                        <div className="flex items-center gap-3">

                            <span className="hidden rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-800 sm:inline-flex dark:bg-yellow-400/15 dark:text-yellow-400">
                                Авторизований адміністратор
                            </span>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 font-extrabold text-yellow-400 dark:bg-gray-800">
                                AM
                            </div>

                        </div>

                    </div>
                </header>

                {/* Поточна сторінка */}
                <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-8 lg:py-10">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}
