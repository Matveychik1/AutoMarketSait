
import { getCsrfToken } from './adminAuth';

import type { Vehicle } from '../types/vehicle';
import type { VehicleStatus } from '../types/vehicleStatus';

import type {
    AdminVehicleFormValues,
} from '../components/admin/AdminVehicleForm';

// ========================================
// ТИПИ API
// ========================================

type ApiCar = {
    id: number;
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    bodyType: string;
    status: VehicleStatus;
    fuelType: 'Дизель' | 'Бензин';

    engineVolume: number | null;
    transmission: string | null;
    drivetrain: string | null;

    powerHp: number | null;
    payloadKg: number | null;
    grossWeightKg: number | null;

    bodyLength: number | null;
    bodyWidth: number | null;
    bodyHeight: number | null;

    image: string;
    images: string[];

    equipment: string[];
    description: string | null;
    youtubeVideoId: string | null;

    addedAt: string;
};

type CarPayload = Omit<ApiCar, 'id' | 'addedAt'>;

type ApiErrorResponse = {
    message?: string;
    title?: string;
    errors?: Record<string, string[]>;
};

// ========================================
// ПЕРЕТВОРЕННЯ ДАНИХ ІЗ C# У REACT
// ========================================

function toVehicle(car: ApiCar): Vehicle {
    const hasDimensions =
        car.bodyLength != null ||
        car.bodyWidth != null ||
        car.bodyHeight != null;

    return {
        id: car.id,

        brand: car.brand,
        model: car.model,

        year: car.year,
        price: car.price,
        mileage: car.mileage,

        bodyType: car.bodyType,
        status: car.status,
        fuelType: car.fuelType,

        engineVolume: car.engineVolume,

        transmission:
            car.transmission ?? undefined,

        drivetrain:
            car.drivetrain ?? undefined,

        powerHp:
            car.powerHp ?? undefined,

        payloadKg:
            car.payloadKg ?? undefined,

        grossWeightKg:
            car.grossWeightKg ?? undefined,

        bodyDimensions: hasDimensions
            ? {
                length:
                    car.bodyLength ?? undefined,

                width:
                    car.bodyWidth ?? undefined,

                height:
                    car.bodyHeight ?? undefined,
            }
            : undefined,

        image: car.image ?? '',
        images: car.images ?? [],

        equipment: car.equipment ?? [],

        description:
            car.description ?? '',

        youtubeVideoId:
            car.youtubeVideoId ?? undefined,

        addedAt: car.addedAt,
    };
}

// ========================================
// ДОПОМІЖНІ ФУНКЦІЇ ДЛЯ ЧИСЕЛ
// ========================================

function optionalNumber(
    value: string
): number | null {
    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    const parsed = Number(
        trimmed.replace(',', '.')
    );

    if (!Number.isFinite(parsed)) {
        throw new Error(
            'Перевір числові характеристики автомобіля.'
        );
    }

    return parsed;
}

/**
 * РОЗМІРИ КУЗОВА
 *
 * Порожнє поле -> null
 * 0 -> null
 * 2,15 -> 2.15
 * 2.15 -> 2.15
 *
 * Дозволені значення: від 0.01 до 100.
 */
function optionalDimension(
    value: string,
    fieldName: string
): number | null {
    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    const parsed = Number(
        trimmed.replace(',', '.')
    );

    if (!Number.isFinite(parsed)) {
        throw new Error(
            `${fieldName}: введи правильне число.`
        );
    }

    // Нуль означає, що розмір не вказаний.
    if (parsed === 0) {
        return null;
    }

    if (parsed < 0.01 || parsed > 100) {
        throw new Error(
            `${fieldName}: значення має бути від 0.01 до 100 метрів.`
        );
    }

    return parsed;
}

// ========================================
// ПЕРЕТВОРЕННЯ ФОРМИ В C# DTO
// ========================================

export function toCarPayload(
    values: AdminVehicleFormValues,
    images: string[],
    youtubeVideoId: string | null
): CarPayload {
    return {
        brand: values.brand.trim(),
        model: values.model.trim(),

        year: Number(values.year),
        price: Number(values.price),
        mileage: Number(values.mileage),

        bodyType: values.bodyType,
        status: values.status,
        fuelType: values.fuelType,

        engineVolume: optionalNumber(
            values.engineVolume
        ),

        transmission:
            values.transmission.trim() || null,

        drivetrain:
            values.drivetrain.trim() || null,

        powerHp: optionalNumber(
            values.powerHp
        ),

        payloadKg: optionalNumber(
            values.payloadKg
        ),

        grossWeightKg: optionalNumber(
            values.grossWeightKg
        ),

        // ====================================
        // ВИПРАВЛЕНІ РОЗМІРИ КУЗОВА
        // ====================================

        bodyLength: optionalDimension(
            values.length,
            'Довжина кузова'
        ),

        bodyWidth: optionalDimension(
            values.width,
            'Ширина кузова'
        ),

        bodyHeight: optionalDimension(
            values.height,
            'Висота кузова'
        ),

        // ====================================
        // ФОТОГРАФІЇ
        // ====================================

        image: images[0] ?? '',
        images,

        // ====================================
        // ДОДАТКОВА ІНФОРМАЦІЯ
        // ====================================

        equipment: values.equipment
            .split('\n')
            .map(item => item.trim())
            .filter(Boolean),

        description:
            values.description.trim() || null,

        youtubeVideoId,
    };
}

