
import {useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
    Search,
    SlidersHorizontal,
    RotateCcw,
    ChevronDown,
    ChevronUp,
    Truck,
} from 'lucide-react';

import VehicleCard from '../components/VehicleCard';
import BodyTypeSelector from '../components/BodyTypeSelector';

import type { Vehicle } from '../types/vehicle';
import { getVehicleSlug } from '../utils/vehicleSlug';

// ========================================
// ТИПИ
// ========================================

type CatalogPageProps = {
    vehicles: Vehicle[];
};

type SortOrder =
    | 'dateDesc'
    | 'dateAsc'
    | 'yearDesc'
    | 'yearAsc'
    | 'priceAsc'
    | 'priceDesc';

type Filters = {
    search: string;
    brand: string;
    bodyType: string;
    fuelType: string;
    engineVolume: string;
    minPrice: string;
    maxPrice: string;
    minYear: string;
    maxYear: string;
    sortOrder: SortOrder;
};

// ========================================
// ВАРІАНТИ СОРТУВАННЯ
// ========================================

const sortOrders: SortOrder[] = [
    'dateDesc',
    'dateAsc',
    'yearDesc',
    'yearAsc',
    'priceAsc',
    'priceDesc',
];

// ========================================
// ФІЛЬТРИ ЗА ЗАМОВЧУВАННЯМ
// ========================================

function createDefaultFilters(): Filters {
    return {
        search: '',
        brand: '',
        bodyType: '',
        fuelType: '',
        engineVolume: '',
        minPrice: '',
        maxPrice: '',
        minYear: '',
        maxYear: '',
        sortOrder: 'dateDesc',
    };
}

// ========================================
// ЗЧИТУВАННЯ ФІЛЬТРІВ З URL
// ========================================

function readFiltersFromUrl(
    params: URLSearchParams
): Filters {
    const sort = params.get('sortOrder');

    return {
        search: params.get('search') ?? '',
        brand: params.get('brand') ?? '',
        bodyType: params.get('bodyType') ?? '',
        fuelType: params.get('fuelType') ?? '',
        engineVolume: params.get('engineVolume') ?? '',
        minPrice: params.get('minPrice') ?? '',
        maxPrice: params.get('maxPrice') ?? '',
        minYear: params.get('minYear') ?? '',
        maxYear: params.get('maxYear') ?? '',

        sortOrder:
            sort && sortOrders.includes(sort as SortOrder)
                ? (sort as SortOrder)
                : 'dateDesc',
    };
}

// ========================================
// ЗБЕРЕЖЕННЯ ФІЛЬТРІВ В URL
// ========================================

function createFilterSearchParams(
    filters: Filters
): URLSearchParams {
    const params = new URLSearchParams();

    const fields: Array<keyof Omit<Filters, 'sortOrder'>> = [
        'search',
        'brand',
        'bodyType',
        'fuelType',
        'engineVolume',
        'minPrice',
        'maxPrice',
        'minYear',
        'maxYear',
    ];

    fields.forEach(field => {
        const value = filters[field].trim();

        if (value) {
            params.set(field, value);
        }
    });

    if (filters.sortOrder !== 'dateDesc') {
        params.set('sortOrder', filters.sortOrder);
    }

    return params;
}

// ========================================
// ГОЛОВНА СТОРІНКА КАТАЛОГУ
// ========================================

