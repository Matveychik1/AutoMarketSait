
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { createPortal } from 'react-dom';

import {
    ChevronLeft,
    ChevronRight,
    Expand,
    ImageOff,
    X,
} from 'lucide-react';

type VehicleGalleryProps = {
    // Основні фотографії автомобіля
    images: string[];

    // Назва автомобіля
    title: string;

    // Необов'язкові оптимізовані мініатюри.
    // Порядок має збігатися з images.
    thumbnailImages?: string[];
};

const VISIBLE_THUMBNAILS = 5;
const SWIPE_DISTANCE = 50;
const SWIPE_CLICK_DELAY = 350;

export default function VehicleGallery({
                                           images,
                                           title,
                                           thumbnailImages,
                                       }: VehicleGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Запам'ятовуємо фото, які не вдалося завантажити
    const [failedImages, setFailedImages] = useState<string[]>([]);

    // Свайпи
    const touchStartX = useRef<number | null>(null);
    const lastSwipeTime = useRef(0);

    // Фокус клавіатури
    const openButtonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    const total = images.length;

    // Не даємо індексу вийти за межі масиву
    const activeIndex = Math.max(
        0,
        Math.min(currentIndex, total - 1)
    );

    const activeImage = images[activeIndex] ?? '';

    const activeImageFailed =
        !activeImage || failedImages.includes(activeImage);

    // ========================================
    // ПЕРЕМИКАННЯ ФОТО
    // ========================================

    const nextImage = useCallback(() => {
        if (total === 0) return;

        setCurrentIndex(previous =>
            (Math.min(previous, total - 1) + 1) % total
        );
    }, [total]);

    const previousImage = useCallback(() => {
        if (total === 0) return;

        setCurrentIndex(previous =>
            (Math.min(previous, total - 1) - 1 + total) % total
        );
    }, [total]);

    // ========================================
    // ПОМИЛКИ ЗАВАНТАЖЕННЯ
    // ========================================

    const markImageFailed = useCallback((src: string) => {
        setFailedImages(previous => {
            if (previous.includes(src)) {
                return previous;
            }

            return [...previous, src];
        });
    }, []);

    // ========================================
    // ПОВНОЕКРАННИЙ РЕЖИМ
    // ========================================

    useEffect(() => {
        if (!isFullscreen) return;

        const previousOverflow = document.body.style.overflow;
        const previousFocus = document.activeElement;
        const openingButton = openButtonRef.current;

        // Забороняємо прокручування сторінки під галереєю
        document.body.style.overflow = 'hidden';

        // Переносимо фокус у діалог
        closeButtonRef.current?.focus();

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                event.preventDefault();
                setIsFullscreen(false);
                return;
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                nextImage();
                return;
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                previousImage();
                return;
            }

            // Утримуємо фокус клавіатури в галереї
            if (event.key === 'Tab') {
                const dialog = dialogRef.current;

                if (!dialog) return;

                const buttons = Array.from(
                    dialog.querySelectorAll<HTMLButtonElement>(
                        'button:not(:disabled)'
                    )
                );

                const firstButton = buttons[0];
                const lastButton = buttons[buttons.length - 1];

                if (!firstButton || !lastButton) {
                    return;
                }

                const activeElement = document.activeElement;

                if (
                    event.shiftKey &&
                    activeElement === firstButton
                ) {
                    event.preventDefault();
                    lastButton.focus();
                } else if (
                    !event.shiftKey &&
                    activeElement === lastButton
                ) {
                    event.preventDefault();
                    firstButton.focus();
                } else if (
                    !dialog.contains(activeElement)
                ) {
                    event.preventDefault();
                    firstButton.focus();
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;

            window.removeEventListener(
                'keydown',
                handleKeyDown
            );

            // Повертаємо фокус туди, звідки відкрили галерею
            if (openingButton?.isConnected) {
                openingButton.focus();
            } else if (previousFocus instanceof HTMLElement) {
                previousFocus.focus();
            }
        };
    }, [
        isFullscreen,
        nextImage,
        previousImage,
    ]);

    // ========================================
    // СВАЙПИ НА ТЕЛЕФОНІ
    // ========================================

    function handleTouchStart(clientX: number) {
        touchStartX.current = clientX;
    }

    function handleTouchEnd(clientX: number) {
        if (touchStartX.current === null) {
            return;
        }

        const difference = clientX - touchStartX.current;

        touchStartX.current = null;

        if (Math.abs(difference) < SWIPE_DISTANCE) {
            return;
        }

        lastSwipeTime.current = Date.now();

        if (difference < 0) {
            nextImage();
        } else {
            previousImage();
        }
    }

    function handleTouchCancel() {
        touchStartX.current = null;
    }

    // ========================================
    // ВІДКРИТТЯ / ЗАКРИТТЯ
    // ========================================

    function openFullscreen() {
        // Не відкриваємо галерею випадково після свайпу
        if (
            Date.now() - lastSwipeTime.current <
            SWIPE_CLICK_DELAY
        ) {
            return;
        }

        setIsFullscreen(true);
    }

    function closeFullscreen() {
        setIsFullscreen(false);
    }

    // ========================================
    // ЯКЩО ФОТО НЕМАЄ
    // ========================================

    if (total === 0) {
        return (
            <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">

                <ImageOff size={36} />

                <p>Фотографій поки немає</p>

            </div>
        );
    }

    // ========================================
    // МІНІАТЮРИ: МАКСИМУМ 5
    // ========================================

    const thumbnailStart = Math.min(
        Math.max(0, activeIndex - 2),
        Math.max(0, total - VISIBLE_THUMBNAILS)
    );

    const visibleImages = images.slice(
        thumbnailStart,
        thumbnailStart + VISIBLE_THUMBNAILS
    );

    // ========================================
    // ПОВНОЕКРАННА ГАЛЕРЕЯ
    // ========================================

    const fullscreenContent = isFullscreen ? (
        <div
            ref={dialogRef}
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
                    onClick={closeFullscreen}
                    aria-label="Закрити галерею"
                    className="rounded-full bg-white/10 p-3 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-yellow-400"
                >
                    <X size={24} />
                </button>

            </div>

            {/* Велика фотографія */}
            <div
                className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-5 sm:px-16"
                onTouchStart={event =>
                    handleTouchStart(event.touches[0].clientX)
                }
                onTouchEnd={event =>
                    handleTouchEnd(event.changedTouches[0].clientX)
                }
                onTouchCancel={handleTouchCancel}
            >

                {activeImageFailed ? (
                    <div className="flex flex-col items-center gap-3 text-gray-400">

                        <ImageOff size={40} />

                        <p>Не вдалося завантажити фото</p>

                    </div>
                ) : (
                    <img
                        key={`fullscreen-${activeIndex}`}
                        src={activeImage}
                        alt={`${title}, фотографія ${activeIndex + 1}`}
                        decoding="async"
                        onError={() =>
                            markImageFailed(activeImage)
                        }
                        className="max-h-full max-w-full object-contain"
                    />
                )}

                {/* Стрілки */}
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
    ) : null;

    // ========================================
    // ОСНОВНА ГАЛЕРЕЯ
    // ========================================

    return (
        <>
            <section
                aria-label={`Фотографії автомобіля ${title}`}
                className="rounded-2xl bg-white p-3 shadow-sm dark:bg-gray-900"
            >

                {/* Головна фотографія */}
                <div
                    className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
                    onTouchStart={event =>
                        handleTouchStart(event.touches[0].clientX)
                    }
                    onTouchEnd={event =>
                        handleTouchEnd(event.changedTouches[0].clientX)
                    }
                    onTouchCancel={handleTouchCancel}
                >

                    {activeImageFailed ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-gray-400">

                            <ImageOff size={36} />

                            <p>Фото недоступне</p>

                        </div>
                    ) : (
                        <img
                            key={`main-${activeIndex}`}
                            src={activeImage}
                            alt={`${title} — фотографія ${activeIndex + 1}`}
                            loading="eager"
                            decoding="async"
                            onError={() =>
                                markImageFailed(activeImage)
                            }
                            className="h-full w-full object-contain"
                        />
                    )}

                    {/* Кнопка відкриття на весь екран */}
                    <button
                        ref={openButtonRef}
                        type="button"
                        onClick={openFullscreen}
                        aria-label="Відкрити галерею на весь екран"
                        className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-4 focus-visible:outline-yellow-400"
                    />

                    {/* Іконка збільшення */}
                    <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-lg bg-black/60 p-2 text-white">

                        <Expand size={20} />

                    </div>

                    {/* Стрілки фото */}
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

                {/* ===================================
                    МІНІАТЮРИ
                =================================== */}

                {total > 1 && (
                    <div
                        className="mt-3 flex gap-3 overflow-x-auto pb-2"
                        aria-label="Мініатюри фотографій"
                    >

                        {visibleImages.map((image, index) => {
                            const imageIndex = thumbnailStart + index;
                            const selected = imageIndex === activeIndex;

                            // Використовуємо маленьке фото,
                            // якщо його надасть майбутній API
                            const thumbnail =
                                thumbnailImages?.[imageIndex] || image;

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
                                        src={thumbnail}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
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

            {/* Рендеримо модальне вікно прямо в body,
                щоб його не перекривали Header чи інші блоки */}
            {isFullscreen &&
                createPortal(fullscreenContent, document.body)}
        </>
    );
}
