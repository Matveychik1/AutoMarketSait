
import { useState } from 'react';
import type { FormEvent } from 'react';

import {
    Link,
    useLocation,
    useNavigate,
} from 'react-router-dom';

import {
    ArrowLeft,
    Eye,
    EyeOff,
    LockKeyhole,
    LogIn,
    Mail,
} from 'lucide-react';

import { logInAdmin } from '../../api/adminAuth.ts';

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] =
        useState('admin@automarket.local');

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (loading) return;

        setError('');
        setLoading(true);

        try {
            await logInAdmin(
                email.trim(),
                password
            );

            const state = location.state as {
                from?: unknown;
            } | null;

            const requestedPath = state?.from;

            // Дозволяємо повернення лише
            // на маршрут адміністратора.
            const destination =
                typeof requestedPath === 'string' &&
                (
                    requestedPath === '/admin' ||
                    requestedPath.startsWith('/admin/')
                ) &&
                !requestedPath.startsWith('/admin/login') &&
                !requestedPath.startsWith('//')
                    ? requestedPath
                    : '/admin';

            navigate(destination, {
                replace: true,
            });
        } catch (reason) {
            setError(
                reason instanceof Error
                    ? reason.message
                    : 'Сталася помилка входу.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0b1120] px-4 py-12 text-white">

            <div className="w-full max-w-md">

                <Link
                    to="/"
                    className="mb-7 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-yellow-400"
                >
                    <ArrowLeft size={18} />
                    Повернутися на сайт
                </Link>

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101827] shadow-2xl shadow-black/30">

                    {/* Заголовок */}
                    <div className="border-b border-white/10 px-7 py-8 text-center sm:px-9">

                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-gray-950">
                            <LockKeyhole size={30} />
                        </div>

                        <h1 className="text-2xl font-extrabold tracking-tight">
                            AutoMarket Rivne
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Вхід до панелі адміністратора
                        </p>

                    </div>

                    {/* Форма авторизації */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 px-7 py-8 sm:px-9"
                    >

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="admin-email"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Email
                            </label>

                            <div className="relative">

                                <Mail
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="admin-email"
                                    type="email"
                                    autoComplete="username"
                                    required
                                    value={email}
                                    onChange={event =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="admin@automarket.local"
                                    className="w-full rounded-xl border border-white/15 bg-white/5 py-3.5 pl-12 pr-4 text-white outline-none placeholder:text-gray-500 focus:border-yellow-400"
                                />

                            </div>
                        </div>

                        {/* Пароль */}
                        <div>
                            <label
                                htmlFor="admin-password"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Пароль
                            </label>

                            <div className="relative">

                                <LockKeyhole
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="admin-password"
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={event =>
                                        setPassword(event.target.value)
                                    }
                                    className="w-full rounded-xl border border-white/15 bg-white/5 py-3.5 pl-12 pr-12 text-white outline-none focus:border-yellow-400"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(previous => !previous)
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Приховати пароль'
                                            : 'Показати пароль'
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword
                                        ? <EyeOff size={19} />
                                        : <Eye size={19} />}
                                </button>

                            </div>
                        </div>

                        {/* Повідомлення про помилку */}
                        {error && (
                            <p
                                role="alert"
                                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                            >
                                {error}
                            </p>
                        )}

                        {/* Кнопка входу */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 font-extrabold text-gray-950 transition hover:bg-yellow-300 disabled:cursor-wait disabled:opacity-60"
                        >
                            <LogIn size={19} />

                            {loading
                                ? 'Перевіряємо дані...'
                                : 'Увійти в адмін-панель'}
                        </button>

                    </form>
                </div>

                <p className="mt-5 text-center text-xs text-gray-500">
                    Доступ лише для уповноваженого адміністратора.
                </p>

            </div>
        </div>
    );
}
