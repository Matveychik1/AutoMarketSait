
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

type Slide = {
    id: number;
    image: string;
    title: string;
    description: string;
};

type HeroSliderProps = {
    slides: Slide[];
};

export default function HeroSlider({ slides }: HeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const totalSlides = slides.length;

    function nextSlide() {
        setCurrentSlide((previous) => (previous + 1) % totalSlides);
    }

    function previousSlide() {
        setCurrentSlide(
            (previous) => (previous - 1 + totalSlides) % totalSlides
        );
    }

    function goToSlide(index: number) {
        setCurrentSlide(index);
    }

    useEffect(() => {
        if (totalSlides <= 1 || isPaused) {
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const interval = window.setInterval(() => {
            setCurrentSlide((previous) => (previous + 1) % totalSlides);
        }, 5000);

        return () => window.clearInterval(interval);
    }, [totalSlides, isPaused]);

    if (totalSlides === 0) {
        return null;
    }

    return (
        <section
            aria-label="Головний слайдер AutoMarket Rivne"
            aria-roledescription="carousel"
            className="relative h-[480px] w-full overflow-hidden bg-gray-950 sm:h-[550px] lg:h-[620px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsPaused(false);
                }
            }}
        >
            {/* Ряд усіх слайдів */}
            <div
                className="flex h-full w-full transition-transform duration-700 ease-in-out motion-reduce:transition-none"
                style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        aria-hidden={index !== currentSlide}
                        className="relative h-full w-full shrink-0"
                    >
                        {/* Фотографія */}
                        <img
                            src={slide.image}
                            alt=""
                            loading={index === 0 ? 'eager' : 'lazy'}
                            fetchPriority={index === 0 ? 'high' : 'auto'}
                            className="absolute inset-0 h-full w-full object-cover object-center"
                        />

                        {/* Затемнення фотографії */}
                        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/10" />

                        {/* Текст слайда */}
                        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 pb-16 sm:px-10 lg:px-16">
                            <div className="max-w-2xl text-white">

                <span className="mb-5 inline-block rounded-full border border-yellow-400/50 bg-yellow-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-yellow-400">
                  AutoMarket Rivne
                </span>

                                {index === 0 ? (
                                    <h1 className="mb-5 text-3xl font-extrabold uppercase leading-tight tracking-wide sm:text-4xl lg:text-6xl">
                                        {slide.title}
                                    </h1>
                                ) : (
                                    <h2 className="mb-5 text-3xl font-extrabold uppercase leading-tight tracking-wide sm:text-4xl lg:text-6xl">
                                        {slide.title}
                                    </h2>
                                )}

                                <p className="mb-8 max-w-lg text-base font-medium text-gray-200 sm:text-lg lg:text-xl">
                                    {slide.description}
                                </p>

                                <a
                                    href="/catalog"
                                    tabIndex={index === currentSlide ? 0 : -1}
                                    className="inline-flex items-center gap-3 rounded-xl bg-yellow-400 px-6 py-4 text-sm font-bold uppercase tracking-wide text-gray-950 shadow-lg transition hover:bg-yellow-500 sm:px-8"
                                >
                                    Переглянути каталог
                                    <ArrowUpRight size={19} />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Стрілки перемикання */}
            {totalSlides > 1 && (
                <div className="absolute bottom-8 right-6 z-20 flex items-center gap-3 sm:right-10 lg:right-16">
                    <button
                        type="button"
                        onClick={previousSlide}
                        aria-label="Попередній слайд"
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-gray-950"
                    >
                        <ChevronLeft size={24} />
                    </button>

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

            {/* Індикатори слайдів */}
            {totalSlides > 1 && (
                <div className="absolute bottom-10 left-6 z-20 flex items-center gap-2 sm:left-10 lg:left-16">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.id}
                            type="button"
                            onClick={() => goToSlide(index)}
                            aria-label={`Перейти до слайда ${index + 1}: ${slide.title}`}
                            aria-current={index === currentSlide ? 'true' : undefined}
                            className={`h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                                index === currentSlide
                                    ? 'w-10 bg-yellow-400'
                                    : 'w-3 bg-white/50 hover:bg-white'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Номер слайда */}
            {totalSlides > 1 && (
                <div className="absolute bottom-20 left-6 z-20 text-sm font-semibold text-white/80 sm:left-10 lg:left-16">
          <span className="text-yellow-400">
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
                    <span className="mx-2">/</span>
                    {String(totalSlides).padStart(2, '0')}
                </div>
            )}

            {/* Жовта лінія знизу */}
            <div className="absolute bottom-0 left-0 z-20 h-1 w-full bg-yellow-400" />
        </section>
    );
}
