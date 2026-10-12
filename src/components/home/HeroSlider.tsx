
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import {
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
} from 'lucide-react';

// ========================================
// ТИПИ
// ========================================

type Slide = {
    id: number;
    image: string;
    title: string;
    description: string;
};

type HeroSliderProps = {
    slides: Slide[];
};

const AUTO_PLAY_DELAY = 5000;
const SWIPE_DISTANCE = 50;

// ========================================
// ГОЛОВНИЙ КОМПОНЕНТ
// ========================================

export default function HeroSlider({
                                       slides,
                                   }: HeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const [isPaused, setIsPaused] = useState(false);

    const touchStartX = useRef<number | null>(null);

    const totalSlides = slides.length;

    // Захист, якщо кількість банерів зміниться
    const activeIndex =
        totalSlides > 0
            ? currentSlide % totalSlides
            : 0;

    // ========================================
    // ПЕРЕМИКАННЯ СЛАЙДІВ
    // ========================================

    function nextSlide() {
        if (totalSlides <= 1) return;

        setCurrentSlide(previous =>
            (previous + 1) % totalSlides
        );
    }

    function previousSlide() {
        if (totalSlides <= 1) return;

        setCurrentSlide(previous =>
            (previous - 1 + totalSlides) % totalSlides
        );
    }

    function goToSlide(index: number) {
        if (index < 0 || index >= totalSlides) return;

        setCurrentSlide(index);
    }

    // ========================================
    // АВТОМАТИЧНЕ ПЕРЕМИКАННЯ
    // ========================================

    useEffect(() => {
        if (totalSlides <= 1 || isPaused) {
            return;
        }

        const interval = window.setInterval(() => {
            // Не перемикаємо слайди у прихованій вкладці
            if (document.visibilityState !== 'visible') {
                return;
            }

            // Поважаємо налаштування зменшення руху
            const reducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches;

            if (reducedMotion) {
                return;
            }

            setCurrentSlide(previous =>
                (previous + 1) % totalSlides
            );
        }, AUTO_PLAY_DELAY);

        return () => {
            window.clearInterval(interval);
        };
    }, [
        totalSlides,
        isPaused,
        currentSlide,
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

        if (difference < 0) {
            nextSlide();
        } else {
            previousSlide();
        }
    }

    function handleTouchCancel() {
        touchStartX.current = null;
    }

    // ========================================
    // ЯКІ ЗОБРАЖЕННЯ ЗАВАНТАЖУВАТИ
    // ========================================

    function shouldLoadImage(index: number): boolean {
        if (totalSlides <= 3) {
            return true;
        }

        const previousIndex =
            (activeIndex - 1 + totalSlides) % totalSlides;

        const nextIndex =
            (activeIndex + 1) % totalSlides;

        // Тільки активний, попередній і наступний банери
        return (
            index === activeIndex ||
            index === previousIndex ||
            index === nextIndex
        );
    }

    if (totalSlides === 0) {
        return null;
    }

    // ========================================
    // ІНТЕРФЕЙС
    // ========================================

    return (
        <section
            aria-label="Головний слайдер AutoMarket Rivne"
            aria-roledescription="carousel"
            className="relative h-[480px] w-full overflow-hidden bg-gray-950 sm:h-[550px] lg:h-[620px]"

            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}

            onFocus={() => setIsPaused(true)}

            onBlur={event => {
                if (
                    !event.currentTarget.contains(
                        event.relatedTarget
                    )
                ) {
                    setIsPaused(false);
                }
            }}

            onTouchStart={event => {
                handleTouchStart(event.touches[0].clientX);
            }}

            onTouchEnd={event => {
                handleTouchEnd(
                    event.changedTouches[0].clientX
                );
            }}

            onTouchCancel={handleTouchCancel}
        >

            {/* ========================================
                СЛАЙДИ
            ======================================== */}

            {slides.map((slide, index) => {
                const isActive = index === activeIndex;

                const loadImage = shouldLoadImage(index);

                return (
                    <div
                        key={slide.id}
                        aria-hidden={!isActive}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
                            isActive
                                ? 'z-10 opacity-100'
                                : 'z-0 pointer-events-none opacity-0'
                        }`}
                    >

                        {/* ===================================
                            ФОТОГРАФІЯ
                        =================================== */}

                        {loadImage && (
                            <img
                                src={slide.image}
                                alt=""
                                loading={
                                    index === 0
                                        ? 'eager'
                                        : 'lazy'
                                }
                                fetchPriority={
                                    index === 0
                                        ? 'high'
                                        : 'low'
                                }
                                decoding="async"
                                draggable={false}
                                className="absolute inset-0 h-full w-full object-cover object-center"
                            />
                        )}

                        {/* ===================================
                            ЗАТЕМНЕННЯ
                        =================================== */}

                        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/10" />

                        {/* ===================================
                            ТЕКСТ СЛАЙДА
                        =================================== */}

                        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 pb-16 sm:px-10 lg:px-16">

                            <div className="max-w-2xl text-white">

                                {/* Назва компанії */}
                                <span className="mb-5 inline-block rounded-full border border-yellow-400/50 bg-yellow-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-yellow-400">
                                    AutoMarket Rivne
                                </span>

                                {/* Головний заголовок */}
                                {index === 0 ? (
                                    <h1 className="mb-5 text-3xl font-extrabold uppercase leading-tight tracking-wide sm:text-4xl lg:text-6xl">
                                        {slide.title}
                                    </h1>
                                ) : (
                                    <h2 className="mb-5 text-3xl font-extrabold uppercase leading-tight tracking-wide sm:text-4xl lg:text-6xl">
                                        {slide.title}
                                    </h2>
                                )}

                                {/* Опис */}
                                <p className="mb-8 max-w-lg text-base font-medium text-gray-200 sm:text-lg lg:text-xl">
                                    {slide.description}
                                </p>

                                {/* Кнопка каталогу */}
                                <Link
                                    to="/catalog"
                                    tabIndex={isActive ? 0 : -1}
                                    className="inline-flex items-center gap-3 rounded-xl bg-yellow-400 px-6 py-4 text-sm font-bold uppercase tracking-wide text-gray-950 shadow-lg transition hover:bg-yellow-500 sm:px-8"
                                >
                                    Переглянути каталог

                                    <ArrowUpRight size={19} />
                                </Link>

                            </div>
                        </div>
                    </div>
                );
            })}

            {/* ========================================
                СТРІЛКИ
            ======================================== */}

            {totalSlides > 1 && (
                <div className="absolute bottom-8 right-6 z-20 flex items-center gap-3 sm:right-10 lg:right-16">

                    {/* Назад */}
                    <button
                        type="button"
                        onClick={previousSlide}
                        aria-label="Попередній слайд"
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-gray-950"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Вперед */}
                    <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Наступний слайд"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-gray-950 transition hover:bg-yellow-500"
                    >
                        <ChevronRight size={24} />
                    </button>

                </div>
            )}

            {/* ========================================
                ІНДИКАТОРИ СЛАЙДІВ
            ======================================== */}

            {totalSlides > 1 && (
                <div className="absolute bottom-10 left-6 z-20 flex items-center gap-2 sm:left-10 lg:left-16">

                    {slides.map((slide, index) => (
                        <button
                            key={slide.id}
                            type="button"
                            onClick={() => goToSlide(index)}
                            aria-label={`Перейти до слайда ${index + 1}: ${slide.title}`}
                            aria-current={
                                index === activeIndex
                                    ? 'true'
                                    : undefined
                            }
                            className={`h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                                index === activeIndex
                                    ? 'w-10 bg-yellow-400'
                                    : 'w-3 bg-white/50 hover:bg-white'
                            }`}
                        />
                    ))}

                </div>
            )}

            {/* ========================================
                ЛІЧИЛЬНИК
            ======================================== */}

            {totalSlides > 1 && (
                <div className="absolute bottom-20 left-6 z-20 text-sm font-semibold text-white/80 sm:left-10 lg:left-16">

                    <span className="text-yellow-400">
                        {String(activeIndex + 1).padStart(2, '0')}
                    </span>

                    <span className="mx-2">/</span>

                    {String(totalSlides).padStart(2, '0')}

                </div>
            )}

            {/* ========================================
                ЖОВТА ЛІНІЯ ЗНИЗУ
            ======================================== */}

            <div className="absolute bottom-0 left-0 z-20 h-1 w-full bg-yellow-400" />

        </section>
    );
}
