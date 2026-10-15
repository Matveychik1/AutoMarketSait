
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import {
    Navigate,
    useLocation,
} from 'react-router-dom';

import {
    LockKeyhole,
    RefreshCw,
} from 'lucide-react';

import { isAdminLoggedIn } from '../../api/adminAuth';

type AuthState =
    | 'checking'
    | 'authorized'
    | 'unauthorized'
    | 'error';

type AdminGuardProps = {
    children: ReactNode;
};

export default function AdminGuard({
                                       children,
                                   }: AdminGuardProps) {
    const location = useLocation();

    const [status, setStatus] =
        useState<AuthState>('checking');

    const [retry, setRetry] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        setStatus('checking');

        isAdminLoggedIn(controller.signal)
            .then(isAuthorized => {
                if (controller.signal.aborted) return;

                setStatus(
                    isAuthorized
                        ? 'authorized'
                        : 'unauthorized'
                );
            })
            .catch(() => {
                if (!controller.signal.aborted) {
                    setStatus('error');
                }
            });

        return () => controller.abort();
    }, [retry]);

    // Неавторизований користувач
    if (status === 'unauthorized') {
        return (
            <Navigate
                to="/admin/login"
                replace
                state={{
                    from: location.pathname + location.search,
                }}
            />
        );
    }

    // Доступ дозволено
    if (status === 'authorized') {
        return <>{children}</>;
    }

    // Завантаження або помилка зв'язку
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
            <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-white/10 bg-gray-900 p-8 text-center">

                <LockKeyhole
                    size={32}
                    className="text-yellow-400"
                />

                <h1 className="text-xl font-bold">
                    {status === 'checking'
                        ? 'Перевіряємо доступ...'
                        : 'Не вдалося зв’язатися із сервером'}
                </h1>

                <p className="text-sm text-gray-400">
                    {status === 'checking'
                        ? 'Перевіряємо сесію адміністратора.'
                        : 'Перевір, чи запущений AutoMarket.Api у Visual Studio.'}
                </p>

                {status === 'error' && (
                    <button
                        type="button"
                        onClick={() =>
                            setRetry(previous => previous + 1)
                        }
                        className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-gray-950 transition hover:bg-yellow-300"
                    >
                        <RefreshCw size={18} />
                        Повторити
                    </button>
                )}

            </div>
        </div>
    );
}