export default function CatalogPage({
                                        vehicles,
                                    }: CatalogPageProps) {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const queryString = searchParams.toString();

    // Застосовані фільтри відповідають URL
    const appliedFilters = useMemo(() => {
        return readFiltersFromUrl(
            new URLSearchParams(queryString)
        );
    }, [queryString]);

    // Фільтри, які користувач зараз редагує
    const [draftFilters, setDraftFilters] = useState<Filters>(
        () => readFiltersFromUrl(searchParams)
    );

    // Панель фільтрів спочатку закрита
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Синхронізація при переході з футера,
    // зміні URL або натисканні "Назад"
    // Запам'ятовуємо поточні параметри URL
    const [lastQueryString, setLastQueryString] = useState(queryString);

// Якщо URL змінився — синхронізуємо фільтри
    if (queryString !== lastQueryString) {
        setLastQueryString(queryString);
        setDraftFilters(appliedFilters);
        setIsFiltersOpen(false);
    }

    // ========================================
    // ДОСТУПНІ ЗНАЧЕННЯ ФІЛЬТРІВ
    // ========================================

    const brands = [
        ...new Set(
            vehicles.map(vehicle => vehicle.brand)
        ),
    ].sort();

    const fuelTypes = [
        ...new Set(
            vehicles.map(vehicle => vehicle.fuelType)
        ),
    ].sort();

    const engineVolumes = [
        ...new Set(
            vehicles
                .map(vehicle => vehicle.engineVolume)
                .filter(
                    (volume): volume is number =>
                        volume !== null
                )
        ),
    ].sort((a, b) => a - b);

    // ========================================
    // ЗМІНА ФІЛЬТРІВ
    // ========================================

    function updateFilter<K extends keyof Filters>(
        key: K,
        value: Filters[K]
    ) {
        setDraftFilters(previous => ({
            ...previous,
            [key]: value,
        }));
    }

    // Застосувати фільтри
    function applyFilters() {
        const params = createFilterSearchParams(draftFilters);

        setSearchParams(params);
        setIsFiltersOpen(false);
    }

    // Очистити фільтри
    function resetFilters() {
        setDraftFilters(createDefaultFilters());
        setSearchParams({});
        setIsFiltersOpen(false);
    }

    // ========================================
    // ПЕРЕВІРКА ДІАПАЗОНІВ
    // ========================================

    const invalidPriceRange =
        draftFilters.minPrice !== '' &&
        draftFilters.maxPrice !== '' &&
        Number(draftFilters.minPrice) >
        Number(draftFilters.maxPrice);

    const invalidYearRange =
        draftFilters.minYear !== '' &&
        draftFilters.maxYear !== '' &&
        Number(draftFilters.minYear) >
        Number(draftFilters.maxYear);

    const hasInvalidRange =
        invalidPriceRange || invalidYearRange;

    // ========================================
    // ФІЛЬТРАЦІЯ ТА СОРТУВАННЯ
    // ========================================

    const filteredVehicles = useMemo(() => {
        const filters = appliedFilters;

        const result = vehicles.filter(vehicle => {
            const fullName =
                `${vehicle.brand} ${vehicle.model}`.toLowerCase();

            // Пошук за маркою та моделлю
            if (
                !fullName.includes(
                    filters.search.toLowerCase().trim()
                )
            ) {
                return false;
            }

            // Марка
            if (
                filters.brand &&
                vehicle.brand !== filters.brand
            ) {
                return false;
            }

            // Тип кузова
            if (
                filters.bodyType &&
                vehicle.bodyType !== filters.bodyType
            ) {
                return false;
            }

            // Паливо
            if (
                filters.fuelType &&
                vehicle.fuelType !== filters.fuelType
            ) {
                return false;
            }

            // Об'єм двигуна
            if (
                filters.engineVolume &&
                vehicle.engineVolume !==
                Number(filters.engineVolume)
            ) {
                return false;
            }

            // Мінімальна ціна
            if (
                filters.minPrice &&
                vehicle.price < Number(filters.minPrice)
            ) {
                return false;
            }

            // Максимальна ціна
            if (
                filters.maxPrice &&
                vehicle.price > Number(filters.maxPrice)
            ) {
                return false;
            }

            // Мінімальний рік
            if (
                filters.minYear &&
                vehicle.year < Number(filters.minYear)
            ) {
                return false;
            }

            // Максимальний рік
            if (
                filters.maxYear &&
                vehicle.year > Number(filters.maxYear)
            ) {
                return false;
            }

            return true;
        });

        // Дата додавання використовується
        // лише для сортування, не показується клієнтам
        return result.sort((a, b) => {
            switch (filters.sortOrder) {
                case 'dateDesc':
                    return b.addedAt.localeCompare(a.addedAt);

                case 'dateAsc':
                    return a.addedAt.localeCompare(b.addedAt);

                case 'yearDesc':
                    return b.year - a.year;

                case 'yearAsc':
                    return a.year - b.year;

                case 'priceAsc':
                    return a.price - b.price;

                case 'priceDesc':
                    return b.price - a.price;

                default:
                    return 0;
            }
        });
    }, [vehicles, appliedFilters]);

    // ========================================
    // СТИЛІ ПОЛІВ
    // ========================================

    const inputClass =
        'w-full rounded-xl border border-gray-300 bg-white ' +
        'px-4 py-3 text-sm text-gray-900 outline-none ' +
        'transition focus:border-yellow-400 ' +
        'dark:border-gray-700 dark:bg-gray-800 dark:text-white';

    const labelClass =
        'mb-2 block text-sm font-semibold ' +
        'text-gray-900 dark:text-white';

    // ========================================
    // ПЕРЕХІД НА СТОРІНКУ АВТО
    // ========================================

    function openVehicle(vehicle: Vehicle) {
        navigate(`/cars/${getVehicleSlug(vehicle)}`);
    }

    // ========================================
    // ІНТЕРФЕЙС КАТАЛОГУ
    // ========================================

    return (
        <main className="am-seasonal-surface min-h-screen bg-gray-50 py-12 dark:bg-gray-950">

            <div className="am-seasonal-content mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ========================================
                    ЗАГОЛОВОК
                ======================================== */}

                <div className="mb-8">

                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                        Каталог автомобілів
                    </h1>

                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                        Знайдіть автомобіль для вашого бізнесу
                    </p>

                </div>

                {/* ========================================
                    БЕЗКОШТОВНА ДОСТАВКА
                ======================================== */}

                <div className="mb-8 flex items-center gap-3 rounded-xl border border-yellow-400/40 bg-yellow-50 px-5 py-4 dark:bg-yellow-400/10">

                    <Truck
                        size={22}
                        className="shrink-0 text-yellow-600 dark:text-yellow-400"
                    />

                    <p className="text-sm font-bold text-gray-900 dark:text-yellow-400">
                        Безкоштовна доставка автомобілів по всій Україні!
                    </p>

                </div>

                {/* ========================================
                    КНОПКА ФІЛЬТРІВ
                ======================================== */}

                <button
                    type="button"
                    onClick={() =>
                        setIsFiltersOpen(previous => !previous)
                    }
                    aria-expanded={isFiltersOpen}
                    aria-controls="catalog-filters"
                    className="mb-8 inline-flex items-center gap-3 rounded-xl bg-yellow-400 px-6 py-3 font-bold text-gray-950 transition hover:bg-yellow-500"
                >
                    <SlidersHorizontal size={20} />

                    Фільтри

                    {isFiltersOpen ? (
                        <ChevronUp size={20} />
                    ) : (
                        <ChevronDown size={20} />
                    )}
                </button>

                {/* ========================================
                    ПАНЕЛЬ ФІЛЬТРІВ
                ======================================== */}

                {isFiltersOpen && (
                    <section
                        id="catalog-filters"
                        aria-label="Фільтри автомобілів"
                        className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 dark:border-gray-800 dark:bg-gray-900"
                    >

                        <form
                            onSubmit={event => {
                                event.preventDefault();

                                if (!hasInvalidRange) {
                                    applyFilters();
                                }
                            }}
                        >

                            {/* Вибір типу кузова */}
                            <div className="mb-8">
                                <BodyTypeSelector
                                    value={draftFilters.bodyType}
                                    onChange={value =>
                                        updateFilter('bodyType', value)
                                    }
                                />
                            </div>

                            {/* Поля фільтрації */}
                            <div className="grid gap-5 border-t border-gray-200 pt-7 sm:grid-cols-2 lg:grid-cols-3 dark:border-gray-700">

                                {/* Пошук */}
                                <div>

                                    <label
                                        htmlFor="search"
                                        className={labelClass}
                                    >
                                        Пошук автомобіля
                                    </label>

                                    <div className="relative">

                                        <Search
                                            size={18}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            id="search"
                                            type="search"
                                            placeholder="Mercedes, MAN..."
                                            value={draftFilters.search}
                                            onChange={event =>
                                                updateFilter(
                                                    'search',
                                                    event.target.value
                                                )
                                            }
                                            className={`${inputClass} pl-10`}
                                        />

                                    </div>
                                </div>

                                {/* Марка */}
                                <div>

                                    <label
                                        htmlFor="brand"
                                        className={labelClass}
                                    >
                                        Марка
                                    </label>

                                    <select
                                        id="brand"
                                        value={draftFilters.brand}
                                        onChange={event =>
                                            updateFilter(
                                                'brand',
                                                event.target.value
                                            )
                                        }
                                        className={inputClass}
                                    >

                                        <option value="">
                                            Усі марки
                                        </option>

                                        {brands.map(brand => (
                                            <option
                                                key={brand}
                                                value={brand}
                                            >
                                                {brand}
                                            </option>
                                        ))}

                                    </select>
                                </div>

                                {/* Паливо */}
                                <div>

                                    <label
                                        htmlFor="fuelType"
                                        className={labelClass}
                                    >
                                        Тип палива
                                    </label>

                                    <select
                                        id="fuelType"
                                        value={draftFilters.fuelType}
                                        onChange={event =>
                                            updateFilter(
                                                'fuelType',
                                                event.target.value
                                            )
                                        }
                                        className={inputClass}
                                    >

                                        <option value="">
                                            Усі типи
                                        </option>

                                        {fuelTypes.map(fuel => (
                                            <option
                                                key={fuel}
                                                value={fuel}
                                            >
                                                {fuel}
                                            </option>
                                        ))}

                                    </select>
                                </div>

                                {/* Об'єм двигуна */}
                                <div>

                                    <label
                                        htmlFor="engineVolume"
                                        className={labelClass}
                                    >
                                        Об'єм двигуна
                                    </label>

                                    <select
                                        id="engineVolume"
                                        value={draftFilters.engineVolume}
                                        onChange={event =>
                                            updateFilter(
                                                'engineVolume',
                                                event.target.value
                                            )
                                        }
                                        className={inputClass}
                                    >

                                        <option value="">
                                            Будь-який
                                        </option>

                                        {engineVolumes.map(volume => (
                                            <option
                                                key={volume}
                                                value={volume}
                                            >
                                                {volume} л
                                            </option>
                                        ))}

                                    </select>
                                </div>

                                {/* Сортування */}
                                <div>

                                    <label
                                        htmlFor="sortOrder"
                                        className={labelClass}
                                    >
                                        Сортувати за
                                    </label>

                                    <select
                                        id="sortOrder"
                                        value={draftFilters.sortOrder}
                                        onChange={event =>
                                            updateFilter(
                                                'sortOrder',
                                                event.target.value as SortOrder
                                            )
                                        }
                                        className={inputClass}
                                    >

                                        <option value="dateDesc">
                                            Спочатку нові надходження
                                        </option>

                                        <option value="dateAsc">
                                            Спочатку старі надходження
                                        </option>

                                        <option value="yearDesc">
                                            Рік: від нових до старих
                                        </option>

                                        <option value="yearAsc">
                                            Рік: від старих до нових
                                        </option>

                                        <option value="priceAsc">
                                            Ціна: від дешевих до дорогих
                                        </option>

                                        <option value="priceDesc">
                                            Ціна: від дорогих до дешевих
                                        </option>

                                    </select>
                                </div>

                                {/* Ціна */}
                                <div>

                                    <p className={labelClass}>
                                        Ціна, $
                                    </p>

                                    <div className="grid grid-cols-2 gap-2">

                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Від"
                                            aria-label="Мінімальна ціна"
                                            value={draftFilters.minPrice}
                                            onChange={event =>
                                                updateFilter(
                                                    'minPrice',
                                                    event.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />

                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="До"
                                            aria-label="Максимальна ціна"
                                            value={draftFilters.maxPrice}
                                            onChange={event =>
                                                updateFilter(
                                                    'maxPrice',
                                                    event.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />

                                    </div>
                                </div>

                                {/* Рік випуску */}
                                <div>

                                    <p className={labelClass}>
                                        Рік випуску
                                    </p>

                                    <div className="grid grid-cols-2 gap-2">

                                        <input
                                            type="number"
                                            min="1900"
                                            placeholder="Від"
                                            aria-label="Мінімальний рік"
                                            value={draftFilters.minYear}
                                            onChange={event =>
                                                updateFilter(
                                                    'minYear',
                                                    event.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />

                                        <input
                                            type="number"
                                            min="1900"
                                            placeholder="До"
                                            aria-label="Максимальний рік"
                                            value={draftFilters.maxYear}
                                            onChange={event =>
                                                updateFilter(
                                                    'maxYear',
                                                    event.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />

                                    </div>
                                </div>

                            </div>

                            {/* Помилка діапазонів */}
                            {hasInvalidRange && (
                                <p
                                    role="alert"
                                    className="mt-5 text-sm font-medium text-red-600 dark:text-red-400"
                                >
                                    Значення «Від» не може бути більшим за значення «До».
                                </p>
                            )}

                            {/* Кнопки застосування */}
                            <div className="mt-8 flex flex-wrap gap-3">

                                <button
                                    type="submit"
                                    disabled={hasInvalidRange}
                                    className="rounded-xl bg-yellow-400 px-7 py-3 font-bold text-gray-950 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Показати автомобілі
                                </button>

                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-900 transition hover:border-yellow-400 dark:border-gray-700 dark:text-white"
                                >
                                    <RotateCcw size={18} />

                                    Скинути фільтри
                                </button>

                            </div>

                        </form>
                    </section>
                )}

                {/* ========================================
                    РЕЗУЛЬТАТИ КАТАЛОГУ
                ======================================== */}

                <section aria-label="Автомобілі в каталозі">

                    <div className="mb-8 flex flex-wrap items-center justify-between gap-3">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Автомобілі в наявності
                            </h2>

                            {/* Активна категорія */}
                            {appliedFilters.bodyType && (
                                <p className="mt-2 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                    Категорія: {appliedFilters.bodyType}
                                </p>
                            )}

                        </div>

                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Знайдено: {filteredVehicles.length}
                        </p>

                    </div>

                    {/* ========================================
                        КАРТКИ АВТОМОБІЛІВ
                    ======================================== */}

                    {filteredVehicles.length > 0 ? (

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                            {filteredVehicles.map(vehicle => (
                                <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    onDetailsClick={openVehicle}
                                />
                            ))}

                        </div>

                    ) : (

                        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-800 dark:bg-gray-900">

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Автомобілі не знайдено
                            </h3>

                            <p className="mt-3 text-gray-500 dark:text-gray-400">
                                Спробуйте змінити параметри пошуку.
                            </p>

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-6 rounded-xl bg-yellow-400 px-6 py-3 font-bold text-gray-950 transition hover:bg-yellow-500"
                            >
                                Показати всі автомобілі
                            </button>

                        </div>

                    )}

                </section>

            </div>
        </main>
    );
}
