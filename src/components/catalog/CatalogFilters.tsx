
import { useState } from 'react';

import {
    Search,
    SlidersHorizontal,
    RotateCcw,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

import BodyTypeSelector from './BodyTypeSelector.tsx';

import type {
    CatalogFilters as Filters,
    SortOrder,
} from '../../types/catalog';

import { createDefaultFilters } from '../../types/catalog';

type CatalogFiltersProps = {
    appliedFilters: Filters;

    brands: string[];
    fuelTypes: string[];
    engineVolumes: number[];

    onApply: (filters: Filters) => void;
    onReset: () => void;
};

export default function CatalogFilters({
                                           appliedFilters,
                                           brands,
                                           fuelTypes,
                                           engineVolumes,
                                           onApply,
                                           onReset,
                                       }: CatalogFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [draftFilters, setDraftFilters] =
        useState<Filters>(appliedFilters);

    // ========================================
    // ЗМІНА ПОЛІВ
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
    // КНОПКИ
    // ========================================

    function handleApply() {
        if (hasInvalidRange) return;

        onApply(draftFilters);
        setIsOpen(false);
    }

    function handleReset() {
        setDraftFilters(createDefaultFilters());
        onReset();
        setIsOpen(false);
    }

    // ========================================
    // СТИЛІ
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
    // ІНТЕРФЕЙС
    // ========================================

    return (
        <>
            {/* Кнопка відкриття фільтрів */}
            <button
                type="button"
                onClick={() =>
                    setIsOpen(previous => !previous)
                }
                aria-expanded={isOpen}
                aria-controls="catalog-filters"
                className="mb-8 inline-flex items-center gap-3 rounded-xl bg-yellow-400 px-6 py-3 font-bold text-gray-950 transition hover:bg-yellow-500"
            >
                <SlidersHorizontal size={20} />

                Фільтри

                {isOpen ? (
                    <ChevronUp size={20} />
                ) : (
                    <ChevronDown size={20} />
                )}
            </button>

            {/* Панель */}
            {isOpen && (
                <section
                    id="catalog-filters"
                    aria-label="Фільтри автомобілів"
                    className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 dark:border-gray-800 dark:bg-gray-900"
                >
                    <form
                        onSubmit={event => {
                            event.preventDefault();
                            handleApply();
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

                        {/* Поля фільтрів */}
                        <div className="grid gap-5 border-t border-gray-200 pt-7 sm:grid-cols-2 lg:grid-cols-3 dark:border-gray-700">

                            {/* Пошук */}
                            <div>
                                <label
                                    htmlFor="catalog-search"
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
                                        id="catalog-search"
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
                                    htmlFor="catalog-brand"
                                    className={labelClass}
                                >
                                    Марка
                                </label>

                                <select
                                    id="catalog-brand"
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
                                    htmlFor="catalog-fuel"
                                    className={labelClass}
                                >
                                    Тип палива
                                </label>

                                <select
                                    id="catalog-fuel"
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
                                    htmlFor="catalog-engine"
                                    className={labelClass}
                                >
                                    Об'єм двигуна
                                </label>

                                <select
                                    id="catalog-engine"
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
                                    htmlFor="catalog-sort"
                                    className={labelClass}
                                >
                                    Сортувати за
                                </label>

                                <select
                                    id="catalog-sort"
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

                        {/* Некоректний діапазон */}
                        {hasInvalidRange && (
                            <p
                                role="alert"
                                className="mt-5 text-sm font-medium text-red-600 dark:text-red-400"
                            >
                                Значення «Від» не може бути
                                більшим за значення «До».
                            </p>
                        )}

                        {/* Кнопки */}
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
                                onClick={handleReset}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-900 transition hover:border-yellow-400 dark:border-gray-700 dark:text-white"
                            >
                                <RotateCcw size={18} />

                                Скинути фільтри
                            </button>
                        </div>
                    </form>
                </section>
            )}
        </>
    );
}
