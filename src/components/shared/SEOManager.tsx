
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import type { Vehicle } from '../../types/vehicle';

import { getVehicleStatus } from '../../types/vehicleStatus';

import {
    getVehicleIdFromSlug,
    getVehicleSlug,
} from '../../utils/vehicleSlug';

// ========================================
// ТИПИ
// ========================================

type SEOManagerProps = {
    vehicles: Vehicle[];
    loading?: boolean;
    error?: string;
};

type SEOData = {
    title: string;
    description: string;
    canonicalPath?: string;
    noindex?: boolean;
    vehicle?: Vehicle;
};

type MetaAttribute = 'name' | 'property';

const SITE_NAME = 'AutoMarket Rivne';

const numberFormatter = new Intl.NumberFormat('uk-UA');

// ========================================
// SEO ГОЛОВНОЇ СТОРІНКИ
// ========================================

const HOME_TITLE =
    'Автомаркет Рівне — вантажні авто та комерційний транспорт';

const HOME_DESCRIPTION =
    'AutoMarket Rivne — продаж вантажних автомобілів, ' +
    'вантажівок і комерційного транспорту в Рівному. ' +
    'Mercedes-Benz Sprinter, Volkswagen Crafter, MAN TGE, ' +
    'фургони, бортові та тентовані авто, рефрижератори. ' +
    'Каталог автомобілів із цінами та фотографіями.';

// ========================================
// SEO КАТАЛОГУ
// ========================================

const CATALOG_TITLE =
    'Купити вантажні авто та вантажівки | AutoMarket Rivne';

const CATALOG_DESCRIPTION =
    'Каталог AutoMarket Rivne: вантажівки, вантажні ' +
    'автомобілі, буси, фургони, бортові, тентовані авто, ' +
    'дублькабіни, рефрижератори та інший комерційний ' +
    'транспорт. Продаж автомобілів у Рівному та Україні.';

// ========================================
// ДОПОМІЖНІ ФУНКЦІЇ
// ========================================

function updateMeta(
    attribute: MetaAttribute,
    key: string,
    content: string,
    cleanups: Array<() => void>
) {
    let element =
        document.head.querySelector<HTMLMetaElement>(
            `meta[${attribute}="${key}"]`
        );

    const created = element === null;

    const previousContent =
        element?.getAttribute('content') ?? null;

    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
    }

    const target = element;

    target.setAttribute('content', content);

    cleanups.push(() => {
        if (created) {
            target.remove();
        } else if (previousContent === null) {
            target.removeAttribute('content');
        } else {
            target.setAttribute(
                'content',
                previousContent
            );
        }
    });
}

function updateCanonical(
    url: string,
    cleanups: Array<() => void>
) {
    let element =
        document.head.querySelector<HTMLLinkElement>(
            'link[rel="canonical"]'
        );

    const created = element === null;

    const previousHref =
        element?.getAttribute('href') ?? null;

    if (!element) {
        element = document.createElement('link');
        element.rel = 'canonical';
        document.head.appendChild(element);
    }

    const target = element;

    target.href = url;

    cleanups.push(() => {
        if (created) {
            target.remove();
        } else if (previousHref === null) {
            target.removeAttribute('href');
        } else {
            target.setAttribute('href', previousHref);
        }
    });
}

function getAbsoluteUrl(
    path: string | undefined
): string | null {
    if (!path) {
        return null;
    }

    try {
        const url = new URL(
            path,
            window.location.origin
        );

        if (
            url.protocol !== 'http:' &&
            url.protocol !== 'https:'
        ) {
            return null;
        }

        return url.href;
    } catch {
        return null;
    }
}

// ========================================
// SEO ОКРЕМОГО АВТОМОБІЛЯ
// ========================================

