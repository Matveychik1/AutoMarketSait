
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ArrowLeft, Info } from 'lucide-react';

import AdminVehicleForm from '../../components/admin/AdminVehicleForm';
import type {
    AdminVehicleFormValues,
} from '../../components/admin/AdminVehicleForm';

import VehiclePhotoUploader from '../../components/admin/VehiclePhotoUploader';
import type {
    AdminVehiclePhoto,
} from '../../components/admin/VehiclePhotoUploader';

import type { Vehicle } from '../../types/vehicle';

import {
    createCar,
    toCarPayload,
    uploadCarPhoto,
} from '../../api/carsApi';

type Props = {
    vehicles: Vehicle[];
    onCreate: (vehicle: Vehicle) => void;
};

const MAX_PHOTOS = 50;
const MAX_PHOTO_SIZE = 15 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
]);

function normalizeYoutubeId(
    input: string
): string | null {
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

        const host = url.hostname.toLowerCase();

        let id: string | null | undefined;

        if (host === 'youtu.be' ||
            host === 'www.youtu.be') {
            id = url.pathname.split('/')[1];
        } else if (
            [
                'youtube.com',
                'www.youtube.com',
                'm.youtube.com',
                'youtube-nocookie.com',
                'www.youtube-nocookie.com',
            ].includes(host)
        ) {
            if (url.pathname === '/watch') {
                id = url.searchParams.get('v');
            } else {
                const parts = url.pathname
                    .split('/')
                    .filter(Boolean);

                if (
                    ['shorts', 'embed', 'live'].includes(
                        parts[0]
                    )
                ) {
                    id = parts[1];
                }
            }
        }

        return id &&
        /^[A-Za-z0-9_-]{11}$/.test(id)
            ? id
            : null;
    } catch {
        return null;
    }
}

