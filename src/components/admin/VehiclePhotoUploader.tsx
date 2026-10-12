
import { useRef } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Crown,
    ImagePlus,
    Trash2,
    UploadCloud,
} from 'lucide-react';

export type AdminVehiclePhoto = {
    id: number;
    file: File;
    previewUrl: string;
};

type Props = {
    photos: AdminVehiclePhoto[];
    onAdd: (files: File[]) => void;
    onRemove: (id: number) => void;
    onMove: (from: number, to: number) => void;
    onSetCover: (id: number) => void;
    error: string;
};

const MAX_PHOTOS = 50;

export default function VehiclePhotoUploader({
                                                 photos,
                                                 onAdd,
                                                 onRemove,
                                                 onMove,
                                                 onSetCover,
                                                 error,
                                             }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const draggedIndex = useRef<number | null>(null);

    function handleDropFiles(event: React.DragEvent) {
        event.preventDefault();

        if (event.dataTransfer.files.length > 0) {
            onAdd(Array.from(event.dataTransfer.files));
        }
    }

    function handlePhotoDrop(
        event: React.DragEvent,
        targetIndex: number
    ) {
        event.preventDefault();
        event.stopPropagation();

        const sourceIndex = draggedIndex.current;

        if (
            sourceIndex !== null &&
            sourceIndex !== targetIndex
        ) {
            onMove(sourceIndex, targetIndex);
        }

        draggedIndex.current = null;
    }

    return (
        <section
            id="admin-photo-upload"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 dark:border-gray-800 dark:bg-gray-900"
        >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                        Фотографії автомобіля
                    </h2>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Перша фотографія буде головною в каталозі.
                    </p>
                </div>

                <span className="rounded-lg bg-yellow-400/15 px-3 py-2 text-sm font-bold text-yellow-600 dark:text-yellow-400">
                    {photos.length} / {MAX_PHOTOS}
                </span>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="hidden"
                onChange={event => {
                    const files = Array.from(
                        event.target.files ?? []
                    );

                    onAdd(files);
                    event.currentTarget.value = '';
                }}
            />

            <div
                onDragOver={event => event.preventDefault()}
                onDrop={handleDropFiles}
                className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-yellow-400 sm:p-10 dark:border-gray-700 dark:bg-gray-800/50"
            >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-600 dark:text-yellow-400">
                    <UploadCloud size={29} />
                </div>

                <p className="mt-4 font-bold text-gray-900 dark:text-white">
                    Перетягни сюди фотографії
                </p>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    JPG, PNG, WebP, AVIF — до 15 МБ за фото
                </p>

                <button
                    type="button"
                    disabled={photos.length >= MAX_PHOTOS}
                    onClick={() => inputRef.current?.click()}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-gray-950 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ImagePlus size={19} />
                    Обрати фотографії
                </button>
            </div>

            {error && (
                <p
                    role="alert"
                    className="mt-4 text-sm font-semibold text-red-600 dark:text-red-400"
                >
                    {error}
                </p>
            )}

            {photos.length > 0 && (
                <>
                    <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                        Перетягуй фото для зміни порядку або використовуй стрілки.
                        Натисни «Головне», щоб обрати обкладинку.
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                        {photos.map((photo, index) => (
                            <div
                                key={photo.id}
                                draggable
                                onDragStart={event => {
                                    draggedIndex.current = index;
                                    event.dataTransfer.effectAllowed = 'move';
                                }}
                                onDragEnd={() => {
                                    draggedIndex.current = null;
                                }}
                                onDragOver={event => {
                                    event.preventDefault();
                                }}
                                onDrop={event =>
                                    handlePhotoDrop(event, index)
                                }
                                className={`overflow-hidden rounded-xl border-2 bg-gray-50 dark:bg-gray-800 ${
                                    index === 0
                                        ? 'border-yellow-400'
                                        : 'border-gray-200 dark:border-gray-700'
                                }`}
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={photo.previewUrl}
                                        alt={`Фотографія ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />

                                    <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-bold text-white">
                                        {index + 1}
                                    </span>

                                    {index === 0 && (
                                        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-yellow-400 px-2 py-1 text-xs font-bold text-gray-950">
                                            <Crown size={13} />
                                            Головне
                                        </span>
                                    )}
                                </div>

                                <div className="p-2">
                                    <p
                                        title={photo.file.name}
                                        className="truncate text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        {photo.file.name}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between gap-1">
                                        <button
                                            type="button"
                                            disabled={index === 0}
                                            onClick={() =>
                                                onMove(index, index - 1)
                                            }
                                            aria-label={`Перемістити фото ${index + 1} ліворуч`}
                                            className="rounded-lg bg-gray-200 p-2 disabled:opacity-30 dark:bg-gray-700"
                                        >
                                            <ArrowLeft size={15} />
                                        </button>

                                        <button
                                            type="button"
                                            disabled={index === 0}
                                            onClick={() =>
                                                onSetCover(photo.id)
                                            }
                                            title="Зробити головним фото"
                                            aria-label={`Зробити фото ${index + 1} головним`}
                                            className="rounded-lg bg-yellow-400/20 p-2 text-yellow-700 disabled:opacity-30 dark:text-yellow-400"
                                        >
                                            <Crown size={15} />
                                        </button>

                                        <button
                                            type="button"
                                            disabled={index === photos.length - 1}
                                            onClick={() =>
                                                onMove(index, index + 1)
                                            }
                                            aria-label={`Перемістити фото ${index + 1} праворуч`}
                                            className="rounded-lg bg-gray-200 p-2 disabled:opacity-30 dark:bg-gray-700"
                                        >
                                            <ArrowRight size={15} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onRemove(photo.id)
                                            }
                                            aria-label={`Видалити фото ${index + 1}`}
                                            className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 dark:bg-red-500/10"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