function getVehicleSEO(vehicle: Vehicle): SEOData {
    const status = getVehicleStatus(vehicle.status);

    const name =
        `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;

    const title =
        status === 'sold'
            ? `${name} — продано | ${SITE_NAME}`
            : status === 'reserved'
                ? `${name} — завдаткований | ${SITE_NAME}`
                : `${name} — купити в Рівному | ${SITE_NAME}`;

    const availabilityText =
        status === 'sold'
            ? 'Автомобіль продано.'
            : status === 'reserved'
                ? 'Автомобіль завдаткований.'
                : 'Автомобіль у продажу.';

    const priceText =
        vehicle.price > 0
            ? status === 'sold'
                ? ` Остання ціна: ${numberFormatter.format(vehicle.price)} $.`
                : ` Ціна: ${numberFormatter.format(vehicle.price)} $.`
            : '';

    const description =
        `${name}. ${vehicle.bodyType}, ${vehicle.fuelType}. ` +
        `Пробіг: ${numberFormatter.format(vehicle.mileage)} км. ` +
        `${availabilityText}${priceText} ` +
        'Фото, характеристики, комплектація. AutoMarket Rivne.';

    return {
        title,
        description,
        canonicalPath: `/cars/${getVehicleSlug(vehicle)}`,
        vehicle,
    };
}

// ========================================
// ВИЗНАЧЕННЯ SEO ЗА МАРШРУТОМ
// ========================================

function getSEOData(
    pathname: string,
    search: string,
    vehicles: Vehicle[],
    loading: boolean,
    hasError: boolean
): SEOData {
    // Адмінпанель не індексуємо.
    if (
        pathname === '/admin' ||
        pathname.startsWith('/admin/')
    ) {
        return {
            title: `Адмінпанель | ${SITE_NAME}`,
            description: 'Панель керування AutoMarket Rivne.',
            noindex: true,
        };
    }

    // Головна сторінка
    if (pathname === '/') {
        return {
            title: HOME_TITLE,
            description: HOME_DESCRIPTION,
            canonicalPath: '/',
        };
    }

    // Каталог
    if (pathname === '/catalog') {
        const params = new URLSearchParams(search);

        const bodyType = params.get('bodyType');

        // Не створюємо індексовані дублікати
        // каталогу для кожної комбінації фільтрів.
        // Canonical завжди веде на /catalog.
        if (
            bodyType &&
            bodyType.length <= 60 &&
            vehicles.some(
                vehicle => vehicle.bodyType === bodyType
            )
        ) {
            return {
                title:
                    `${bodyType} — купити авто | ${SITE_NAME}`,

                description:
                    `Каталог автомобілів категорії «${bodyType}» ` +
                    'в AutoMarket Rivne. Перегляньте ' +
                    'вантажні та комерційні автомобілі, ' +
                    'фотографії, характеристики й ціни.',

                canonicalPath: '/catalog',
            };
        }

        return {
            title: CATALOG_TITLE,
            description: CATALOG_DESCRIPTION,
            canonicalPath: '/catalog',
        };
    }

    // Про компанію
    if (pathname === '/about') {
        return {
            title:
                `Про компанію Автомаркет Рівне | ${SITE_NAME}`,

            description:
                'AutoMarket Rivne — продаж вантажних ' +
                'автомобілів, вантажівок і комерційного ' +
                'транспорту з Європи. Дізнайтеся більше ' +
                'про автомаркет у Рівному.',

            canonicalPath: '/about',
        };
    }

    // Сторінка конкретного автомобіля
    if (pathname.startsWith('/cars/')) {
        const slug = pathname.slice('/cars/'.length);

        const vehicleId = getVehicleIdFromSlug(slug);

        const vehicle = vehicles.find(
            car => car.id === vehicleId
        );

        if (vehicle) {
            return getVehicleSEO(vehicle);
        }

        // Поки автомобілі завантажуються, не робимо
        // висновок, що оголошення не існує.
        if (loading || hasError) {
            return {
                title: `Автомобілі | ${SITE_NAME}`,
                description:
                    'Автомобілі, вантажівки та комерційний ' +
                    'транспорт у каталозі AutoMarket Rivne.',
            };
        }

        // Якщо API успішно завантажило дані,
        // але автомобіля немає.
        return {
            title: `Автомобіль не знайдено | ${SITE_NAME}`,
            description:
                'Оголошення недоступне. Перегляньте ' +
                'актуальний каталог AutoMarket Rivne.',
            noindex: true,
        };
    }

    // Невідомі маршрути
    return {
        title: `Сторінку не знайдено | ${SITE_NAME}`,
        description:
            'Перегляньте автомобілі в каталозі AutoMarket Rivne.',
        noindex: true,
    };
}

// ========================================
// ГОЛОВНИЙ SEO-КОМПОНЕНТ
// ========================================

export default function SEOManager({
                                       vehicles,
                                       loading = false,
                                       error = '',
                                   }: SEOManagerProps) {
    const location = useLocation();

    useEffect(() => {
        const seo = getSEOData(
            location.pathname,
            location.search,
            vehicles,
            loading,
            Boolean(error)
        );

        const cleanups: Array<() => void> = [];

        // ====================================
        // TITLE
        // ====================================

        const previousTitle = document.title;

        document.title = seo.title;

        cleanups.push(() => {
            document.title = previousTitle;
        });

        // ====================================
        // DESCRIPTION
        // ====================================

        updateMeta(
            'name',
            'description',
            seo.description,
            cleanups
        );

        // ====================================
        // ROBOTS
        // ====================================

        updateMeta(
            'name',
            'robots',
            seo.noindex
                ? 'noindex, follow'
                : 'index, follow',
            cleanups
        );

        // ====================================
        // CANONICAL
        // ====================================

        const canonicalUrl = seo.canonicalPath
            ? getAbsoluteUrl(seo.canonicalPath)
            : null;

        if (canonicalUrl) {
            updateCanonical(canonicalUrl, cleanups);
        }

        // ====================================
        // OPEN GRAPH
        // ====================================

        updateMeta(
            'property',
            'og:type',
            seo.vehicle ? 'product' : 'website',
            cleanups
        );

        updateMeta(
            'property',
            'og:locale',
            'uk_UA',
            cleanups
        );

        updateMeta(
            'property',
            'og:site_name',
            SITE_NAME,
            cleanups
        );

        updateMeta(
            'property',
            'og:title',
            seo.title,
            cleanups
        );

        updateMeta(
            'property',
            'og:description',
            seo.description,
            cleanups
        );

        if (canonicalUrl) {
            updateMeta(
                'property',
                'og:url',
                canonicalUrl,
                cleanups
            );
        }

        // ====================================
        // ФОТОГРАФІЯ АВТОМОБІЛЯ
        // ====================================

        const coverImage = seo.vehicle
            ? seo.vehicle.images?.find(Boolean) ||
            seo.vehicle.image
            : undefined;

        const absoluteImageUrl =
            getAbsoluteUrl(coverImage);

        if (absoluteImageUrl && seo.vehicle) {
            updateMeta(
                'property',
                'og:image',
                absoluteImageUrl,
                cleanups
            );

            updateMeta(
                'property',
                'og:image:alt',
                `${seo.vehicle.brand} ${seo.vehicle.model}`,
                cleanups
            );
        }

        // ====================================
        // TWITTER / X
        // ====================================

        updateMeta(
            'name',
            'twitter:card',
            absoluteImageUrl
                ? 'summary_large_image'
                : 'summary',
            cleanups
        );

        updateMeta(
            'name',
            'twitter:title',
            seo.title,
            cleanups
        );

        updateMeta(
            'name',
            'twitter:description',
            seo.description,
            cleanups
        );

        if (absoluteImageUrl) {
            updateMeta(
                'name',
                'twitter:image',
                absoluteImageUrl,
                cleanups
            );
        }

        // ====================================
        // JSON-LD ДЛЯ АВТОМОБІЛЯ
        // ====================================

        if (seo.vehicle && canonicalUrl) {
            const vehicle = seo.vehicle;

            const status =
                getVehicleStatus(vehicle.status);

            const availability =
                status === 'sold'
                    ? 'https://schema.org/SoldOut'
                    : status === 'reserved'
                        ? 'https://schema.org/OutOfStock'
                        : 'https://schema.org/InStock';

            const jsonLd = {
                '@context': 'https://schema.org',

                '@type': 'Vehicle',

                name:
                    `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,

                description:
                    vehicle.description?.trim() ||
                    seo.description,

                url: canonicalUrl,

                ...(absoluteImageUrl
                    ? { image: absoluteImageUrl }
                    : {}),

                brand: {
                    '@type': 'Brand',
                    name: vehicle.brand,
                },

                model: vehicle.model,

                vehicleModelDate: String(vehicle.year),

                bodyType: vehicle.bodyType,

                fuelType: vehicle.fuelType,

                mileageFromOdometer: {
                    '@type': 'QuantitativeValue',
                    value: vehicle.mileage,
                    unitCode: 'KMT',
                },

                ...(vehicle.price > 0
                    ? {
                        offers: {
                            '@type': 'Offer',
                            url: canonicalUrl,
                            price: vehicle.price,
                            priceCurrency: 'USD',
                            availability,
                            seller: {
                                '@type': 'Organization',
                                name: SITE_NAME,
                            },
                        },
                    }
                    : {}),
            };

            const script =
                document.createElement('script');

            script.id = 'automarket-vehicle-jsonld';

            script.type = 'application/ld+json';

            script.textContent =
                JSON.stringify(jsonLd);

            document.head.appendChild(script);

            cleanups.push(() => {
                script.remove();
            });
        }

        // ====================================
        // ПРИБИРАЄМО МЕТАДАНІ ПІСЛЯ ПЕРЕХОДУ
        // ====================================

        return () => {
            cleanups.reverse().forEach(cleanup => {
                cleanup();
            });
        };
    }, [
        location.pathname,
        location.search,
        vehicles,
        loading,
        error,
    ]);

    return null;
}
