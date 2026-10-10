
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import type { Vehicle } from '../types/vehicle';

import {
    getVehicleIdFromSlug,
} from '../utils/vehicleSlug';

type SEOManagerProps = {
    vehicles: Vehicle[];
};

type SEOData = {
    title: string;
    description: string;
};

const SITE_NAME = 'AutoMarket Rivne';

const DEFAULT_DESCRIPTION =
    'Комерційні автомобілі з Європи: Mercedes-Benz Sprinter, ' +
    'Volkswagen Crafter, MAN TGE. Фургони, бортові, тенти ' +
    'та рефрижератори. Безкоштовна доставка по Україні.';

// Створення або оновлення meta-тегів
function updateMeta(
    attribute: 'name' | 'property',
    key: string,
    content: string
) {
    let meta = document.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`
    );

    if (!meta) {
        meta = document.createElement('meta');

        meta.setAttribute(attribute, key);

        document.head.appendChild(meta);
    }

    meta.content = content;
}

// SEO-інформація залежно від сторінки
function getSEOData(
    pathname: string,
    search: string,
    vehicles: Vehicle[]
): SEOData {

    // Головна сторінка
    if (pathname === '/') {
        return {
            title: `Комерційні автомобілі з Європи | ${SITE_NAME}`,
            description: DEFAULT_DESCRIPTION,
        };
    }

    // Каталог автомобілів
    if (pathname === '/catalog') {
        const params = new URLSearchParams(search);

        const bodyType = params.get('bodyType');

        if (bodyType) {
            return {
                title: `${bodyType} — каталог авто | ${SITE_NAME}`,

                description:
                    `Перегляньте автомобілі категорії «${bodyType}» ` +
                    'в AutoMarket Rivne. Комерційний транспорт ' +
                    'з Європи та безкоштовна доставка по Україні.',
            };
        }

        return {
            title: `Каталог комерційних автомобілів | ${SITE_NAME}`,

            description:
                'Каталог комерційних автомобілів: Mercedes-Benz, ' +
                'Volkswagen та MAN. Зручні фільтри за маркою, ' +
                'ціною, роком випуску і типом кузова.',
        };
    }

    // Про компанію
    if (pathname === '/about') {
        return {
            title: `Про компанію | ${SITE_NAME}`,

            description:
                'Дізнайтеся більше про AutoMarket Rivne. ' +
                'Комерційні автомобілі з Європи, допомога ' +
                'з вибором і безкоштовна доставка по Україні.',
        };
    }

    // Сторінка автомобіля
    if (pathname.startsWith('/cars/')) {

        // Отримуємо slug з URL
        const slug = pathname.slice('/cars/'.length);

        // Визначаємо ID автомобіля
        const vehicleId = getVehicleIdFromSlug(slug);

        // Шукаємо автомобіль
        const vehicle = vehicles.find(
            car => car.id === vehicleId
        );

        if (vehicle) {
            const name =
                `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;

            return {
                title: `${name} — купити | ${SITE_NAME}`,

                description:
                    `${name}. Тип кузова: ${vehicle.bodyType}. ` +
                    `Пробіг: ${vehicle.mileage.toLocaleString('uk-UA')} км. ` +
                    `Ціна: ${vehicle.price.toLocaleString('uk-UA')} $. ` +
                    'Перегляньте фотографії, характеристики ' +
                    'та комплектацію автомобіля.',
            };
        }

        return {
            title: `Автомобіль не знайдено | ${SITE_NAME}`,
            description: DEFAULT_DESCRIPTION,
        };
    }

    // Невідома сторінка
    return {
        title: `Сторінку не знайдено | ${SITE_NAME}`,
        description: DEFAULT_DESCRIPTION,
    };
}

// Головний SEO-компонент
export default function SEOManager({
                                       vehicles,
                                   }: SEOManagerProps) {
    const location = useLocation();

    useEffect(() => {
        const seo = getSEOData(
            location.pathname,
            location.search,
            vehicles
        );

        // Заголовок вкладки браузера
        document.title = seo.title;

        // Основний SEO-опис
        updateMeta(
            'name',
            'description',
            seo.description
        );

        // Open Graph
        updateMeta(
            'property',
            'og:title',
            seo.title
        );

        updateMeta(
            'property',
            'og:description',
            seo.description
        );

        updateMeta(
            'property',
            'og:type',
            location.pathname.startsWith('/cars/')
                ? 'product'
                : 'website'
        );

        updateMeta(
            'property',
            'og:site_name',
            SITE_NAME
        );

        // Twitter / X
        updateMeta(
            'name',
            'twitter:title',
            seo.title
        );

        updateMeta(
            'name',
            'twitter:description',
            seo.description
        );

    }, [
        location.pathname,
        location.search,
        vehicles,
    ]);

    return null;
}
