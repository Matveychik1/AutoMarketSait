
import {
    Link,
    Navigate,
    useParams,
} from 'react-router-dom';

import {
    ArrowLeft,
    Phone,
    Truck,
} from 'lucide-react';

import VehicleGallery from '../components/VehicleGallery';
import VehicleSpecifications from '../components/VehicleSpecifications';
import BodyDimensions from '../components/BodyDimensions';
import VehicleEquipment from '../components/VehicleEquipment';

import type { Vehicle } from '../types/vehicle';

import {
    getVehicleIdFromSlug,
    getVehicleSlug,
} from '../utils/vehicleSlug';

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
    // Параметр може бути ID або повним slug
    const { id } = useParams<{ id: string }>();

    const vehicleId = getVehicleIdFromSlug(id);

    const vehicle = vehicles.find(
        car => car.id === vehicleId
    );

    // Якщо автомобіль відсутній
    if (!vehicle) {
        return (
            <main className="am-seasonal-surface min-h-screen bg-gray-50 py-10 dark:bg-gray-950">

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Автомобіль не знайдено
                    </h1>

                    <Link
                        to="/catalog"
                        className="mt-6 inline-block rounded-xl bg-yellow-400 px-6 py-3 font-bold text-gray-950"
                    >
                        Повернутися до каталогу
                    </Link>

                </div>
            </main>
        );
    }

    // Правильна адреса автомобіля
    const canonicalSlug = getVehicleSlug(vehicle);

    // Старі URL /cars/1 автоматично перенаправляються
    if (id !== canonicalSlug) {
        return (
            <Navigate
                to={`/cars/${canonicalSlug}`}
                replace
            />
        );
    }

    // Фотографії автомобіля
    const images =
        vehicle.images && vehicle.images.length > 0
            ? vehicle.images
            : [vehicle.image];

    // Перевіряємо ID YouTube відео
    const youtubeId =
        vehicle.youtubeVideoId &&
        /^[a-zA-Z0-9_-]{11}$/.test(vehicle.youtubeVideoId)
            ? vehicle.youtubeVideoId
            : null;

    return (
        <main className="am-seasonal-surface min-h-screen bg-gray-50 py-10 dark:bg-gray-950">

            <div className="am-seasonal-content mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Повернення до каталогу */}
                <Link
                    to="/catalog"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-yellow-600 dark:text-gray-300"
                >
                    <ArrowLeft size={18} />

                    Назад до каталогу
                </Link>

                {/* Заголовок автомобіля */}
                <div className="mb-8">

                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                        {vehicle.brand} {vehicle.model}
                    </h1>

                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                        {vehicle.year} рік • {vehicle.bodyType} • {vehicle.fuelType}
                    </p>

                </div>

                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">

                    {/* Ліва частина сторінки */}
                    <div className="min-w-0 space-y-8">

                        {/* Фотогалерея */}
                        <VehicleGallery
                            key={vehicle.id}
                            images={images}
                            title={`${vehicle.brand} ${vehicle.model}`}
                        />

                        {/* Характеристики */}
                        <VehicleSpecifications
                            vehicle={vehicle}
                        />

                        {/* Розміри кузова */}
                        <BodyDimensions
                            dimensions={vehicle.bodyDimensions}
                        />

                        {/* Комплектація */}
                        <VehicleEquipment
                            equipment={vehicle.equipment}
                        />

                        {/* Опис автомобіля */}
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

                        {/* Відеоогляд YouTube */}
                        {youtubeId && (
                            <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">

                                <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">
                                    Відеоогляд автомобіля
                                </h2>

                                <div className="aspect-video overflow-hidden rounded-xl">

                                    <iframe
                                        title={`Відеоогляд ${vehicle.brand} ${vehicle.model}`}
                                        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        className="h-full w-full border-0"
                                    />

                                </div>

                                <a
                                    href={`https://www.youtube.com/watch?v=${youtubeId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-block font-semibold text-yellow-600 hover:underline dark:text-yellow-400"
                                >
                                    Дивитися на YouTube ↗
                                </a>

                            </section>
                        )}

                    </div>

                    {/* Права частина: ціна та контакти */}
                    <aside className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900 lg:sticky lg:top-24">

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Ціна автомобіля
                        </p>

                        <p className="mt-2 text-4xl font-extrabold text-gray-950 dark:text-white">
                            {priceFormatter.format(vehicle.price)}
                        </p>

                        {/* Безкоштовна доставка */}
                        <div className="mt-4 flex items-start gap-3 rounded-xl border border-yellow-400/40 bg-yellow-50 p-3 dark:bg-yellow-400/10">

                            <Truck
                                size={20}
                                className="mt-0.5 shrink-0 text-yellow-600 dark:text-yellow-400"
                            />

                            <p className="text-sm font-semibold text-gray-900 dark:text-yellow-300">
                                Безкоштовна доставка по всій Україні
                            </p>

                        </div>

                        {/* Телефони */}
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