export default function AdminNewCarPage({
                                            onCreate,
                                        }: Props) {
    const navigate = useNavigate();

    const [photos, setPhotos] =
        useState<AdminVehiclePhoto[]>([]);

    const [photoError, setPhotoError] = useState('');
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    const nextPhotoId = useRef(1);
    const photoUrls = useRef(new Set<string>());

    // Blob URL використовуємо тільки для прев'ю.
    // Серверні фотографії матимуть постійні URL.
    useEffect(() => {
        const urls = photoUrls.current;

        return () => {
            urls.forEach(url => {
                URL.revokeObjectURL(url);
            });

            urls.clear();
        };
    }, []);

    function clearMessages() {
        setFormError('');
    }

    function addPhotos(files: File[]) {
        if (saving) return;

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
            const validType = ALLOWED_TYPES.has(
                file.type
            );

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

        if (skipped) {
            setPhotoError(
                `Пропущено ${skipped} фото. ` +
                'Дозволені JPG, PNG, WebP, AVIF ' +
                'до 15 МБ. Ліміт — 50 фотографій.'
            );
        } else {
            setPhotoError('');
        }
    }

    function removePhoto(id: number) {
        if (saving) return;

        const photo = photos.find(
            item => item.id === id
        );

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

    function movePhoto(from: number, to: number) {
        if (saving) return;

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

    function setCoverPhoto(id: number) {
        if (saving) return;

        setPhotos(previous => {
            const index = previous.findIndex(
                photo => photo.id === id
            );

            if (index <= 0) return previous;

            const updated = [...previous];
            const [cover] = updated.splice(index, 1);

            return [cover, ...updated];
        });

        clearMessages();
    }

    function resetPhotos() {
        if (saving) return;

        photoUrls.current.forEach(url => {
            URL.revokeObjectURL(url);
        });

        photoUrls.current.clear();

        setPhotos([]);
        setPhotoError('');
        setFormError('');
    }

    async function createVehicle(
        values: AdminVehicleFormValues
    ) {
        if (saving) return;

        setFormError('');
        setPhotoError('');

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

        const year = Number(values.year);
        const price = Number(values.price);
        const mileage = Number(values.mileage);

        const currentYear = new Date().getFullYear();

        if (
            !Number.isInteger(year) ||
            year < 2010 ||
            year > currentYear + 1
        ) {
            setFormError(
                'Перевір рік випуску автомобіля.'
            );
            return;
        }

        if (
            !Number.isFinite(price) ||
            price <= 0
        ) {
            setFormError(
                'Ціна має бути більшою за нуль.'
            );
            return;
        }

        if (
            !Number.isInteger(mileage) ||
            mileage < 0
        ) {
            setFormError(
                'Перевір пробіг автомобіля.'
            );
            return;
        }

        const numericFields = [
            values.engineVolume,
            values.powerHp,
            values.payloadKg,
            values.grossWeightKg,
            values.length,
            values.width,
            values.height,
        ];

        if (numericFields.some(value =>
            value.trim() !== '' &&
            (
                !Number.isFinite(Number(value)) ||
                Number(value) < 0
            )
        )) {
            setFormError(
                'Перевір технічні характеристики.'
            );
            return;
        }

        if (
            values.engineVolume.trim() !== '' &&
            Number(values.engineVolume) <= 0
        ) {
            setFormError(
                'Об’єм двигуна має бути більшим за нуль.'
            );
            return;
        }

        const youtubeInput =
            values.youtubeVideoId.trim();

        const youtubeId = normalizeYoutubeId(
            youtubeInput
        );

        if (youtubeInput && !youtubeId) {
            setFormError(
                'Вкажи правильне посилання або ID YouTube-відео.'
            );
            return;
        }

        setSaving(true);

        try {
            // 1. Завантажуємо фото на сервер.
            // Порядок зберігається:
            // перше фото — обкладинка.
            const imageUrls: string[] = [];

            for (const photo of photos) {
                const url = await uploadCarPhoto(
                    photo.file
                );

                imageUrls.push(url);
            }

            // 2. Формуємо дані автомобіля.
            const payload = toCarPayload(
                values,
                imageUrls,
                youtubeId
            );

            // 3. Записуємо автомобіль у PostgreSQL.
            // ID автоматично створює база.
            const savedVehicle = await createCar(
                payload
            );

            // 4. Оновлюємо стан React.
            onCreate(savedVehicle);

            // 5. Повертаємося до списку.
            navigate('/admin/cars', {
                state: {
                    savedVehicleId: savedVehicle.id,
                    createdVehicle: true,
                },
            });
        } catch (error) {
            setFormError(
                error instanceof Error
                    ? error.message
                    : 'Не вдалося зберегти автомобіль.'
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-7">

            <Link
                to="/admin/cars"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-yellow-600 dark:text-gray-400"
            >
                <ArrowLeft size={18} />
                Назад до автомобілів
            </Link>

            <div>
                <p className="text-sm font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                    Керування каталогом
                </p>

                <h1 className="mt-2 text-3xl font-extrabold text-gray-950 sm:text-4xl dark:text-white">
                    Додати автомобіль
                </h1>

                <p className="mt-3 text-gray-500 dark:text-gray-400">
                    Заповни характеристики, додай фотографії
                    та опублікуй автомобіль у каталозі.
                </p>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-green-400/40 bg-green-50 p-4 dark:bg-green-400/10">
                <Info
                    size={21}
                    className="mt-0.5 shrink-0 text-green-600 dark:text-green-400"
                />

                <div>
                    <p className="font-bold text-gray-900 dark:text-green-400">
                        Збереження на сервері
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        Дані зберігатимуться в PostgreSQL,
                        а фотографії — на сервері.
                        Після оновлення сторінки автомобіль
                        залишиться в каталозі.
                    </p>
                </div>
            </div>

            {saving && (
                <p
                    role="status"
                    className="rounded-xl border border-yellow-400/40 bg-yellow-50 p-4 font-semibold text-yellow-800 dark:bg-yellow-400/10 dark:text-yellow-300"
                >
                    Завантажуємо фотографії та зберігаємо
                    автомобіль. Не закривай сторінку.
                </p>
            )}

            <AdminVehicleForm
                submitLabel={
                    saving
                        ? 'Зберігаємо...'
                        : 'Додати в каталог'
                }
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
