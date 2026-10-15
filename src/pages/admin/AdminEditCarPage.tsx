
import { useEffect, useRef, useState } from 'react';

import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';

import {
    ArrowLeft,
    ArrowRight,
    ImagePlus,
    Star,
    Trash2,
} from 'lucide-react';

import AdminVehicleForm from '../../components/admin/AdminVehicleForm';
import type {
    AdminVehicleFormValues,
} from '../../components/admin/AdminVehicleForm';

import type { Vehicle } from '../../types/vehicle';

import { getVehicleStatus } from '../../types/vehicleStatus';

import {
    toCarPayload,
    updateCar,
    uploadCarPhoto,
} from '../../api/carsApi';

type Props = {
    vehicles: Vehicle[];
    onSave: (vehicle: Vehicle) => void;
};

type EditablePhoto = {
    id: number;
    url: string;
    name: string;
    file?: File;
};

const MAX_PHOTOS = 50;
const MAX_FILE_SIZE = 15 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
]);

function createInitialPhotos(
    vehicle: Vehicle
): EditablePhoto[] {
    const urls = vehicle.images?.length
        ? vehicle.images
        : vehicle.image
            ? [vehicle.image]
            : [];

    return urls.map((url, index) => ({
        id: index + 1,
        url,
        name: `Фото ${index + 1}`,
    }));
}

function toFormValues(
    vehicle: Vehicle
): AdminVehicleFormValues {
    return {
        brand: vehicle.brand,
        model: vehicle.model,
        year: String(vehicle.year),
        price: String(vehicle.price),
        mileage: String(vehicle.mileage),
        bodyType: vehicle.bodyType,
        status: getVehicleStatus(vehicle.status),
        fuelType: vehicle.fuelType,
        engineVolume:
            vehicle.engineVolume == null
                ? ''
                : String(vehicle.engineVolume),
        transmission: vehicle.transmission ?? '',
        drivetrain: vehicle.drivetrain ?? '',
        powerHp:
            vehicle.powerHp == null
                ? ''
                : String(vehicle.powerHp),
        payloadKg:
            vehicle.payloadKg == null
                ? ''
                : String(vehicle.payloadKg),
        grossWeightKg:
            vehicle.grossWeightKg == null
                ? ''
                : String(vehicle.grossWeightKg),
        length:
            vehicle.bodyDimensions?.length == null
                ? ''
                : String(vehicle.bodyDimensions.length),
        width:
            vehicle.bodyDimensions?.width == null
                ? ''
                : String(vehicle.bodyDimensions.width),
        height:
            vehicle.bodyDimensions?.height == null
                ? ''
                : String(vehicle.bodyDimensions.height),
        equipment:
            vehicle.equipment?.join('\n') ?? '',
        description:
            vehicle.description ?? '',
        youtubeVideoId:
            vehicle.youtubeVideoId ?? '',
    };
}

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

        if (
            host === 'youtu.be' ||
            host === 'www.youtu.be'
        ) {
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

export default function AdminEditCarPage({
                                             vehicles,
                                             onSave,
                                         }: Props) {
    const { id } = useParams<{ id: string }>();

    const vehicle = vehicles.find(
        item => String(item.id) === id
    );

    if (!vehicle) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">

                <h1 className="text-2xl font-extrabold">
                    Автомобіль не знайдено
                </h1>

                <Link
                    to="/admin/cars"
                    className="mt-5 inline-block font-bold text-yellow-600 dark:text-yellow-400"
                >
                    Повернутися до списку
                </Link>

            </div>
        );
    }

    return (
        <VehicleEditor
            key={vehicle.id}
            vehicle={vehicle}
            onSave={onSave}
        />
    );
}

