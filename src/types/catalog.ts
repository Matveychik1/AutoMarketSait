
export type SortOrder =
    | 'dateDesc'
    | 'dateAsc'
    | 'yearDesc'
    | 'yearAsc'
    | 'priceAsc'
    | 'priceDesc';

export type CatalogFilters = {
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

export const SORT_ORDERS: SortOrder[] = [
    'dateDesc',
    'dateAsc',
    'yearDesc',
    'yearAsc',
    'priceAsc',
    'priceDesc',
];

// Фільтри за замовчуванням
export function createDefaultFilters(): CatalogFilters {
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

// Зчитування фільтрів із URL
export function readFiltersFromUrl(
    params: URLSearchParams
): CatalogFilters {
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
            sort && SORT_ORDERS.includes(sort as SortOrder)
                ? (sort as SortOrder)
                : 'dateDesc',
    };
}

// Створення параметрів URL з фільтрів
export function createFilterSearchParams(
    filters: CatalogFilters
): URLSearchParams {
    const params = new URLSearchParams();

    const fields: Array<
        keyof Omit<CatalogFilters, 'sortOrder'>
    > = [
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

// Номер сторінки із URL
export function getPageFromUrl(
    params: URLSearchParams
): number {
    const rawPage = params.get('page');

    if (!rawPage || !/^[1-9]\d*$/.test(rawPage)) {
        return 1;
    }

    const page = Number(rawPage);

    return Number.isSafeInteger(page) ? page : 1;
}