// ========================================
// ОБРОБКА ВІДПОВІДЕЙ СЕРВЕРА
// ========================================

async function readResponse<T>(
    response: Response
): Promise<T> {
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error(
                'Сесія завершилася. Увійди в адмінку повторно.'
            );
        }

        if (response.status === 403) {
            throw new Error(
                'Недостатньо прав для виконання цієї дії.'
            );
        }

        const body = await response.text();

        let message =
            `Помилка сервера: ${response.status}`;

        try {
            const data = JSON.parse(
                body
            ) as ApiErrorResponse;

            // ASP.NET Core ValidationProblemDetails
            // повертає список помилок у errors.
            if (
                data.errors &&
                Object.keys(data.errors).length > 0
            ) {
                const validationErrors =
                    Object.entries(data.errors)
                        .flatMap(([field, messages]) =>
                            messages.map(
                                text => `${field}: ${text}`
                            )
                        );

                if (validationErrors.length > 0) {
                    message =
                        validationErrors.join('\n');
                }
            } else {
                message =
                    data.message ??
                    data.title ??
                    message;
            }
        } catch {
            // Сервер міг повернути HTML
            // або порожню відповідь.
        }

        throw new Error(message);
    }

    return response.json() as Promise<T>;
}

// ========================================
// ЗАХИЩЕНІ ЗАПИТИ POST / PUT / PATCH
// ========================================

async function sendJson<T>(
    path: string,
    method: 'POST' | 'PUT' | 'PATCH',
    data: unknown
): Promise<T> {
    const csrfToken = await getCsrfToken();

    const response = await fetch(path, {
        method,
        credentials: 'include',

        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },

        body: JSON.stringify(data),
    });

    return readResponse<T>(response);
}

// ========================================
// ПУБЛІЧНИЙ КАТАЛОГ
// ========================================

// GET /api/cars
export async function getPublicCars(): Promise<Vehicle[]> {
    const response = await fetch('/api/cars', {
        credentials: 'include',
        cache: 'no-store',
    });

    const cars = await readResponse<ApiCar[]>(
        response
    );

    return cars.map(toVehicle);
}

// ========================================
// АДМІНСЬКИЙ КАТАЛОГ
// ========================================

// GET /api/cars/admin
export async function getAdminCars(): Promise<Vehicle[]> {
    const response = await fetch('/api/cars/admin', {
        credentials: 'include',
        cache: 'no-store',
    });

    const cars = await readResponse<ApiCar[]>(
        response
    );

    return cars.map(toVehicle);
}

// ========================================
// ДОДАВАННЯ АВТОМОБІЛЯ
// ========================================

// POST /api/cars
export async function createCar(
    payload: CarPayload
): Promise<Vehicle> {
    const car = await sendJson<ApiCar>(
        '/api/cars',
        'POST',
        payload
    );

    return toVehicle(car);
}

// ========================================
// РЕДАГУВАННЯ АВТОМОБІЛЯ
// ========================================

// PUT /api/cars/{id}
export async function updateCar(
    id: number,
    payload: CarPayload
): Promise<Vehicle> {
    const car = await sendJson<ApiCar>(
        `/api/cars/${id}`,
        'PUT',
        payload
    );

    return toVehicle(car);
}

// ========================================
// ЗАВАНТАЖЕННЯ ФОТОГРАФІЙ
// ========================================

// POST /api/car-photos
export async function uploadCarPhoto(
    file: File
): Promise<string> {
    const csrfToken = await getCsrfToken();

    const formData = new FormData();

    formData.append('file', file);

    const response = await fetch(
        '/api/car-photos',
        {
            method: 'POST',
            credentials: 'include',

            headers: {
                'X-CSRF-TOKEN': csrfToken,
            },

            body: formData,
        }
    );

    const result = await readResponse<{
        url: string;
        thumbnailUrl?: string;
    }>(response);

    // React зберігає основне WebP.
    // Прев'ю використовуватимемо в каталозі.
    return result.url;
}

// ========================================
// ВИДАЛЕННЯ АВТОМОБІЛЯ
// ========================================

// DELETE /api/cars/{id}
export async function deleteCar(
    id: number
): Promise<void> {
    const csrfToken = await getCsrfToken();

    const response = await fetch(
        `/api/cars/${id}`,
        {
            method: 'DELETE',
            credentials: 'include',

            headers: {
                'X-CSRF-TOKEN': csrfToken,
            },
        }
    );

    if (response.status === 401) {
        throw new Error(
            'Сесія завершилася. Увійди в адмін-панель повторно.'
        );
    }

    if (response.status === 403) {
        throw new Error(
            'Недостатньо прав для видалення автомобіля.'
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Автомобіль уже видалено або його не знайдено.'
        );
    }

    if (!response.ok) {
        throw new Error(
            `Не вдалося видалити автомобіль. Код: ${response.status}`
        );
    }

    // Успішне видалення: 204 No Content.
}
