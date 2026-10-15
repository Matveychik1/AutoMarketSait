
import { useMemo, useState } from 'react';

import {
    Link,
    useLocation,
} from 'react-router-dom';

import {
    AlertTriangle,
    ArrowUpRight,
    CheckCircle2,
    ImageOff,
    Loader2,
    Pencil,
    Plus,
    Search,
    Trash2,
    Truck,
    X,
} from 'lucide-react';

import type { Vehicle } from '../../types/vehicle';

import {
    getVehicleStatus,
    VEHICLE_STATUSES,
    VEHICLE_STATUS_LABELS,
} from '../../types/vehicleStatus';

import type {
    VehicleStatus,
} from '../../types/vehicleStatus';

import { getVehicleSlug } from '../../utils/vehicleSlug';

import { deleteCar } from '../../api/carsApi';

// ========================================
// ТИПИ
// ========================================

type Props = {
    vehicles: Vehicle[];
    onDelete: (id: number) => void;
};

type StatusFilter = 'all' | VehicleStatus;

// ========================================
// ФОРМАТУВАННЯ
// ========================================

const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('uk-UA');

// ========================================
// КОЛЬОРИ СТАТУСІВ
// ========================================

const statusStyles: Record<VehicleStatus, string> = {
    available:
        'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400',

    reserved:
        'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400',

    sold:
        'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',

    hidden:
        'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
};

// ========================================
// ГОЛОВНА СТОРІНКА АВТОМОБІЛІВ
// ========================================

