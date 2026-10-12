
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { CalendarDays } from 'lucide-react';

const ANIMATION_DURATION = 2200;

type DigitWheelProps = {
    digits: number[];
    finalPosition: number;
    started: boolean;
    reducedMotion: boolean;
};

function DigitWheel({
                        digits,
                        finalPosition,
                        started,
                        reducedMotion,
                    }: DigitWheelProps) {
    const position = started ? finalPosition : 0;

    const wheelStyle: CSSProperties = {
        transform: `translate3d(0, -${position}em, 0)`,
        transition: reducedMotion
            ? 'none'
            : `transform ${ANIMATION_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`,
    };

    return (
        <div className="relative h-[1em] w-[0.65em] overflow-hidden">
            <div style={wheelStyle}>
                {digits.map((digit, index) => (
                    <div
                        key={index}
                        className="flex h-[1em] items-center justify-center"
                    >
                        {digit}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ExperienceCounter() {
    const counterRef = useRef<HTMLDivElement>(null);

    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const element = counterRef.current;

        if (!element) return;

        let timeoutId: number | undefined;
        let hasStarted = false;

        const observer = new IntersectionObserver(
            entries => {
                if (
                    !entries[0]?.isIntersecting ||
                    hasStarted
                ) {
                    return;
                }

                hasStarted = true;
                observer.disconnect();

                const reduceMotion = window.matchMedia(
                    '(prefers-reduced-motion: reduce)'
                ).matches;

                if (reduceMotion) {
                    setReducedMotion(true);
                    setStarted(true);
                    setFinished(true);
                    return;
                }

                setStarted(true);

                timeoutId = window.setTimeout(() => {
                    setFinished(true);
                }, ANIMATION_DURATION);
            },
            {
                threshold: 0.3,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();

            if (timeoutId !== undefined) {
                window.clearTimeout(timeoutId);
            }
        };
    }, []);

    // Перша цифра: 0 → 1 → 2
    const tensDigits = [0, 1, 2];

    // Друга цифра: прокручується два повні кола
    const unitsDigits = Array.from(
        { length: 21 },
        (_, index) => index % 10
    );

    return (
        <div
            ref={counterRef}
            className="w-fit min-w-[265px] max-w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#0e1626]/95 px-6 py-5 shadow-2xl backdrop-blur-md sm:px-7"
        >
            {/* Верхня частина */}
            <div className="flex items-center justify-between gap-5">

                <div className="flex items-center gap-2">

                    <span className="h-[3px] w-5 rounded-full bg-yellow-400" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                        Наш досвід
                    </span>

                </div>

                <CalendarDays
                    size={20}
                    className="text-gray-500"
                    aria-hidden="true"
                />
            </div>

            {/* Основне число */}
            <div
                className="mt-5 flex items-end gap-2"
                aria-label="Понад 20 років"
            >
                <div
                    aria-hidden="true"
                    className="flex font-extrabold tabular-nums tracking-tight text-yellow-400 text-[60px] leading-none sm:text-[72px]"
                >
                    <DigitWheel
                        digits={tensDigits}
                        finalPosition={2}
                        started={started}
                        reducedMotion={reducedMotion}
                    />

                    <DigitWheel
                        digits={unitsDigits}
                        finalPosition={20}
                        started={started}
                        reducedMotion={reducedMotion}
                    />

                    <span
                        className={`self-end pb-1 text-[38px] transition-opacity duration-500 ${
                            finished
                                ? 'opacity-100'
                                : 'opacity-0'
                        }`}
                    >
                        +
                    </span>
                </div>

                <span className="mb-2 text-xl font-semibold text-white">
                    років
                </span>
            </div>

            {/* Опис */}
            <p className="mt-3 text-sm leading-6 text-gray-300">
                На ринку комерційного транспорту
            </p>

            {/* Лінія прогресу */}
            <div className="mt-5 h-[3px] overflow-hidden rounded-full bg-white/10">

                <div
                    className={`h-full w-full origin-left rounded-full bg-yellow-400 ${
                        started
                            ? 'scale-x-100'
                            : 'scale-x-0'
                    }`}
                    style={{
                        transition: reducedMotion
                            ? 'none'
                            : `transform ${ANIMATION_DURATION}ms ease-out`,
                    }}
                />

            </div>
        </div>
    );
}
