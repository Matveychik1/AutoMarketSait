
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Expand,
    X,
} from 'lucide-react';

type VehicleGalleryProps = {
    images: string[];
    title: string;
};

const VISIBLE_THUMBNAILS = 5;
const SWIPE_DISTANCE = 50;

export default function VehicleGallery({
                                           images,
                                           title,
                                       }: VehicleGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const touchStartX = useRef<number | null>(null);
    const lastSwipeTime = useRef(0);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const openButtonRef = useRef<HTMLButtonElement>(null);

    const total = images.length;

    const nextImage = useCallback(() => {
        if (total === 0) return;

        setCurrentIndex(previous =>
            (previous + 1) % total
        );
    }, [total]);

    const previousImage = useCallback(() => {
        if (total === 0) return;

        setCurrentIndex(previous =>
            (previous - 1 + total) % total
        );
    }, [total]);

    // Клавіатура та блокування прокручування
    // сторінки під час повноекранного перегляду
    useEffect(() => {
        if (!isFullscreen) return;

        const oldOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        closeButtonRef.current?.focus();

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsFullscreen(false);
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                nextImage();
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                previousImage();
            }

            if (event.key === 'Tab') {
                const buttons = Array.from(
                    document.querySelectorAll<HTMLButtonElement>(
                        '#vehicle-gallery-dialog button:not(:disabled)'
                    )
                );

                const first = buttons[0];
                const last = buttons[buttons.length - 1];

                if (!first || !last) return;

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === last
                ) {
                    event.preventDefault();
                    first.focus();
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = oldOverflow;
            window.removeEventListener('keydown', handleKeyDown);
            openButtonRef.current?.focus();
        };
    }, [isFullscreen, nextImage, previousImage]);

    // Перемикання свайпами
    function handleTouchStart(clientX: number) {
        touchStartX.current = clientX;
    }

    function handleTouchEnd(clientX: number) {
        if (touchStartX.current === null) return;

        const difference = clientX - touchStartX.current;
        touchStartX.current = null;

        if (Math.abs(difference) < SWIPE_DISTANCE) return;

        lastSwipeTime.current = Date.now();

        if (difference < 0) {
            nextImage();
        } else {
            previousImage();
        }
    }

    function openFullscreen() {
        // Не відкриваємо модальне вікно
        // випадково після свайпу
        if (Date.now() - lastSwipeTime.current < 350) {
            return;
        }

        setIsFullscreen(true);
    }

    if (total === 0) {
        return (
            <div className="flex aspect-video items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-800">
                Фотографій поки немає
            </div>
        );
    }

    const activeIndex = Math.min(currentIndex, total - 1);
    const activeImage = images[activeIndex];

    // Відображаємо максимум 5 мініатюр
    const thumbnailStart = Math.min(
        Math.max(0, activeIndex - 2),
        Math.max(0, total - VISIBLE_THUMBNAILS)
    );

    const visibleImages = images.slice(
        thumbnailStart,
        thumbnailStart + VISIBLE_THUMBNAILS
    );

    return (
        <>
            <section
                aria-label={`Фотографії автомобіля ${title}`}
                className="rounded-2xl bg-white p-3 shadow-sm dark:bg-gray-900"
            >
                {/* Основне фото */}
                <div
                    className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
                    onTouchStart={event =>
                        handleTouchStart(event.touches[0].clientX)
                    }
                    onTouchEnd={event =>
                        handleTouchEnd(event.changedTouches[0].clientX)
                    }
                >
                    <img
                        src={activeImage}
                        alt={`${title} — фотографія ${activeIndex + 1}`}
                        className="h-full w-full object-contain"
                    />

                    {/* Відкрити фото на весь екран */}
                    <button
                        ref={openButtonRef}
                        type="button"
                        onClick={openFullscreen}
                        aria-label="Відкрити галерею на весь екран"
                        className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-4 focus-visible:outline-yellow-400"
                    />

                    {/* Кнопка збільшення */}
                    <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-lg bg-black/60 p-2 text-white">
                        <Expand size={20} />
                    </div>

                    {/* Стрілки */}
                    {total > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={previousImage}
                                aria-label="Попереднє фото"
                                className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-yellow-400 hover:text-gray-950"
                            >
                                <ChevronLeft size={25} />
                            </button>

                            <button
                                type="button"
                                onClick={nextImage}
                                aria-label="Наступне фото"
                                className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-yellow-400 hover:text-gray-950"
                            >
                                <ChevronRight size={25} />
                            </button>
                        </>
                    )}

                    {/* Лічильник */}
                    <span className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-lg bg-black/70 px-4 py-2 text-sm font-semibold text-white">
                        {activeIndex + 1} / {total}
                    </span>
                </div>

                {/* Мініатюри */}
                {total > 1 && (
                    <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                        {visibleImages.map((image, index) => {
                            const imageIndex = thumbnailStart + index;
                            const selected = imageIndex === activeIndex;

                            return (
                                <button
                                    key={imageIndex}
                                    type="button"
                                    onClick={() =>
                                        setCurrentIndex(imageIndex)
                                    }
                                    aria-label={`Показати фото ${imageIndex + 1}`}
                                    aria-pressed={selected}
                                    className={`aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                                        selected
                                            ? 'border-yellow-400'
                                            : 'border-transparent hover:border-gray-400'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt=""
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            );
                        })}
                    </div>
                )}

                <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                    Натисніть на фото для збільшення
                </p>
            </section>

            {/* Повноекранна галерея */}
            {isFullscreen && (
                <div
                    id="vehicle-gallery-dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Перегляд фотографій ${title}`}
                    className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white"
                >
                    {/* Верхня панель */}
                    <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-4 sm:px-8">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold sm:text-lg">
                                {title}
                            </p>

                            <p className="text-sm text-gray-400">
                                Фото {activeIndex + 1} із {total}
                            </p>
                        </div>

                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={() => setIsFullscreen(false)}
                            aria-label="Закрити галерею"
                            className="rounded-full bg-white/10 p-3 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-yellow-400"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Повноекранне фото */}
                    <div
                        className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-5 sm:px-16"
                        onTouchStart={event =>
                            handleTouchStart(event.touches[0].clientX)
                        }
                        onTouchEnd={event =>
                            handleTouchEnd(event.changedTouches[0].clientX)
                        }
                    >
                        <img
                            src={activeImage}
                            alt={`${title}, фото ${activeIndex + 1}`}
                            className="max-h-full max-w-full object-contain"
                        />

                        {total > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={previousImage}
                                    aria-label="Попереднє фото"
                                    className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 transition hover:bg-yellow-400 hover:text-black sm:left-5"
                                >
                                    <ChevronLeft size={26} />
                                </button>

                                <button
                                    type="button"
                                    onClick={nextImage}
                                    aria-label="Наступне фото"
                                    className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 transition hover:bg-yellow-400 hover:text-black sm:right-5"
                                >
                                    <ChevronRight size={26} />
                                </button>
                            </>
                        )}
                    </div>

                    <p className="shrink-0 px-4 pb-5 text-center text-xs text-gray-400">
                        Стрілки клавіатури — перемикання • Esc — закрити
                    </p>
                </div>
            )}
        </>
    );
}
