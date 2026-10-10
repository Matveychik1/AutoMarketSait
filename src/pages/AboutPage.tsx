
import { Link } from 'react-router-dom';

import {
    ArrowRight,
    ArrowUpRight,
    BadgeCheck,
    Handshake,
    MapPin,
    Truck,
    CalendarDays,
    CheckCircle2,
    PackageCheck,
} from 'lucide-react';

import ContactSection from '../components/ContactSection';

// Фотографії автомайданчика
// Коли додаси фото, прибери // перед шляхами
const yardPhotos: string[] = [
    // '/PhotoAutoMarket/about/yard1.jpg',
    // '/PhotoAutoMarket/about/yard2.jpg',
    // '/PhotoAutoMarket/about/yard3.jpg',
    // '/PhotoAutoMarket/about/yard4.jpg',
];

// Переваги компанії
const advantages = [
    {
        title: 'Безкоштовна доставка по Україні',
        description:
            'Доставляємо придбаний автомобіль у ваше місто без додаткової оплати за доставку.',
        icon: Truck,
    },
    {
        title: 'Багаторічний досвід',
        description:
            'Працюємо у сфері комерційного транспорту з 2000 року.',
        icon: BadgeCheck,
    },
    {
        title: 'Автомобілі з Європи',
        description:
            'Пропонуємо комерційні автомобілі від європейських постачальників.',
        icon: PackageCheck,
    },
    {
        title: 'Індивідуальний підхід',
        description:
            'Допомагаємо підібрати автомобіль відповідно до потреб вашого бізнесу.',
        icon: Handshake,
    },
    {
        title: 'Зручне розташування',
        description:
            'Наш автомайданчик знаходиться біля Рівного, поруч із трасою Київ — Чоп та SOCAR.',
        icon: MapPin,
    },
];