export default function AdminCarsPage({
                                          vehicles,
                                          onDelete,
                                      }: Props) {
    const location = useLocation();

    const navigationState = location.state as {
        savedVehicleId?: number;
        createdVehicle?: boolean;
    } | null;

    const savedVehicleId =
        navigationState?.savedVehicleId;

    const createdVehicle =
        navigationState?.createdVehicle === true;

    // ========================================
    // ПОШУК ТА ФІЛЬТРИ
    // ========================================

    const [search, setSearch] = useState('');

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>('all');

    // ========================================
    // ВИДАЛЕННЯ
    // ========================================

    const [vehicleToDelete, setVehicleToDelete] =
        useState<Vehicle | null>(null);

    const [deleting, setDeleting] = useState(false);

    const [deleteError, setDeleteError] = useState('');

    const [deletedVehicleName, setDeletedVehicleName] =
        useState('');

    // ========================================
    // ФІЛЬТРАЦІЯ
    // ========================================

    const filteredVehicles = useMemo(() => {
        const query = search.trim().toLowerCase();

        return [...vehicles]
            .filter(vehicle => {
                if (
                    statusFilter !== 'all' &&
                    getVehicleStatus(vehicle.status) !==
                    statusFilter
                ) {
                    return false;
                }

                if (!query) {
                    return true;
                }

                const searchableText = [
                    vehicle.brand,
                    vehicle.model,
                    vehicle.year,
                    vehicle.bodyType,
                    vehicle.id,
                ]
                    .join(' ')
                    .toLowerCase();

                return searchableText.includes(query);
            })
            .sort((a, b) => {
                const byDate = b.addedAt.localeCompare(
                    a.addedAt
                );

                return byDate !== 0
                    ? byDate
                    : b.id - a.id;
            });
    }, [vehicles, search, statusFilter]);

    // ========================================
    // ВІДКРИТТЯ ПІДТВЕРДЖЕННЯ
    // ========================================

    function askToDelete(vehicle: Vehicle) {
        if (deleting) {
            return;
        }

        setVehicleToDelete(vehicle);
        setDeleteError('');
        setDeletedVehicleName('');
    }

    // ========================================
    // ЗАКРИТТЯ ПІДТВЕРДЖЕННЯ
    // ========================================

    function cancelDelete() {
        if (deleting) {
            return;
        }

        setVehicleToDelete(null);
        setDeleteError('');
    }

    // ========================================
    // ВИДАЛЕННЯ З POSTGRESQL
    // ========================================

    async function confirmDelete() {
        if (!vehicleToDelete || deleting) {
            return;
        }

        const vehicle = vehicleToDelete;

        setDeleting(true);
        setDeleteError('');

        try {
            // 1. Видаляємо запис із PostgreSQL
            await deleteCar(vehicle.id);

            // 2. Оновлюємо список у React
            // тільки після успішного DELETE
            onDelete(vehicle.id);

            // 3. Закриваємо вікно
            setVehicleToDelete(null);

            // 4. Показуємо повідомлення
            setDeletedVehicleName(
                `${vehicle.brand} ${vehicle.model} (#${vehicle.id})`
            );
        } catch (error) {
            setDeleteError(
                error instanceof Error
                    ? error.message
                    : 'Не вдалося видалити автомобіль.'
            );
        } finally {
            setDeleting(false);
        }
    }

    // ========================================
    // JSX
    // ========================================

    return (
        <div className="space-y-7">

            {/* ===================================
                ЗАГОЛОВОК
            =================================== */}

            <div className="flex flex-wrap items-start justify-between gap-4">

                <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                        Керування каталогом
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold text-gray-950 sm:text-4xl dark:text-white">
                        Автомобілі
                    </h1>

                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                        Редагування, статуси та видалення
                        автомобілів із каталогу.
                    </p>
                </div>

                <Link
                    to="/admin/cars/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-gray-950 transition hover:bg-yellow-500"
                >
                    <Plus size={19} />
                    Додати автомобіль
                </Link>

            </div>

            {/* ===================================
                УСПІШНЕ ЗБЕРЕЖЕННЯ
            =================================== */}

            {savedVehicleId !== undefined && (
                <div
                    role="status"
                    className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800 dark:border-green-900 dark:bg-green-500/10 dark:text-green-400"
                >
                    <CheckCircle2
                        size={20}
                        className="shrink-0"
                    />

                    <span>
                        {createdVehicle
                            ? `Автомобіль #${savedVehicleId} успішно додано до каталогу.`
                            : `Зміни автомобіля #${savedVehicleId} успішно збережено.`}

                        {' '}Дані збережено в PostgreSQL.
                    </span>
                </div>
            )}

            {/* ===================================
                УСПІШНЕ ВИДАЛЕННЯ
            =================================== */}

            {deletedVehicleName && (
                <div
                    role="status"
                    className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800 dark:border-green-900 dark:bg-green-500/10 dark:text-green-400"
                >
                    <CheckCircle2
                        size={20}
                        className="shrink-0"
                    />

                    <span>
                        Автомобіль {deletedVehicleName}
                        {' '}успішно видалено з PostgreSQL.
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setDeletedVehicleName('')
                        }
                        aria-label="Закрити повідомлення"
                        className="ml-auto rounded-lg p-1 hover:bg-green-100 dark:hover:bg-green-500/20"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* ===================================
                ПОШУК І ФІЛЬТРИ
            =================================== */}

            <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_220px] dark:border-gray-800 dark:bg-gray-900">

                <div className="relative">
                    <Search
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={event =>
                            setSearch(event.target.value)
                        }
                        placeholder="Пошук за маркою, моделлю, роком..."
                        aria-label="Пошук автомобілів"
                        className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 outline-none focus:border-yellow-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <select
                    aria-label="Фільтр за статусом"
                    value={statusFilter}
                    onChange={event =>
                        setStatusFilter(
                            event.target.value as StatusFilter
                        )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-yellow-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                    <option value="all">
                        Усі статуси
                    </option>

                    {VEHICLE_STATUSES.map(item => (
                        <option
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
                        </option>
                    ))}
                </select>

            </div>

            {/* ===================================
                ЛІЧИЛЬНИКИ
            =================================== */}

            <div className="flex flex-wrap items-center justify-between gap-3">

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Знайдено:{' '}
                    <strong>{filteredVehicles.length}</strong>
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Усього автомобілів: {vehicles.length}
                </p>

            </div>

            {/* ===================================
                СПИСОК АВТОМОБІЛІВ
            =================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

                {/* Заголовок таблиці */}
                <div className="hidden grid-cols-[minmax(0,2fr)_85px_110px_125px_250px] gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 xl:grid dark:border-gray-800 dark:bg-gray-800/50">

                    <span>Автомобіль</span>
                    <span>Рік</span>
                    <span>Ціна</span>
                    <span>Статус</span>
                    <span className="text-right">Дії</span>

                </div>

                {filteredVehicles.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 p-12 text-center">

                        <Truck
                            size={38}
                            className="text-gray-400"
                        />

                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Автомобілів не знайдено
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {vehicles.length === 0
                                ? 'Каталог порожній. Додай перший автомобіль.'
                                : 'Спробуй змінити пошук або статус.'}
                        </p>

                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">

                        {filteredVehicles.map(vehicle => {
                            const status = getVehicleStatus(
                                vehicle.status
                            );

                            return (
                                <article
                                    key={vehicle.id}
                                    className="grid gap-4 p-4 sm:p-5 xl:grid-cols-[minmax(0,2fr)_85px_110px_125px_250px] xl:items-center xl:px-6"
                                >

                                    {/* Фото та назва */}
                                    <div className="flex min-w-0 items-center gap-4">

                                        {vehicle.image ? (
                                            <img
                                                src={vehicle.image}
                                                alt={`${vehicle.brand} ${vehicle.model}`}
                                                loading="lazy"
                                                className="h-20 w-24 shrink-0 rounded-xl bg-gray-100 object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-gray-800">
                                                <ImageOff size={24} />
                                            </div>
                                        )}

                                        <div className="min-w-0">

                                            <h2 className="font-bold text-gray-900 dark:text-white">
                                                {vehicle.brand}{' '}
                                                {vehicle.model}
                                            </h2>

                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                {vehicle.bodyType}
                                                {' · '}ID: {vehicle.id}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                {numberFormatter.format(
                                                    vehicle.mileage
                                                )}{' '}
                                                км
                                            </p>

                                        </div>
                                    </div>

                                    {/* Рік */}
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        <span className="xl:hidden">
                                            Рік:{' '}
                                        </span>
                                        {vehicle.year}
                                    </p>

                                    {/* Ціна */}
                                    <p className="font-extrabold text-gray-950 dark:text-white">
                                        {priceFormatter.format(
                                            vehicle.price
                                        )}
                                    </p>

                                    {/* Статус */}
                                    <div>
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[status]}`}
                                        >
                                            {VEHICLE_STATUS_LABELS[status]}
                                        </span>
                                    </div>

                                    {/* Дії */}
                                    <div className="flex flex-wrap gap-2 xl:justify-end">

                                        {/* Редагування */}
                                        <Link
                                            to={`/admin/cars/${vehicle.id}/edit`}
                                            className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-3 py-2 text-sm font-bold text-gray-950 transition hover:bg-yellow-500"
                                        >
                                            <Pencil size={16} />
                                            Редагувати
                                        </Link>

                                        {/* Переглянути на сайті */}
                                        {status !== 'hidden' && (
                                            <Link
                                                to={`/cars/${getVehicleSlug(vehicle)}`}
                                                title="Відкрити на сайті"
                                                aria-label={`Відкрити ${vehicle.brand} ${vehicle.model} на сайті`}
                                                className="inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-700 transition hover:border-yellow-400 dark:border-gray-700 dark:text-gray-200"
                                            >
                                                <ArrowUpRight size={18} />
                                            </Link>
                                        )}

                                        {/* Видалити */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                askToDelete(vehicle)
                                            }
                                            aria-label={`Видалити ${vehicle.brand} ${vehicle.model}`}
                                            title="Видалити автомобіль"
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700 transition hover:border-red-400 hover:bg-red-100 dark:border-red-900 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                                        >
                                            <Trash2 size={16} />
                                            <span className="sm:hidden 2xl:inline">
                                                Видалити
                                            </span>
                                        </button>

                                    </div>

                                </article>
                            );
                        })}

                    </div>
                )}
            </section>

            {/* ===================================
                ПІДТВЕРДЖЕННЯ ВИДАЛЕННЯ
            =================================== */}

            {vehicleToDelete && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onKeyDown={event => {
                        if (
                            event.key === 'Escape' &&
                            !deleting
                        ) {
                            cancelDelete();
                        }
                    }}
                >
                    {/* Затемнення */}
                    <button
                        type="button"
                        disabled={deleting}
                        onClick={cancelDelete}
                        aria-label="Скасувати видалення"
                        className="absolute inset-0 cursor-default"
                    />

                    {/* Модальне вікно */}
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-car-title"
                        aria-describedby="delete-car-description"
                        className="relative z-10 w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8 dark:border-gray-700 dark:bg-gray-900"
                    >
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
                            <AlertTriangle size={28} />
                        </div>

                        <h2
                            id="delete-car-title"
                            className="text-2xl font-extrabold text-gray-950 dark:text-white"
                        >
                            Видалити автомобіль?
                        </h2>

                        <p
                            id="delete-car-description"
                            className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300"
                        >
                            Ти збираєшся назавжди видалити
                            автомобіль:
                        </p>

                        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">

                            <p className="font-extrabold text-gray-950 dark:text-white">
                                {vehicleToDelete.brand}{' '}
                                {vehicleToDelete.model}
                            </p>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {vehicleToDelete.year} рік
                                {' · '}
                                ID: {vehicleToDelete.id}
                                {' · '}
                                {priceFormatter.format(
                                    vehicleToDelete.price
                                )}
                            </p>

                        </div>

                        <p className="mt-4 text-sm font-semibold text-red-600 dark:text-red-400">
                            Цю дію не можна скасувати.
                            Запис буде видалено з PostgreSQL.
                        </p>

                        {deleteError && (
                            <p
                                role="alert"
                                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-500/10 dark:text-red-300"
                            >
                                {deleteError}
                            </p>
                        )}

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                            {/* Скасувати */}
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={cancelDelete}
                                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                            >
                                Скасувати
                            </button>

                            {/* Підтвердити */}
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => {
                                    void confirmDelete();
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
                            >
                                {deleting ? (
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Trash2 size={18} />
                                )}

                                {deleting
                                    ? 'Видаляємо...'
                                    : 'Так, видалити'}
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
