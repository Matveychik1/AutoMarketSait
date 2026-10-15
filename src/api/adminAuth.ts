
/**
 * Авторизація адміністратора AutoMarket Rivne.
 *
 * Всі запити йдуть через /api.
 * Vite перенаправляє їх на ASP.NET Core.
 *
 * Паролі й токени не зберігаємо в localStorage.
 */

export async function isAdminLoggedIn(
    signal?: AbortSignal
): Promise<boolean> {
    const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        signal,
    });

    if (response.status === 401 ||
        response.status === 403) {
        return false;
    }

    if (!response.ok) {
        throw new Error(
            `Не вдалося перевірити авторизацію: ${response.status}`
        );
    }

    return true;
}

/**
 * Отримуємо захисний CSRF-токен.
 * Потрібен для запитів, які змінюють дані.
 */
export async function getCsrfToken(): Promise<string> {
    const response = await fetch('/api/auth/csrf', {
        credentials: 'include',
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(
            `Не вдалося отримати CSRF-токен: ${response.status}`
        );
    }

    const data: { requestToken?: string } =
        await response.json();

    if (!data.requestToken) {
        throw new Error(
            'Сервер не повернув CSRF-токен.'
        );
    }

    return data.requestToken;
}

/**
 * Вхід адміністратора.
 */
export async function logInAdmin(
    email: string,
    password: string
): Promise<void> {
    const csrfToken = await getCsrfToken();

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (response.status === 401) {
        throw new Error(
            'Неправильний email або пароль, або вхід тимчасово заблоковано.'
        );
    }

    if (!response.ok) {
        throw new Error(
            `Помилка входу: ${response.status}`
        );
    }
}

/**
 * Вихід із системи.
 */
export async function logOutAdmin(): Promise<void> {
    const csrfToken = await getCsrfToken();

    const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'X-CSRF-TOKEN': csrfToken,
        },
    });

    if (response.status === 401) {
        return;
    }

    if (!response.ok) {
        throw new Error(
            `Не вдалося завершити сесію: ${response.status}`
        );
    }
}
