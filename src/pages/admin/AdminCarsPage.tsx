
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
    ArrowUpRight,
    CheckCircle2,
    Pencil,
    Plus,
    Search,
    Truck,
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

type Props = {
    vehicles: Vehicle[];
};

type StatusFilter = 'all' | VehicleStatus;

const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('uk-UA');

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

export default function AdminCarsPage({ vehicles }: Props) {
    const location = useLocation();


    const navigationState = location.state as {
        savedVehicleId?: number;
        createdVehicle?: boolean;
    } | null;

    const savedVehicleId = navigationState?.savedVehicleId;

    const createdVehicle = navigationState?.createdVehicle === true;


    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>('all');

    const filteredVehicles = useMemo(() => {
        const query = search.trim().toLowerCase();

        return [...vehicles]
            .filter(vehicle => {
                if (
                    statusFilter !== 'all' &&
                    getVehicleStatus(vehicle.status) !== statusFilter
                ) {
                    return false;
                }

                if (!query) return true;

                const text = [
                    vehicle.brand,
                    vehicle.model,
                    vehicle.year,
                    vehicle.bodyType,
                    vehicle.id,
                ].join(' ').toLowerCase();

                return text.includes(query);
            })
            .sort((a, b) =>
                b.addedAt.localeCompare(a.addedAt)
            );
    }, [vehicles, search, statusFilter]);

    return (
        <div className="space-y-7">

            {/* ЗАГОЛОВОК */}
            <div className="flex flex-wrap items-start justify-between gap-4">

                <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                        Керування каталогом
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold text-gray-950 sm:text-4xl dark:text-white">
                        Автомобілі
                    </h1>

                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                        Редагування автомобілів та керування статусами.
                    </p>
                </div>

                <Link
                    to="/admin/cars/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-gray-950 hover:bg-yellow-500"
                >
                    <Plus size={19} />
                    Додати автомобіль
                </Link>
            </div>

            {/* ПОВІДОМЛЕННЯ ПРО ЗБЕРЕЖЕННЯ */}
            {savedVehicleId !== undefined && (
                <div
                    role="status"
                    className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800 dark:border-green-900 dark:bg-green-500/10 dark:text-green-400"
                >
                    <CheckCircle2 size={20} />

                    {createdVehicle
                        ? `Автомобіль #${savedVehicleId} успішно додано до каталогу.`
                        : `Зміни автомобіля #${savedVehicleId} збережено.`}

                    <span>
    Дані доступні до перезавантаження сторінки.
</span>

                </div>
            )}

            {/* ПОШУК І ФІЛЬТРИ */}
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
                    <option value="all">Усі статуси</option>

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

            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Знайдено: <strong>{filteredVehicles.length}</strong>
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Усього автомобілів: {vehicles.length}
                </p>
            </div>

            {/* ТАБЛИЦЯ */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

                <div className="hidden grid-cols-[minmax(0,2fr)_105px_125px_145px_160px] gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 xl:grid dark:border-gray-800 dark:bg-gray-800/50">
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
                            Спробуй змінити пошук або статус.
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
                                    className="grid gap-4 p-4 sm:p-5 xl:grid-cols-[minmax(0,2fr)_105px_125px_145px_160px] xl:items-center xl:px-6"
                                >

                                    <div className="flex min-w-0 items-center gap-4">

                                        <img
                                            src={vehicle.image}
                                            alt={`${vehicle.brand} ${vehicle.model}`}
                                            loading="lazy"
                                            className="h-20 w-24 shrink-0 rounded-xl bg-gray-100 object-cover"
                                        />

                                        <div className="min-w-0">

                                            <h2 className="font-bold text-gray-900 dark:text-white">
                                                {vehicle.brand} {vehicle.model}
                                            </h2>

                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                {vehicle.bodyType} · ID: {vehicle.id}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                {numberFormatter.format(vehicle.mileage)} км
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        <span className="xl:hidden">Рік: </span>
                                        {vehicle.year}
                                    </p>

                                    <p className="font-extrabold text-gray-950 dark:text-white">
                                        {priceFormatter.format(vehicle.price)}
                                    </p>

                                    <div>
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[status]}`}
                                        >
                                            {VEHICLE_STATUS_LABELS[status]}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 xl:justify-end">

                                        <Link
                                            to={`/admin/cars/${vehicle.id}/edit`}
                                            className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-3 py-2 text-sm font-bold text-gray-950 hover:bg-yellow-500"
                                        >
                                            <Pencil size={16} />
                                            Редагувати
                                        </Link>

                                        <Link
                                            to={`/cars/${getVehicleSlug(vehicle)}`}
                                            title="Відкрити на сайті"
                                            aria-label={`Відкрити ${vehicle.brand} ${vehicle.model} на сайті`}
                                            className="inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-700 hover:border-yellow-400 dark:border-gray-700 dark:text-gray-200"
                                        >
                                            <ArrowUpRight size={18} />
                                        </Link>

                                    </div>

                                </article>
                            );
                        })}

                    </div>
                )}
            </section>
        </div>
    );
}
