
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { Vehicle } from '../types/vehicle';

import type { CatalogFilters } from '../types/catalog';

import {
    createFilterSearchParams,
    getPageFromUrl,
    readFiltersFromUrl,
} from '../types/catalog';

export const VEHICLES_PER_PAGE = 12;

export function useCatalog(vehicles: Vehicle[]) {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const queryString = searchParams.toString();

    // Застосовані фільтри з адреси браузера
    const appliedFilters = useMemo(
        () => readFiltersFromUrl(
            new URLSearchParams(queryString)
        ),
        [queryString]
    );

    // Ключ для синхронізації меню фільтрів.
    // Параметр page тут не враховується.
    const filterKey = useMemo(
        () => createFilterSearchParams(
            appliedFilters
        ).toString(),
        [appliedFilters]
    );

    // Доступні марки
    const brands = useMemo(
        () => [
            ...new Set(
                vehicles.map(vehicle => vehicle.brand)
            ),
        ].sort(),
        [vehicles]
    );

    // Типи палива
    const fuelTypes = useMemo(
        () => [
            ...new Set(
                vehicles.map(vehicle => vehicle.fuelType)
            ),
        ].sort(),
        [vehicles]
    );

    // Об'єми двигунів
    const engineVolumes = useMemo(
        () => [
            ...new Set(
                vehicles
                    .map(vehicle => vehicle.engineVolume)
                    .filter(
                        (volume): volume is number =>
                            volume !== null
                    )
            ),
        ].sort((a, b) => a - b),
        [vehicles]
    );

    // ========================================
    // ФІЛЬТРАЦІЯ
    // ========================================

    const filteredVehicles = useMemo(() => {
        const filters = appliedFilters;

        const result = vehicles.filter(vehicle => {
            const fullName =
                `${vehicle.brand} ${vehicle.model}`.toLowerCase();

            // Пошук
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
        // лише для сортування автомобілів
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
    // ПАГІНАЦІЯ
    // ========================================

    const totalVehicles = filteredVehicles.length;

    const totalPages = Math.max(
        1,
        Math.ceil(totalVehicles / VEHICLES_PER_PAGE)
    );

    const requestedPage = getPageFromUrl(
        new URLSearchParams(queryString)
    );

    const currentPage = Math.min(
        requestedPage,
        totalPages
    );

    const startIndex =
        (currentPage - 1) * VEHICLES_PER_PAGE;

    const paginatedVehicles = filteredVehicles.slice(
        startIndex,
        startIndex + VEHICLES_PER_PAGE
    );

    const firstShown =
        totalVehicles === 0 ? 0 : startIndex + 1;

    const lastShown = Math.min(
        startIndex + VEHICLES_PER_PAGE,
        totalVehicles
    );

    // ========================================
    // ЗАСТОСУВАННЯ ФІЛЬТРІВ
    // ========================================

    function applyFilters(filters: CatalogFilters) {
        // Нові фільтри = перша сторінка
        setSearchParams(
            createFilterSearchParams(filters)
        );
    }

    function resetFilters() {
        setSearchParams({});
    }

    // ========================================
    // ПЕРЕХІД МІЖ СТОРІНКАМИ
    // ========================================

    function goToPage(page: number) {
        if (
            page < 1 ||
            page > totalPages ||
            page === currentPage
        ) {
            return;
        }

        const params = new URLSearchParams(queryString);

        if (page === 1) {
            params.delete('page');
        } else {
            params.set('page', String(page));
        }

        setSearchParams(params);

        // Прокручування до результатів
        const reducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        document
            .getElementById('catalog-results')
            ?.scrollIntoView({
                behavior: reducedMotion ? 'auto' : 'smooth',
                block: 'start',
            });
    }

    return {
        appliedFilters,
        filterKey,

        brands,
        fuelTypes,
        engineVolumes,

        paginatedVehicles,

        totalVehicles,
        totalPages,
        currentPage,
        firstShown,
        lastShown,

        applyFilters,
        resetFilters,
        goToPage,
    };
}
