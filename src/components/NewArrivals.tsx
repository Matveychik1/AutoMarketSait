
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
} from 'lucide-react';

import VehicleCard from './VehicleCard';
import type { Vehicle } from '../types/vehicle';

type NewArrivalsProps = {
    vehicles: Vehicle[];
};

export default function NewArrivals({
                                        vehicles,
                                    }: NewArrivalsProps) {
    const navigate = useNavigate();
    const carouselRef = useRef<HTMLDivElement>(null);

    // Найновіші додані автомобілі першими
    const sortedVehicles = [...vehicles].sort(
        (a, b) => b.addedAt.localeCompare(a.addedAt)
    );

    function scrollCarousel(direction: 'left' | 'right') {
        const carousel = carouselRef.current;

        if (!carousel) return;

        const reducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        carousel.scrollBy({
            left: direction === 'left' ? -312 : 312,
            behavior: reducedMotion ? 'auto' : 'smooth',
        });
    }

    return (
        <section className="bg-gray-50 py-16 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Заголовок */}
                <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                            Нові надходження
                        </h2>

                        <p className="mt-3 text-gray-500 dark:text-gray-400">
                            Останні додані автомобілі в нашому каталозі
                        </p>
                    </div>

                    {/* Стрілки каруселі */}
                    {vehicles.length > 1 && (
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => scrollCarousel('left')}
                                aria-label="Прокрутити автомобілі вліво"
                                className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-900 transition hover:border-yellow-400 hover:bg-yellow-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-yellow-400 dark:hover:text-gray-950"
                            >
                                <ChevronLeft size={22} />
                            </button>

                            <button
                                type="button"
                                onClick={() => scrollCarousel('right')}
                                aria-label="Прокрутити автомобілі вправо"
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-gray-950 transition hover:bg-yellow-500"
                            >
                                <ChevronRight size={22} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Автомобілі */}
                {sortedVehicles.length > 0 ? (
                    <div
                        ref={carouselRef}
                        aria-label="Нові надходження автомобілів"
                        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {sortedVehicles.map(vehicle => (
                            <div
                                key={vehicle.id}
                                className="w-72 shrink-0 snap-start"
                            >
                                <VehicleCard
                                    vehicle={vehicle}
                                    onDetailsClick={selected => {
                                        navigate(`/cars/${selected.id}`);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="py-10 text-gray-500 dark:text-gray-400">
                        Автомобілів поки немає.
                    </p>
                )}

                {/* Посилання на каталог */}
                <div className="mt-6 flex justify-center">
                    <Link
                        to="/catalog"
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-yellow-400 px-7 py-3 font-bold text-gray-900 transition hover:bg-yellow-400 hover:text-gray-950 dark:text-white"
                    >
                        Переглянути весь каталог
                        <ArrowUpRight size={19} />
                    </Link>
                </div>

            </div>
        </section>
    );
}
