
import { useNavigate } from 'react-router-dom';

import VehicleCard from '../vehicle/VehicleCard.tsx';

import type { Vehicle } from '../../types/vehicle';

import { getVehicleSlug } from '../../utils/vehicleSlug';

type CatalogGridProps = {
    vehicles: Vehicle[];
    onResetFilters: () => void;
};

export default function CatalogGrid({
                                        vehicles,
                                        onResetFilters,
                                    }: CatalogGridProps) {
    const navigate = useNavigate();

    function openVehicle(vehicle: Vehicle) {
        navigate(`/cars/${getVehicleSlug(vehicle)}`);
    }

    // Якщо за вибраними фільтрами нічого немає
    if (vehicles.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-800 dark:bg-gray-900">

                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Автомобілі не знайдено
                </h3>

                <p className="mt-3 text-gray-500 dark:text-gray-400">
                    Спробуйте змінити параметри пошуку.
                </p>

                <button
                    type="button"
                    onClick={onResetFilters}
                    className="mt-6 rounded-xl bg-yellow-400 px-6 py-3 font-bold text-gray-950 transition hover:bg-yellow-500"
                >
                    Показати всі автомобілі
                </button>

            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map(vehicle => (
                <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onDetailsClick={openVehicle}
                />
            ))}
        </div>
    );
}