function VehicleEditor({
                           vehicle,
                           onSave,
                       }: {
    vehicle: Vehicle;
    onSave: (vehicle: Vehicle) => void;
}) {
    const navigate = useNavigate();

    const [photos, setPhotos] =
        useState<EditablePhoto[]>(
            () => createInitialPhotos(vehicle)
        );

    const [error, setError] = useState('');
    const [photoError, setPhotoError] = useState('');
    const [saving, setSaving] = useState(false);

    const fileInputRef =
        useRef<HTMLInputElement>(null);

    const nextPhotoId = useRef(1000);

    const newUrls = useRef(
        new Set<string>()
    );

    useEffect(() => {
        const urls = newUrls.current;

        return () => {
            urls.forEach(url => {
                URL.revokeObjectURL(url);
            });

            urls.clear();
        };
    }, []);

    function removePhoto(id: number) {
        if (saving) return;

        const photo = photos.find(
            item => item.id === id
        );

        if (photo?.file) {
            URL.revokeObjectURL(photo.url);
            newUrls.current.delete(photo.url);
        }

        setPhotos(previous =>
            previous.filter(item => item.id !== id)
        );

        setError('');
        setPhotoError('');
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
            const [item] = updated.splice(from, 1);
            updated.splice(to, 0, item);

            return updated;
        });

        setError('');
    }

    function makeCover(id: number) {
        if (saving) return;

        setPhotos(previous => {
            const index = previous.findIndex(
                item => item.id === id
            );

            if (index <= 0) return previous;

            const updated = [...previous];
            const [photo] = updated.splice(index, 1);

            return [photo, ...updated];
        });

        setError('');
    }

    function addPhotos(files: File[]) {
        if (saving) return;

        setPhotoError('');
        setError('');

        const remaining =
            MAX_PHOTOS - photos.length;

        if (remaining <= 0) {
            setPhotoError(
                'До одного авто можна додати максимум 50 фото.'
            );
            return;
        }

        const accepted: File[] = [];
        let rejected = 0;

        for (const file of files) {
            if (
                !ALLOWED_TYPES.has(file.type) ||
                file.size === 0 ||
                file.size > MAX_FILE_SIZE ||
                accepted.length >= remaining
            ) {
                rejected++;
                continue;
            }

            accepted.push(file);
        }

        const added: EditablePhoto[] =
            accepted.map(file => {
                const url =
                    URL.createObjectURL(file);

                newUrls.current.add(url);

                return {
                    id: nextPhotoId.current++,
                    url,
                    name: file.name,
                    file,
                };
            });

        setPhotos(previous => [
            ...previous,
            ...added,
        ]);

        if (rejected) {
            setPhotoError(
                `Пропущено ${rejected} фото. ` +
                'Дозволені JPG, PNG, WebP, AVIF ' +
                'до 15 МБ, максимум 50 фото.'
            );
        }
    }

    function resetPhotos() {
        if (saving) return;

        newUrls.current.forEach(url => {
            URL.revokeObjectURL(url);
        });

        newUrls.current.clear();

        setPhotos(
            createInitialPhotos(vehicle)
        );

        setPhotoError('');
        setError('');
    }

    async function saveChanges(
        values: AdminVehicleFormValues
    ) {
        if (saving) return;

        setError('');

        if (photos.length === 0) {
            setError(
                'Залиш хоча б одну фотографію автомобіля.'
            );
            return;
        }

        const youtubeInput =
            values.youtubeVideoId.trim();

        const youtubeId = normalizeYoutubeId(
            youtubeInput
        );

        if (youtubeInput && !youtubeId) {
            setError(
                'Перевір посилання або ID YouTube-відео.'
            );
            return;
        }

        const price = Number(values.price);
        const mileage = Number(values.mileage);

        if (
            !Number.isFinite(price) ||
            price <= 0
        ) {
            setError(
                'Ціна має бути більшою за нуль.'
            );
            return;
        }

        if (
            !Number.isInteger(mileage) ||
            mileage < 0
        ) {
            setError(
                'Перевір пробіг автомобіля.'
            );
            return;
        }

        setSaving(true);

        try {
            // Старі фото вже мають серверну адресу.
            // Завантажуємо тільки нові файли.
            const imageUrls: string[] = [];

            for (const photo of photos) {
                if (photo.file) {
                    const url = await uploadCarPhoto(
                        photo.file
                    );

                    imageUrls.push(url);
                } else {
                    imageUrls.push(photo.url);
                }
            }

            const payload = toCarPayload(
                values,
                imageUrls,
                youtubeId
            );

            // Справжнє оновлення в PostgreSQL
            const savedVehicle = await updateCar(
                vehicle.id,
                payload
            );

            // Оновлюємо React
            onSave(savedVehicle);

            navigate('/admin/cars', {
                state: {
                    savedVehicleId: savedVehicle.id,
                },
            });
        } catch (reason) {
            setError(
                reason instanceof Error
                    ? reason.message
                    : 'Не вдалося зберегти зміни.'
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-7">

            <Link
                to="/admin/cars"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-yellow-600 dark:text-gray-400"
            >
                <ArrowLeft size={18} />
                Назад до автомобілів
            </Link>

            <div>
                <p className="text-sm font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                    Редагування оголошення
                </p>

                <h1 className="mt-2 text-3xl font-extrabold text-gray-950 sm:text-4xl dark:text-white">
                    {vehicle.brand} {vehicle.model}
                </h1>

                <p className="mt-3 text-gray-500 dark:text-gray-400">
                    Автомобіль #{vehicle.id} — редагуй характеристики,
                    статус і фотографії.
                </p>
            </div>

            <div className="rounded-xl border border-green-400/40 bg-green-50 p-4 text-sm text-gray-700 dark:bg-green-400/10 dark:text-gray-300">
                Зміни зберігатимуться в PostgreSQL.
                Після оновлення сторінки вони залишаться.
            </div>

            {saving && (
                <p
                    role="status"
                    className="rounded-xl border border-yellow-400/40 bg-yellow-50 p-4 font-semibold text-yellow-800 dark:bg-yellow-400/10 dark:text-yellow-300"
                >
                    Зберігаємо зміни. Не закривай сторінку.
                </p>
            )}

            <AdminVehicleForm
                initialValues={toFormValues(vehicle)}
                submitLabel={
                    saving
                        ? 'Зберігаємо...'
                        : 'Зберегти зміни'
                }
                onSubmit={saveChanges}
                onReset={resetPhotos}
                onDirty={() => setError('')}
                photoUploader={
                    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 dark:border-gray-800 dark:bg-gray-900">

                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                                    Фотографії
                                </h2>

                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Перше фото є головним.
                                    Порядок можна змінювати стрілками.
                                </p>
                            </div>

                            <span className="rounded-lg bg-yellow-400/15 px-3 py-2 text-sm font-bold text-yellow-600 dark:text-yellow-400">
                                {photos.length} / 50
                            </span>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            className="hidden"
                            onChange={event => {
                                addPhotos(
                                    Array.from(
                                        event.target.files ?? []
                                    )
                                );

                                event.currentTarget.value = '';
                            }}
                        />

                        <button
                            type="button"
                            disabled={
                                saving ||
                                photos.length >= MAX_PHOTOS
                            }
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-gray-950 hover:bg-yellow-500 disabled:opacity-50"
                        >
                            <ImagePlus size={19} />
                            Додати фотографії
                        </button>

                        {photoError && (
                            <p
                                role="alert"
                                className="mt-4 text-sm font-semibold text-red-600 dark:text-red-400"
                            >
                                {photoError}
                            </p>
                        )}

                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">

                            {photos.map((photo, index) => (
                                <div
                                    key={photo.id}
                                    className={`overflow-hidden rounded-xl border-2 ${
                                        index === 0
                                            ? 'border-yellow-400'
                                            : 'border-gray-200 dark:border-gray-700'
                                    }`}
                                >
                                    <div className="relative aspect-[4/3]">

                                        <img
                                            src={photo.url}
                                            alt={`Фото автомобіля ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />

                                        {index === 0 && (
                                            <span className="absolute left-2 top-2 rounded-md bg-yellow-400 px-2 py-1 text-xs font-bold text-gray-950">
                                                Головне
                                            </span>
                                        )}

                                    </div>

                                    <div className="p-2">

                                        <p
                                            title={photo.name}
                                            className="truncate text-xs text-gray-500 dark:text-gray-400"
                                        >
                                            {photo.name}
                                        </p>

                                        <div className="mt-2 flex justify-between gap-1">

                                            <button
                                                type="button"
                                                disabled={
                                                    saving ||
                                                    index === 0
                                                }
                                                onClick={() =>
                                                    movePhoto(
                                                        index,
                                                        index - 1
                                                    )
                                                }
                                                aria-label="Перемістити ліворуч"
                                                className="rounded-lg bg-gray-100 p-2 disabled:opacity-30 dark:bg-gray-800"
                                            >
                                                <ArrowLeft size={15} />
                                            </button>

                                            <button
                                                type="button"
                                                disabled={
                                                    saving ||
                                                    index === 0
                                                }
                                                onClick={() =>
                                                    makeCover(photo.id)
                                                }
                                                aria-label="Зробити головним"
                                                className="rounded-lg bg-yellow-400/20 p-2 text-yellow-700 disabled:opacity-30 dark:text-yellow-400"
                                            >
                                                <Star size={15} />
                                            </button>

                                            <button
                                                type="button"
                                                disabled={
                                                    saving ||
                                                    index === photos.length - 1
                                                }
                                                onClick={() =>
                                                    movePhoto(
                                                        index,
                                                        index + 1
                                                    )
                                                }
                                                aria-label="Перемістити праворуч"
                                                className="rounded-lg bg-gray-100 p-2 disabled:opacity-30 dark:bg-gray-800"
                                            >
                                                <ArrowRight size={15} />
                                            </button>

                                            <button
                                                type="button"
                                                disabled={saving}
                                                onClick={() =>
                                                    removePhoto(photo.id)
                                                }
                                                aria-label="Видалити фотографію"
                                                className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 dark:bg-red-500/10"
                                            >
                                                <Trash2 size={15} />
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>

                        {photos.length === 0 && (
                            <p className="mt-5 text-sm text-gray-500">
                                Додай фотографії автомобіля.
                            </p>
                        )}

                    </section>
                }
            />

            {error && (
                <p
                    role="alert"
                    className="rounded-xl border border-red-300 bg-red-50 p-4 font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                    {error}
                </p>
            )}

        </div>
    );
}
