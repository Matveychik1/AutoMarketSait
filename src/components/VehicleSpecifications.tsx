
import {
    CalendarDays,
    Gauge,
    Fuel,
    Truck,
    Settings2,
    Weight,
    Zap,
    Cog,
} from 'lucide-react';

import type { Vehicle } from '../types/vehicle';

type Props = {
    vehicle: Vehicle;
};

export default function VehicleSpecifications({
                                                  vehicle,
                                              }: Props) {
    const specifications = [
        {
            label: 'Рік випуску',
            value: String(vehicle.year),
            icon: CalendarDays,
        },
        {
            label: 'Пробіг',
            value: `${vehicle.mileage.toLocaleString('uk-UA')} км`,
            icon: Gauge,
        },
        {
            label: 'Тип кузова',
            value: vehicle.bodyType,
            icon: Truck,
        },
        {
            label: 'Паливо',
            value: vehicle.fuelType,
            icon: Fuel,
        },
        {
            label: "Об'єм двигуна",
            value: vehicle.engineVolume === null
                ? undefined
                : `${vehicle.engineVolume} л`,
            icon: Cog,
        },
        {
            label: 'Коробка передач',
            value: vehicle.transmission,
            icon: Settings2,
        },
        {
            label: 'Привід',
            value: vehicle.drivetrain,
            icon: Truck,
        },
        {
            label: 'Потужність',
            value: vehicle.powerHp
                ? `${vehicle.powerHp} к.с.`
                : undefined,
            icon: Zap,
        },
        {
            label: 'Вантажопідйомність',
            value: vehicle.payloadKg
                ? `${vehicle.payloadKg.toLocaleString('uk-UA')} кг`
                : undefined,
            icon: Weight,
        },
        {
            label: 'Повна маса',
            value: vehicle.grossWeightKg
                ? `${vehicle.grossWeightKg.toLocaleString('uk-UA')} кг`
                : undefined,
            icon: Weight,
        },
    ];

    const visibleSpecifications = specifications.filter(
        item => item.value !== undefined && item.value !== ''
    );

    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                Технічні характеристики
            </h2>

            <dl className="grid gap-4 sm:grid-cols-2">
                {visibleSpecifications.map(spec => {
                    const Icon = spec.icon;

                    return (
                        <div
                            key={spec.label}
                            className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                        >
                            <div className="rounded-xl bg-yellow-400 p-3 text-gray-950">
                                <Icon size={20} />
                            </div>

                            <div className="min-w-0">
                                <dt className="text-xs text-gray-500 dark:text-gray-400">
                                    {spec.label}
                                </dt>

                                <dd className="mt-1 break-words font-bold text-gray-900 dark:text-white">
                                    {spec.value}
                                </dd>
                            </div>
                        </div>
                    );
                })}
            </dl>
        </section>
    );
}
