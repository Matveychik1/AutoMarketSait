
import type { Vehicle } from '../types/vehicle';

/**
 * Створює красиву адресу автомобіля.
 *
 * Наприклад:
 * mercedes-benz-sprinter-314-2021-1
 */
export function getVehicleSlug(vehicle: Vehicle): string {
    const name = `${vehicle.brand}-${vehicle.model}-${vehicle.year}`;

    const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    return `${slug || 'vehicle'}-${vehicle.id}`;
}

/**
 * Отримує ID з адреси.
 *
 * Працює з:
 * /cars/1
 * /cars/mercedes-benz-sprinter-314-2021-1
 */
export function getVehicleIdFromSlug(
    slug?: string
): number | null {
    if (!slug) return null;

    const match = slug.match(/(?:^|-)(\d+)$/);

    if (!match) return null;

    const id = Number(match[1]);

    return Number.isSafeInteger(id) && id > 0
        ? id
        : null;
}
