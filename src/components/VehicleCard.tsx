
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageOff } from 'lucide-react';

import type { Vehicle } from '../types/vehicle';
import { getVehicleSlug } from '../utils/vehicleSlug';

// Необов'язкове зменшене фото для майбутнього API
type VehicleWithThumbnail = Vehicle & {
    thumbnailUrl?: string;
};

type VehicleCardProps = {
    vehicle: VehicleWithThumbnail;
    onDetailsClick?: (vehicle: Vehicle) => void;
};

const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('uk-UA');

export default function VehicleCard({
                                        vehicle,
                                        onDetailsClick,
                                    }: VehicleCardProps) {
    const navigate = useNavigate();

    const [failedImage, setFailedImage] = useState<string | null>(
        null
    );

    const {
        brand,
        model,
        year,
        price,
        mileage,
        bodyType,
        engineVolume,
        fuelType,
        image,
    } = vehicle;

    // Якщо є окрема оптимізована обкладинка,
    // використовуємо її замість оригіналу
    const coverImage = vehicle.thumbnailUrl || image;

    const imageHasError =
        !coverImage || failedImage === coverImage;

    function handleDetailsClick() {
        if (onDetailsClick) {
            onDetailsClick(vehicle);
            return;
        }

        // Запасний перехід, якщо callback не переданий
        navigate(`/cars/${getVehicleSlug(vehicle)}`);
    }

    return (
        <article className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none dark:border-gray-700 dark:bg-gray-800">

            {/* ===================================
                ФОТО АВТОМОБІЛЯ
            =================================== */}

            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-700">

                {imageHasError ? (
                    <div
                        className="flex h-full w-full flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-500"
                        role="img"
                        aria-label={`Фото ${brand} ${model} відсутнє`}
                    >
                        <ImageOff size={36} />

                        <span className="text-sm font-medium">
                            Фото недоступне
                        </span>
                    </div>
                ) : (
                    <img
                        src={coverImage}
                        alt={`${brand} ${model}, ${year} рік`}
                        loading="lazy"
                        decoding="async"
                        onError={() => setFailedImage(coverImage)}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                    />
                )}

                {/* Рік випуску */}
                <span className="absolute left-3 top-3 rounded-lg bg-yellow-400 px-3 py-1 text-xs font-bold text-gray-950 shadow-md">
                    {year}
                </span>
            </div>

            {/* ===================================
                КОНТЕНТ КАРТКИ
            =================================== */}

            <div className="flex flex-1 flex-col gap-4 p-5">

                {/* Марка та модель */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {brand} {model}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Комерційний автомобіль
                    </p>
                </div>

                {/* ===================================
                    ХАРАКТЕРИСТИКИ
                =================================== */}

                <ul className="flex flex-wrap gap-2">

                    {/* Пробіг */}
                    <li className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {numberFormatter.format(mileage)} км
                    </li>

                    {/* Тип кузова */}
                    <li className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {bodyType}
                    </li>

                    {/* Об'єм двигуна */}
                    <li className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {engineVolume != null
                            ? `${engineVolume} л`
                            : fuelType === 'Дизель'
                                ? 'Дизельнийдвигун'
                                : 'Не вказано'}
                    </li>

                    {/* Паливо */}
                    <li className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {fuelType}
                    </li>

                </ul>

                {/* ===================================
                    ЦІНА ТА КНОПКА
                =================================== */}

                <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-700">

                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                        Ціна автомобіля
                    </p>

                    <p className="mb-4 text-2xl font-extrabold text-gray-900 dark:text-white">
                        {priceFormatter.format(price)}
                    </p>

                    <button
                        type="button"
                        onClick={handleDetailsClick}
                        aria-label={`Детальніше про ${brand} ${model} ${year}`}
                        className="w-full rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-950 transition hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
                    >
                        Детальніше
                    </button>

                </div>
            </div>
        </article>
    );
}
