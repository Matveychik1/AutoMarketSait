
import type { Vehicle } from '../types/vehicle';

type VehicleCardProps = {
    vehicle: Vehicle;
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

    return (
        <article className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none dark:border-gray-700 dark:bg-gray-800">

            {/* Фото автомобіля */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                    src={image}
                    alt={`${brand} ${model}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
                />

                <span className="absolute left-3 top-3 rounded-lg bg-yellow-400 px-3 py-1 text-xs font-bold text-gray-950 shadow-md">
                    {year}
                </span>
            </div>

            {/* Контент */}
            <div className="flex flex-1 flex-col gap-4 p-5">

                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {brand} {model}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Комерційний автомобіль
                    </p>
                </div>

                {/* Характеристики */}
                <ul className="flex flex-wrap gap-2">

                    <li className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {numberFormatter.format(mileage)} км
                    </li>

                    <li className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {bodyType}
                    </li>

                    <li className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {engineVolume != null
                            ? `${engineVolume} л`
                            : 'Електро'}
                    </li>

                    <li className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {fuelType}
                    </li>
                </ul>

                {/* Ціна та кнопка */}
                <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-700">

                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                        Ціна автомобіля
                    </p>

                    <p className="mb-4 text-2xl font-extrabold text-gray-900 dark:text-white">
                        {priceFormatter.format(price)}
                    </p>

                    <button
                        type="button"
                        onClick={() => onDetailsClick?.(vehicle)}
                        className="w-full rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-950 transition hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
                    >
                        Детальніше
                    </button>
                </div>
            </div>
        </article>
    );
}
