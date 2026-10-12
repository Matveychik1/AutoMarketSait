
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
    ArrowLeft,
    Info,
} from 'lucide-react';

import AdminVehicleForm from '../../components/admin/AdminVehicleForm';
import type {
    AdminVehicleFormValues,
} from '../../components/admin/AdminVehicleForm';

import VehiclePhotoUploader from '../../components/admin/VehiclePhotoUploader';
import type {
    AdminVehiclePhoto,
} from '../../components/admin/VehiclePhotoUploader';

import type { Vehicle } from '../../types/vehicle';

// ========================================
// ТИПИ
// ========================================

type Props = {
    vehicles: Vehicle[];
    onCreate: (vehicle: Vehicle) => void;
};

// ========================================
// НАЛАШТУВАННЯ ФОТО
// ========================================

const MAX_PHOTOS = 50;
const MAX_PHOTO_SIZE = 15 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
]);

// ========================================
// ДОПОМІЖНІ ФУНКЦІЇ
// ========================================

function optionalNumber(
    value: string
): number | undefined {
    return value.trim() === ''
        ? undefined
        : Number(value);
}

function getYoutubeId(input: string): string | null {
    const value = input.trim();

    if (!value) return null;

    if (/^[A-Za-z0-9_-]{11}$/.test(value)) {
        return value;
    }

    try {
        const url = new URL(value);

        if (
            url.protocol !== 'https:' &&
            url.protocol !== 'http:'
        ) {
            return null;
        }

        const hostname = url.hostname.toLowerCase();

        let videoId: string | null | undefined;

        if (
            hostname === 'youtu.be' ||
            hostname === 'www.youtu.be'
        ) {
            videoId = url.pathname.split('/')[1];
        } else if (
            [
                'youtube.com',
                'www.youtube.com',
                'm.youtube.com',
                'youtube-nocookie.com',
                'www.youtube-nocookie.com',
            ].includes(hostname)
        ) {
            if (url.pathname === '/watch') {
                videoId = url.searchParams.get('v');
            } else {
                const parts = url.pathname
                    .split('/')
                    .filter(Boolean);

                if (
                    ['shorts', 'embed', 'live'].includes(
                        parts[0]
                    )
                ) {
                    videoId = parts[1];
                }
            }
        }

        return videoId &&
        /^[A-Za-z0-9_-]{11}$/.test(videoId)
            ? videoId
            : null;
    } catch {
        return null;
    }
}

// ========================================
// ГОЛОВНА СТОРІНКА ДОДАВАННЯ
// ========================================