const bodyTypes = [
    'Бортові автомобілі',
    'Рефрижератори',
    'Тентовані автомобілі',
    'Фургони',
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-gray-950">

            {/* 1. ГОЛОВНИЙ БЛОК */}
            <section className="relative overflow-hidden bg-gray-950 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">

                    {/* Інформація про компанію */}
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-2">
                            <span className="h-2 w-2 rounded-full bg-yellow-400" />

                            <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                                Про AutoMarket Rivne
                            </span>
                        </div>

                        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                            Комерційні автомобілі

                            <span className="mt-2 block text-yellow-400">
                                для вашого бізнесу
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-8 text-gray-300">
                            AutoMarket Rivne — компанія, яка працює
                            у сфері продажу комерційних автомобілів
                            з 2000 року.
                        </p>

                        <p className="mt-4 max-w-xl leading-8 text-gray-400">
                            Пропонуємо автомобілі з Європи
                            для перевезення вантажів, доставки
                            товарів та інших потреб бізнесу.
                        </p>

                        {/* Акцент на доставці */}
                        <div className="mt-7 flex items-start gap-3 rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4">
                            <Truck
                                size={25}
                                className="mt-0.5 shrink-0 text-yellow-400"
                            />

                            <div>
                                <p className="font-bold text-yellow-400">
                                    Безкоштовна доставка по всій Україні
                                </p>

                                <p className="mt-1 text-sm leading-6 text-gray-300">
                                    Обирайте автомобіль для бізнесу,
                                    а ми доставимо його у ваше місто.
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/catalog"
                            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-yellow-400 px-7 py-4 font-bold text-gray-950 transition hover:bg-yellow-500"
                        >
                            Переглянути автомобілі
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>

                    {/* Головна фотографія */}
                    <div className="relative">
                        <div className="absolute -inset-3 rounded-3xl bg-yellow-400/10 blur-2xl" />

                        <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                            <img
                                src="/PhotoAutoMarket/baner.jpg"
                                alt="Комерційні автомобілі AutoMarket Rivne"
                                className="aspect-[4/3] w-full object-cover"
                            />
                        </div>

                        <div className="absolute -bottom-5 left-4 rounded-2xl border border-gray-700 bg-gray-900 px-5 py-4 shadow-xl sm:left-8 sm:px-6">
                            <p className="text-2xl font-extrabold text-yellow-400 sm:text-3xl">
                                З 2000 року
                            </p>

                            <p className="mt-1 text-xs text-gray-300 sm:text-sm">
                                На ринку комерційного транспорту
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. НАША ІСТОРІЯ */}
            <section className="py-20 dark:bg-gray-950">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">

                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <CalendarDays
                                size={25}
                                className="text-yellow-500"
                            />

                            <span className="font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                                Наша історія
                            </span>
                        </div>

                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                            Досвід, перевірений роками
                        </h2>

                        <div className="mt-6 space-y-4 leading-8 text-gray-600 dark:text-gray-300">
                            <p>
                                Історія AutoMarket Rivne почалася
                                у 2000 році.
                            </p>

                            <p>
                                Ми спеціалізуємося на продажу
                                комерційних автомобілів
                                та розуміємо, наскільки важливо
                                правильно обрати транспорт для роботи.
                            </p>

                            <p>
                                У нашому асортименті представлені
                                Mercedes-Benz Sprinter,
                                Volkswagen Crafter та MAN TGE
                                у різних варіантах кузова.
                            </p>

                            <p>
                                Ми прагнемо зробити процес
                                придбання комерційного транспорту
                                максимально зручним для клієнтів
                                із різних регіонів України.
                            </p>
                        </div>
                    </div>

                    {/* Типи автомобілів */}
                    <div className="rounded-3xl bg-gray-50 p-8 dark:bg-gray-900 sm:p-10">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-gray-950">
                            <Truck size={32} />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Автомобілі для реальних завдань
                        </h3>

                        <p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">
                            Від перевезення будівельних матеріалів
                            до доставки продуктів — різні типи
                            кузова дозволяють обрати транспорт
                            відповідно до характеру роботи.
                        </p>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {bodyTypes.map(type => (
                                <div
                                    key={type}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle2
                                        size={20}
                                        className="shrink-0 text-yellow-500"
                                    />

                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        {type}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Link
                            to="/catalog"
                            className="mt-8 inline-flex items-center gap-2 font-bold text-yellow-600 transition hover:text-yellow-700 dark:text-yellow-400"
                        >
                            Перейти до каталогу
                            <ArrowRight size={19} />
                        </Link>
                    </div>

                </div>
            </section>

            {/* 3. БЕЗКОШТОВНА ДОСТАВКА */}
            <section className="bg-white py-16 dark:bg-gray-950">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="relative overflow-hidden rounded-3xl bg-gray-950 p-8 text-white sm:p-12">

                        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl" />

                        <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">

                            <div className="flex max-w-2xl flex-col gap-5 sm:flex-row sm:items-start">

                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-gray-950">
                                    <Truck size={32} />
                                </div>

                                <div>
                                    <span className="text-sm font-bold uppercase tracking-wider text-yellow-400">
                                        Перевага AutoMarket Rivne
                                    </span>

                                    <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                                        Безкоштовна доставка

                                        <span className="block text-yellow-400">
                                            по всій Україні
                                        </span>
                                    </h2>

                                    <p className="mt-4 leading-7 text-gray-300">
                                        Обирайте комерційний автомобіль
                                        для свого бізнесу, а ми доставимо
                                        його у ваше місто безкоштовно.
                                    </p>

                                    <p className="mt-3 text-sm text-gray-400">
                                        Не обмежуйте свій вибір відстанню
                                        до нашого автомайданчика.
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/catalog"
                                className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-yellow-400 px-7 py-4 font-bold text-gray-950 transition hover:bg-yellow-500"
                            >
                                Обрати автомобіль
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. ПЕРЕВАГИ КОМПАНІЇ */}
            <section className="am-seasonal-surface bg-gray-50 py-20 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="mb-12 text-center">
                        <p className="font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                            Наші переваги
                        </p>

                        <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                            Чому обирають AutoMarket Rivne?
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
                            Ми допомагаємо знайти комерційний
                            автомобіль для вашого бізнесу
                            та організовуємо його доставку по Україні.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {advantages.map((advantage, index) => {
                            const Icon = advantage.icon;

                            return (
                                <article
                                    key={advantage.title}
                                    className={`rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none ${
                                        index === 0
                                            ? 'border-yellow-400 bg-yellow-50 dark:bg-gray-950'
                                            : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950'
                                    }`}
                                >
                                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-400 text-gray-950">
                                        <Icon size={27} />
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {advantage.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                                        {advantage.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>

                </div>
            </section>

            {/* 5. ФОТОГРАФІЇ АВТОМАЙДАНЧИКА */}
            {yardPhotos.length > 0 && (
                <section className="py-20 dark:bg-gray-950">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                        <div className="mb-10">
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                                Наш автомайданчик
                            </h2>

                            <p className="mt-3 text-gray-500 dark:text-gray-400">
                                Познайомтеся з AutoMarket Rivne ближче
                                та перегляньте фотографії нашого автомайданчика.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {yardPhotos.map((photo, index) => (
                                <div
                                    key={photo}
                                    className="group overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800"
                                >
                                    <img
                                        src={photo}
                                        alt={`Автомайданчик AutoMarket Rivne — фото ${index + 1}`}
                                        loading="lazy"
                                        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
                                    />
                                </div>
                            ))}
                        </div>

                    </div>
                </section>
            )}

            {/* 6. ПЕРЕХІД У КАТАЛОГ */}
            <section className="bg-yellow-400 py-14">
                <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">

                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-950">
                            Шукаєте автомобіль для бізнесу?
                        </h2>

                        <p className="mt-3 text-gray-800">
                            Перегляньте наш каталог.
                            Доставка придбаних автомобілів
                            по Україні — безкоштовна!
                        </p>
                    </div>

                    <Link
                        to="/catalog"
                        className="inline-flex items-center gap-3 rounded-xl bg-gray-950 px-7 py-4 font-bold text-white transition hover:bg-gray-800"
                    >
                        Перейти до каталогу
                        <ArrowRight size={20} />
                    </Link>

                </div>
            </section>

            {/* 7. КОНТАКТИ ТА КАРТА */}
            <ContactSection />

        </main>
    );
}
