
import { Link } from 'react-router-dom';

import {
    ArrowRight,
    Banknote,
    Images,
    LayoutGrid,
    Truck,
} from 'lucide-react';

import type { Vehicle } from '../../types/vehicle.ts';
import { getVehicleSlug } from '../../utils/vehicleSlug.ts';

type Props = {
    vehicles: Vehicle[];
};

const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

export default function AdminDashboard({
                                           vehicles,
                                       }: Props) {
    const totalCars = vehicles.length;

    const totalBrands = new Set(
        vehicles.map(vehicle => vehicle.brand)
    ).size;

    const totalValue = vehicles.reduce(
        (sum, vehicle) => sum + vehicle.price,
        0
    );

    const totalPhotos = vehicles.reduce(
        (sum, vehicle) => {
            const photoCount = vehicle.images?.length;

            return sum + (
                photoCount && photoCount > 0
                    ? photoCount
                    : vehicle.image ? 1 : 0
            );
        },
        0
    );

    const latestVehicles = [...vehicles]
        .sort((a, b) =>
            b.addedAt.localeCompare(a.addedAt)
        )
        .slice(0, 5);

    const stats = [
        {
            label: 'Автомобілі',
            value: String(totalCars),
            icon: Truck,
        },
        {
            label: 'Марки',
            value: String(totalBrands),
            icon: LayoutGrid,
        },
        {
            label: 'Вартість усіх авто',
            value: priceFormatter.format(totalValue),
            icon: Banknote,
        },
        {
            label: 'Фотографії',
            value: String(totalPhotos),
            icon: Images,
        },
    ];

    return (
        <div className="space-y-8">

            {/* Заголовок */}
            <div className="flex flex-wrap items-start justify-between gap-4">

                <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                        Огляд
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold text-gray-950 sm:text-4xl dark:text-white">
                        Головна панель
                    </h1>

                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                        Основна інформація про каталог AutoMarket Rivne
                    </p>
                </div>

                <Link
                    to="/admin/cars"
                    className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-950 transition hover:bg-yellow-500"
                >
                    Усі автомобілі
                    <ArrowRight size={18} />
                </Link>
            </div>

            {/* Статистика */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {stats.map(stat => {
                    const Icon = stat.icon;

                    return (
                        <article
                            key={stat.label}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-600 dark:text-yellow-400">
                                <Icon size={24} />
                            </div>

                            <p className="mt-5 text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white">
                                {stat.value}
                            </p>

                            <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {stat.label}
                            </p>
                        </article>
                    );
                })}

            </div>

            {/* Останні автомобілі */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-6 dark:border-gray-800">

                    <div>
                        <h2 className="text-xl font-extrabold text-gray-950 dark:text-white">
                            Останні додані автомобілі
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Найновіші записи тестового каталогу
                        </p>
                    </div>

                    <Link
                        to="/admin/cars"
                        className="inline-flex items-center gap-2 text-sm font-bold text-yellow-600 hover:underline dark:text-yellow-400"
                    >
                        Переглянути всі
                        <ArrowRight size={17} />
                    </Link>
                </div>

                {latestVehicles.length === 0 ? (
                    <p className="p-8 text-gray-500 dark:text-gray-400">
                        Автомобілів поки немає.
                    </p>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">

                        {latestVehicles.map(vehicle => (
                            <div
                                key={vehicle.id}
                                className="flex items-center gap-4 p-4 sm:p-5"
                            >

                                <img
                                    src={vehicle.image}
                                    alt={`${vehicle.brand} ${vehicle.model}`}
                                    loading="lazy"
                                    className="h-16 w-20 shrink-0 rounded-xl bg-gray-100 object-cover sm:h-20 sm:w-28"
                                />

                                <div className="min-w-0 flex-1">

                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {vehicle.brand} {vehicle.model}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {vehicle.year} рік • {vehicle.bodyType}
                                    </p>

                                    <p className="mt-2 text-sm font-extrabold text-gray-900 dark:text-white">
                                        {priceFormatter.format(vehicle.price)}
                                    </p>
                                </div>

                                <Link
                                    to={`/cars/${getVehicleSlug(vehicle)}`}
                                    aria-label={`Переглянути ${vehicle.brand} ${vehicle.model} на сайті`}
                                    title="Відкрити автомобіль на сайті"
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition hover:bg-yellow-400 hover:text-gray-950 dark:bg-gray-800 dark:text-gray-200"
                                >
                                    <ArrowRight size={19} />
                                </Link>

                            </div>
                        ))}

                    </div>
                )}
            </section>

            {/* Інформація про демоверсію */}
            <div className="rounded-2xl border border-yellow-400/40 bg-yellow-50 p-5 dark:bg-yellow-400/10">
                <p className="font-bold text-gray-900 dark:text-yellow-400">
                    Демонстраційні дані
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Зараз автомобілі завантажуються з App.tsx.
                    Після створення ASP.NET Core API
                    статистика та список оновлюватимуться
                    з PostgreSQL.
                </p>
            </div>

        </div>
    );
}