export default function AdminNewCarPage({
                                            vehicles,
                                            onCreate,
                                        }: Props) {
    const navigate = useNavigate();

    // ========================================
    // ФОТОГРАФІЇ
    // ========================================

    const [photos, setPhotos] =
        useState<AdminVehiclePhoto[]>([]);

    const [photoError, setPhotoError] =
        useState('');

    const [formError, setFormError] =
        useState('');

    const nextPhotoId = useRef(1);

    // Тимчасові адреси фотографій
    const photoUrls = useRef(new Set<string>());

    // Після збереження ці фото вже належать
    // автомобілю в тестовому каталозі.
    const keepPhotosAfterSave = useRef(false);

    // Звільняємо пам'ять для незбережених фото,
    // коли користувач залишає сторінку.
    useEffect(() => {
        const urls = photoUrls.current;
        const keepRef = keepPhotosAfterSave;

        return () => {
            if (!keepRef.current) {
                urls.forEach(url => {
                    URL.revokeObjectURL(url);
                });

                urls.clear();
            }
        };
    }, []);

    function clearMessages() {
        setFormError('');
    }

    // ========================================
    // ДОДАВАННЯ ФОТОГРАФІЙ
    // ========================================

    function addPhotos(files: File[]) {
        clearMessages();

        const remaining = MAX_PHOTOS - photos.length;

        if (remaining <= 0) {
            setPhotoError(
                'Максимальна кількість — 50 фотографій.'
            );
            return;
        }

        const accepted: File[] = [];
        let skipped = 0;

        for (const file of files) {
            const validType = ALLOWED_TYPES.has(file.type);

            const validSize =
                file.size > 0 &&
                file.size <= MAX_PHOTO_SIZE;

            if (
                !validType ||
                !validSize ||
                accepted.length >= remaining
            ) {
                skipped++;
                continue;
            }

            accepted.push(file);
        }

        const newPhotos: AdminVehiclePhoto[] =
            accepted.map(file => {
                const previewUrl =
                    URL.createObjectURL(file);

                photoUrls.current.add(previewUrl);

                return {
                    id: nextPhotoId.current++,
                    file,
                    previewUrl,
                };
            });

        setPhotos(previous => [
            ...previous,
            ...newPhotos,
        ]);

        if (skipped > 0) {
            setPhotoError(
                `Пропущено ${skipped} фото. ` +
                'Дозволені JPG, PNG, WebP, AVIF ' +
                'до 15 МБ. Ліміт — 50 фотографій.'
            );
        } else {
            setPhotoError('');
        }
    }

    // ========================================
    // ВИДАЛЕННЯ ФОТОГРАФІЇ
    // ========================================

    function removePhoto(id: number) {
        const photo = photos.find(item => item.id === id);

        if (photo) {
            URL.revokeObjectURL(photo.previewUrl);
            photoUrls.current.delete(photo.previewUrl);
        }

        setPhotos(previous =>
            previous.filter(item => item.id !== id)
        );

        setPhotoError('');
        clearMessages();
    }

    // ========================================
    // ПЕРЕМІЩЕННЯ ФОТОГРАФІЇ
    // ========================================

    function movePhoto(from: number, to: number) {
        if (
            from < 0 ||
            to < 0 ||
            from >= photos.length ||
            to >= photos.length ||
            from === to
        ) {
            return;
        }

        setPhotos(previous => {
            const updated = [...previous];

            const [moved] = updated.splice(from, 1);

            updated.splice(to, 0, moved);

            return updated;
        });

        clearMessages();
    }

    // ========================================
    // ВИБІР ГОЛОВНОГО ФОТО
    // ========================================

    function setCoverPhoto(id: number) {
        setPhotos(previous => {
            const index = previous.findIndex(
                photo => photo.id === id
            );

            if (index <= 0) {
                return previous;
            }

            const updated = [...previous];

            const [cover] = updated.splice(index, 1);

            return [cover, ...updated];
        });

        clearMessages();
    }

    // ========================================
    // ОЧИЩЕННЯ ФОТОГРАФІЙ
    // ========================================

    function resetPhotos() {
        photoUrls.current.forEach(url => {
            URL.revokeObjectURL(url);
        });

        photoUrls.current.clear();

        setPhotos([]);
        setPhotoError('');
        setFormError('');
    }

    // ========================================
    // ЗБЕРЕЖЕННЯ НОВОГО АВТОМОБІЛЯ
    // ========================================

    function createVehicle(
        values: AdminVehicleFormValues
    ) {
        setFormError('');
        setPhotoError('');

        // Перевірка фотографій
        if (photos.length === 0) {
            setPhotoError(
                'Додай хоча б одну фотографію автомобіля.'
            );

            document
                .getElementById('admin-photo-upload')
                ?.scrollIntoView({
                    block: 'center',
                    behavior: 'smooth',
                });

            return;
        }

        // Перевірка основних значень
        const year = Number(values.year);
        const price = Number(values.price);
        const mileage = Number(values.mileage);

        const currentYear = new Date().getFullYear();

        if (
            !Number.isInteger(year) ||
            year < 1900 ||
            year > currentYear + 1
        ) {
            setFormError('Перевір рік випуску автомобіля.');
            return;
        }

        if (!Number.isFinite(price) || price <= 0) {
            setFormError(
                'Ціна має бути більшою за 0.'
            );
            return;
        }

        if (
            !Number.isFinite(mileage) ||
            mileage < 0
        ) {
            setFormError('Перевір пробіг автомобіля.');
            return;
        }

        // Перевірка необов'язкових числових полів
        const numericFields = [
            values.engineVolume,
            values.powerHp,
            values.payloadKg,
            values.grossWeightKg,
            values.length,
            values.width,
            values.height,
        ];

        if (
            numericFields.some(value =>
                value.trim() !== '' &&
                (
                    !Number.isFinite(Number(value)) ||
                    Number(value) < 0
                )
            )
        ) {
            setFormError(
                'Технічні характеристики не можуть бути від’ємними.'
            );
            return;
        }

        if (
            values.engineVolume.trim() !== '' &&
            Number(values.engineVolume) <= 0
        ) {
            setFormError(
                'Об’єм двигуна має бути більшим за 0.'
            );
            return;
        }

        // Перевірка YouTube
        const youtubeInput =
            values.youtubeVideoId.trim();

        const youtubeId = youtubeInput
            ? getYoutubeId(youtubeInput)
            : undefined;

        if (youtubeInput && !youtubeId) {
            setFormError(
                'Вкажи правильне посилання або ID YouTube-відео.'
            );
            return;
        }

        // Наступний вільний ID
        const nextVehicleId =
            Math.max(0, ...vehicles.map(v => v.id)) + 1;

        // Комплектація — один пункт на рядок
        const equipment = values.equipment
            .split('\n')
            .map(item => item.trim())
            .filter(Boolean);

        // Розміри кузова
        const dimensions = {
            length: optionalNumber(values.length),
            width: optionalNumber(values.width),
            height: optionalNumber(values.height),
        };

        const hasDimensions = Object.values(
            dimensions
        ).some(value => value !== undefined);

        // Порядок фото зберігається:
        // перше зображення — обкладинка.
        const images = photos.map(
            photo => photo.previewUrl
        );

        // ========================================
        // НОВИЙ АВТОМОБІЛЬ
        // ========================================

        const newVehicle: Vehicle = {
            id: nextVehicleId,

            brand: values.brand.trim(),
            model: values.model.trim(),

            year,
            price,
            mileage,

            bodyType: values.bodyType,
            fuelType: values.fuelType,
            status: values.status,

            engineVolume: optionalNumber(
                values.engineVolume
            ) ?? null,

            transmission:
                values.transmission || undefined,

            drivetrain:
                values.drivetrain || undefined,

            powerHp: optionalNumber(values.powerHp),

            payloadKg: optionalNumber(
                values.payloadKg
            ),

            grossWeightKg: optionalNumber(
                values.grossWeightKg
            ),

            bodyDimensions: hasDimensions
                ? dimensions
                : undefined,

            equipment,

            description:
                values.description.trim(),

            youtubeVideoId: youtubeId ?? undefined,

            image: images[0],
            images,

            addedAt: new Date().toISOString(),
        };

        // Передаємо автомобіль у стан App.tsx
        onCreate(newVehicle);

        // Фото залишаються доступними для каталогу,
        // доки працює поточна сесія.
        keepPhotosAfterSave.current = true;

        // Повертаємося до списку
        navigate('/admin/cars', {
            state: {
                savedVehicleId: newVehicle.id,
                createdVehicle: true,
            },
        });
    }

    // ========================================
    // JSX
    // ========================================

    return (
        <div className="space-y-7">

            {/* Повернення */}
            <Link
                to="/admin/cars"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-yellow-600 dark:text-gray-400"
            >
                <ArrowLeft size={18} />
                Назад до автомобілів
            </Link>

            {/* Заголовок */}
            <div>
                <p className="text-sm font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                    Керування каталогом
                </p>

                <h1 className="mt-2 text-3xl font-extrabold text-gray-950 sm:text-4xl dark:text-white">
                    Додати автомобіль
                </h1>

                <p className="mt-3 text-gray-500 dark:text-gray-400">
                    Створи нове оголошення, заповни
                    характеристики та додай фотографії.
                </p>
            </div>

            {/* Демо-попередження */}
            <div className="flex items-start gap-3 rounded-xl border border-yellow-400/40 bg-yellow-50 p-4 dark:bg-yellow-400/10">
                <Info
                    size={21}
                    className="mt-0.5 shrink-0 text-yellow-600 dark:text-yellow-400"
                />

                <div>
                    <p className="font-bold text-gray-900 dark:text-yellow-400">
                        Демонстраційне збереження
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        Новий автомобіль одразу з'явиться
                        в каталозі, але після перезавантаження
                        сторінки тестові дані відновляться.
                    </p>
                </div>
            </div>

            {/* Спільна форма */}
            <AdminVehicleForm
                submitLabel="Додати в каталог"
                onSubmit={createVehicle}
                onReset={resetPhotos}
                onDirty={clearMessages}
                photoUploader={
                    <VehiclePhotoUploader
                        photos={photos}
                        onAdd={addPhotos}
                        onRemove={removePhoto}
                        onMove={movePhoto}
                        onSetCover={setCoverPhoto}
                        error={photoError}
                    />
                }
            />

            {/* Повідомлення про помилку */}
            {formError && (
                <p
                    role="alert"
                    className="rounded-xl border border-red-300 bg-red-50 p-5 font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                    {formError}
                </p>
            )}

        </div>
    );
}
