
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';

import VehicleGallery from '../components/VehicleGallery';
import type { Vehicle } from '../types/vehicle';

type CarDetailsPageProps = {
    vehicles: Vehicle[];
};

const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

export default function CarDetailsPage({
                                           vehicles,
                                       }: CarDetailsPageProps) {
    const { id } = useParams<{ id: string }>();

    const vehicle = vehicles.find(
        item => String(item.id) === id
    );

    if (!vehicle) {
        return (
            <main className="min-h-[60vh] bg-gray-50 px-4 py-20 text-center dark:bg-gray-950">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Автомобіль не знайдено
                </h1>

                <Link
                    to="/catalog"
                    className="mt-6 inline-block rounded-xl bg-yellow-400 px-6 py-3 font-bold text-gray-950"
                >
                    Повернутися до каталогу
                </Link>
            </main>
        );
    }

    const images =
        vehicle.images && vehicle.images.length > 0
            ? vehicle.images
            : [vehicle.image];

    const details = [
        ['Рік випуску', String(vehicle.year)],
        ['Пробіг', `${vehicle.mileage.toLocaleString('uk-UA')} км`],
        ['Тип кузова', vehicle.bodyType],
        ['Паливо', vehicle.fuelType],
        [
            "Об'єм двигуна",
            vehicle.engineVolume != null
                ? `${vehicle.engineVolume} л`
                : 'Не застосовується',
        ],
    ];

    return (
        <main className="min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <Link
                    to="/catalog"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-yellow-600 dark:text-gray-300"
                >
                    <ArrowLeft size={18} />
                    Назад до каталогу
                </Link>

                <h1 className="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                    {vehicle.brand} {vehicle.model}
                </h1>

                <p className="mb-8 text-gray-500 dark:text-gray-400">
                    {vehicle.year} • {vehicle.bodyType} • {vehicle.fuelType}
                </p>

                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">

                    <div className="min-w-0 space-y-8">

                        {/* Фотогалерея */}
                        <VehicleGallery
                            key={vehicle.id}
                            images={images}
                            title={`${vehicle.brand} ${vehicle.model}`}
                        />

                        {/* Характеристики */}
                        <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                                Характеристики
                            </h2>

                            <dl className="grid gap-4 sm:grid-cols-2">
                                {details.map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                                    >
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">
                                            {label}
                                        </dt>

                                        <dd className="mt-1 font-bold text-gray-900 dark:text-white">
                                            {value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </section>

                        {/* Опис */}
                        {vehicle.description && (
                            <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
                                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                                    Опис автомобіля
                                </h2>

                                <p className="whitespace-pre-line leading-7 text-gray-600 dark:text-gray-300">
                                    {vehicle.description}
                                </p>
                            </section>
                        )}

                        {/* Відеоогляд */}
                        {vehicle.youtubeVideoId && (
                            <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
                                <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">
                                    Відеоогляд
                                </h2>

                                <div className="aspect-video overflow-hidden rounded-xl">
                                    <iframe
                                        title={`Відеоогляд ${vehicle.brand} ${vehicle.model}`}
                                        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(vehicle.youtubeVideoId)}`}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        className="h-full w-full border-0"
                                    />
                                </div>

                                <a
                                    href={`https://www.youtube.com/watch?v=${encodeURIComponent(vehicle.youtubeVideoId)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-block font-semibold text-yellow-600 hover:underline dark:text-yellow-400"
                                >
                                    Переглянути на YouTube ↗
                                </a>
                            </section>
                        )}
                    </div>

                    {/* Ціна */}
                    <aside className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900 lg:sticky lg:top-24">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Ціна автомобіля
                        </p>

                        <p className="mt-2 text-4xl font-extrabold text-gray-950 dark:text-white">
                            {priceFormatter.format(vehicle.price)}
                        </p>

                        <div className="mt-6 space-y-3">
                            <a
                                href="tel:+380671002124"
                                className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-4 font-bold text-gray-950 hover:bg-yellow-500"
                            >
                                <Phone size={19} />
                                067 100 21 24
                            </a>

                            <a
                                href="tel:+380502002124"
                                className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-4 font-semibold text-gray-900 hover:border-yellow-400 dark:border-gray-700 dark:text-white"
                            >
                                <Phone size={19} />
                                050 200 21 24
                            </a>
                        </div>
                    </aside>

                </div>
            </div>
        </main>
    );
}
