
import {
    Phone,
    MapPin,
    Navigation,
    Clock,
    ArrowUpRight,
} from 'lucide-react';

const phones = [
    {
        id: 1,
        label: 'Основний номер',
        number: '+380 67 100 21 24',
    },
    {
        id: 2,
        label: 'Додатковий номер',
        number: '+380 50 200 21 24',
    },
];

const workingHours = [
    {
        days: 'Понеділок – п’ятниця',
        hours: '09:00 – 18:30',
    },
    {
        days: 'Субота',
        hours: '09:00 – 14:00',
    },
    {
        days: 'Неділя',
        hours: 'Вихідний',
    },
];

// Тимчасовий пошук локації.
// Пізніше замінимо на точне посилання Google Maps.
const mapLocation = 'AutoMarket Rivne, Рівне';

const mapEmbedUrl =
    `https://www.google.com/maps?q=${encodeURIComponent(mapLocation)}&output=embed`;

const directionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapLocation)}`;

export default function ContactSection() {
    return (
        <section className="bg-white py-16 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Заголовок */}
                <div className="mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                        Контакти та розташування
                    </h2>

                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                        Зателефонуйте нам або завітайте на нашу стоянку
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">

                    {/* Ліва частина */}
                    <div className="flex flex-col gap-5">

                        {/* Телефони */}
                        {phones.map((phone) => {
                            const phoneHref =
                                `tel:${phone.number.replace(/[^\d+]/g, '')}`;

                            return (
                                <div
                                    key={phone.id}
                                    className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-colors hover:border-yellow-400 dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <div className="mb-5 flex items-center gap-4">
                                        <div className="rounded-xl bg-yellow-400 p-3 text-gray-950">
                                            <Phone size={23} />
                                        </div>

                                        <div>
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                {phone.label}
                                            </p>

                                            <a
                                                href={phoneHref}
                                                className="text-lg font-bold text-gray-900 transition hover:text-yellow-600 sm:text-xl dark:text-white dark:hover:text-yellow-400"
                                            >
                                                {phone.number}
                                            </a>
                                        </div>
                                    </div>

                                    <a
                                        href={phoneHref}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-bold text-gray-950 transition hover:bg-yellow-500 sm:w-auto"
                                    >
                                        <Phone size={18} />
                                        Зателефонувати
                                    </a>
                                </div>
                            );
                        })}

                        {/* Адреса і графік роботи */}
                        <div className="rounded-2xl bg-gray-950 p-6 text-white dark:bg-gray-800">

                            <div className="flex items-start gap-4">
                                <MapPin
                                    size={24}
                                    className="shrink-0 text-yellow-400"
                                />

                                <div>
                                    <h3 className="text-lg font-bold">
                                        AutoMarket Rivne
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-gray-300">
                                        Рівненська область
                                        <br />
                                        вул.Приміська, 87в, с.Біла Криниця
                                        <br />
                                        Траса Київ — Чоп, біля Рівного
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-gray-700 pt-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <Clock
                                        size={24}
                                        className="text-yellow-400"
                                    />
                                    <h3 className="text-lg font-bold">
                                        Графік роботи
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {workingHours.map((item) => (
                                        <div
                                            key={item.days}
                                            className="flex flex-wrap items-center justify-between gap-2 text-sm"
                                        >
                                            <span className="text-gray-300">
                                                {item.days}
                                            </span>

                                            <span
                                                className={
                                                    item.hours === 'Вихідний'
                                                        ? 'font-semibold text-yellow-400'
                                                        : 'font-semibold text-white'
                                                }
                                            >
                                                {item.hours}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Права частина — Google Maps */}
                    <div className="flex min-h-[450px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">

                        <iframe
                            title="Розташування AutoMarket Rivne"
                            src={mapEmbedUrl}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                            className="min-h-[350px] w-full flex-1 border-0"
                        />

                        <div className="flex flex-col gap-3 p-5 sm:flex-row">
                            <a
                                href={directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex flex-1 items-center justify-center gap-3 rounded-xl bg-yellow-400 px-5 py-4 text-sm font-bold text-gray-950 transition hover:bg-yellow-500"
                            >
                                <Navigation size={19} />
                                Прокласти маршрут
                            </a>

                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapLocation)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-4 text-sm font-semibold text-gray-900 transition hover:border-yellow-400 dark:border-gray-600 dark:text-white"
                            >
                                Відкрити карту
                                <ArrowUpRight size={18} />
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
