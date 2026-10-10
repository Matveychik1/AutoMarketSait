
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';

import VehicleGallery from '../components/VehicleGallery';
import VehicleSpecifications from '../components/VehicleSpecifications';
import BodyDimensions from '../components/BodyDimensions';
import VehicleEquipment from '../components/VehicleEquipment';

import type { Vehicle } from '../types/vehicle';

type Props = {
    vehicles: Vehicle[];
};

const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

export default function CarDetailsPage({
                                           vehicles,
                                       }: Props) {
    const { id } = useParams<{ id: string }>();

    const vehicle = vehicles.find(
        car => String(car.id) === id
    );

    if (!vehicle) {
        return (
            <main className="am-seasonal-surface min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
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

    return (
        <main className="min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Назад до каталогу */}
                <Link
                    to="/catalog"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-yellow-600 dark:text-gray-300"
                >
                    <ArrowLeft size={18} />
                    Назад до каталогу
                </Link>

                {/* Заголовок */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                        {vehicle.brand} {vehicle.model}
                    </h1>

                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                        {vehicle.year} рік • {vehicle.bodyType} • {vehicle.fuelType}
                    </p>
                </div>

                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">

                    {/* Основна інформація */}
                    <div className="min-w-0 space-y-8">

                        <VehicleGallery
                            key={vehicle.id}
                            images={images}
                            title={`${vehicle.brand} ${vehicle.model}`}
                        />

                        <VehicleSpecifications vehicle={vehicle} />

                        <BodyDimensions
                            dimensions={vehicle.bodyDimensions}
                        />

                        <VehicleEquipment
                            equipment={vehicle.equipment}
                        />

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

                        {/* Необов'язковий YouTube-огляд */}
                        {vehicle.youtubeVideoId && (
                            <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
                                <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">
                                    Відеоогляд автомобіля
                                </h2>

                                <div className="aspect-video overflow-hidden rounded-xl">
                                    <iframe
                                        title={`Відеоогляд ${vehicle.brand} ${vehicle.model}`}
                                        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(vehicle.youtubeVideoId)}`}
                                        loading="lazy"
                                        allowFullScreen
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
                                    Дивитися на YouTube ↗
                                </a>
                            </section>
                        )}

                    </div>

                    {/* Ціна та контакти */}
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
                                className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-4 font-bold text-gray-950 transition hover:bg-yellow-500"
                            >
                                <Phone size={19} />
                                067 100 21 24
                            </a>

                            <a
                                href="tel:+380502002124"
                                className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-4 font-semibold text-gray-900 transition hover:border-yellow-400 dark:border-gray-700 dark:text-white"
                            >
                                <Phone size={19} />
                                050 200 21 24
                            </a>
                        </div>

                        <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400">
                            AutoMarket Rivne
                        </p>
                    </aside>

                </div>
            </div>
        </main>
    );
}
