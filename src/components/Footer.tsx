
import { Link } from 'react-router-dom';
import { SeasonalEffectsToggle } from './SeasonalEffects';
import {
    Clock3,
    MapPin,
    Phone,
    Truck,
    ArrowUpRight,
} from 'lucide-react';

import {
    SiYoutube,
    SiInstagram,
    SiTiktok,
    SiViber,
    SiTelegram,
} from 'react-icons/si';

const categories = [
    {
        title: 'Бортові',
        bodyType: 'Бортовий',
    },
    {
        title: 'Рефрижератори',
        bodyType: 'Рефрижератор',
    },
    {
        title: 'Тенти',
        bodyType: 'Тент',
    },
    {
        title: 'Фургони',
        bodyType: 'Фургон',
    },
];

const socialLinks = [
    {
        name: 'YouTube',
        url: '',
        icon: SiYoutube,
    },
    {
        name: 'Instagram',
        url: '',
        icon: SiInstagram,
    },
    {
        name: 'TikTok',
        url: '',
        icon: SiTiktok,
    },
    {
        name: 'Viber',
        url: '',
        icon: SiViber,
    },
    {
        name: 'Telegram',
        url: '',
        icon: SiTelegram,
    },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-950 text-gray-300">

            {/* Безкоштовна доставка */}
            <div className="border-b border-gray-800 bg-gray-900">
                <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center lg:px-8">

                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-gray-950">
                            <Truck size={28} />
                        </div>

                        <div>
                            <h2 className="text-lg font-extrabold text-white">
                                Безкоштовна доставка по всій Україні
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                Обирайте автомобіль — ми доставимо його у ваше місто.
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/catalog"
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-gray-950 transition hover:bg-yellow-500"
                    >
                        Переглянути каталог
                        <ArrowUpRight size={19} />
                    </Link>
                </div>
            </div>

            {/* Основна частина футера */}
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">

                {/* Компанія */}
                <div>
                    <Link to="/" className="inline-block">
                        <img
                            src="/PhotoAutoMarket/LogoAutoMarketWhite.png"
                            alt="AutoMarket Rivne"
                            className="h-16 w-auto max-w-full object-contain"
                        />
                    </Link>

                    <p className="mt-5 text-sm leading-7 text-gray-400">
                        Комерційні автомобілі з Європи
                        для вашого бізнесу.
                        Працюємо з 2000 року.
                    </p>

                    <p className="mt-3 text-sm font-semibold text-yellow-400">
                        Доставка автомобілів по Україні — безкоштовна!
                    </p>

                    {/* Соціальні мережі */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        {socialLinks.map(social => {
                            const Icon = social.icon;

                            if (!social.url) {
                                return (
                                    <span
                                        key={social.name}
                                        title={`${social.name}: посилання ще не додано`}
                                        aria-label={`${social.name}: посилання ще не додано`}
                                        className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-lg bg-gray-900 text-gray-600"
                                    >
                                        <Icon size={19} />
                                    </span>
                                );
                            }

                            return (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-gray-300 transition hover:bg-yellow-400 hover:text-gray-950"
                                >
                                    <Icon size={19} />
                                </a>
                            );
                        })}
                    </div>
                </div>
                <div className="mt-5">
                    <SeasonalEffectsToggle />
                </div>
                {/* Навігація */}
                <nav aria-label="Навігація у футері">
                    <h3 className="mb-6 text-xl font-bold text-yellow-400">
                        Навігація
                    </h3>

                    <div className="flex flex-col gap-4">
                        <Link
                            to="/"
                            className="transition hover:text-yellow-400"
                        >
                            Головна
                        </Link>

                        <Link
                            to="/catalog"
                            className="transition hover:text-yellow-400"
                        >
                            Каталог автомобілів
                        </Link>

                        <Link
                            to="/about"
                            className="transition hover:text-yellow-400"
                        >
                            Про нас
                        </Link>
                    </div>
                </nav>

                {/* Категорії автомобілів */}
                <nav aria-label="Категорії автомобілів">
                    <h3 className="mb-6 text-xl font-bold text-yellow-400">
                        Каталог автомобілів
                    </h3>

                    <div className="flex flex-col gap-4">
                        {categories.map(category => (
                            <Link
                                key={category.bodyType}
                                to={`/catalog?bodyType=${encodeURIComponent(
                                    category.bodyType
                                )}`}
                                className="transition hover:text-yellow-400"
                            >
                                {category.title}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Контакти */}
                <div>
                    <h3 className="mb-6 text-xl font-bold text-yellow-400">
                        Контакти
                    </h3>

                    <div className="space-y-5">

                        <div className="flex items-start gap-3">
                            <Phone
                                size={19}
                                className="mt-1 shrink-0 text-yellow-400"
                            />

                            <div className="flex flex-col gap-2">
                                <a
                                    href="tel:+380671002124"
                                    className="transition hover:text-yellow-400"
                                >
                                    067 100 21 24
                                </a>

                                <a
                                    href="tel:+380502002124"
                                    className="transition hover:text-yellow-400"
                                >
                                    050 200 21 24
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin
                                size={19}
                                className="mt-1 shrink-0 text-yellow-400"
                            />

                            <p className="leading-7">
                                Біля Рівного, траса Київ — Чоп,
                                поруч із SOCAR
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock3
                                size={19}
                                className="mt-1 shrink-0 text-yellow-400"
                            />

                            <div className="space-y-1 text-sm">
                                <p>Пн–Пт: 09:00–18:30</p>
                                <p>Сб: 09:00–14:00</p>
                                <p>Нд: вихідний</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Нижня частина */}
            <div className="border-t border-gray-800">
                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 py-6 text-sm text-gray-500 sm:flex-row sm:px-6 lg:px-8">
                    <p>
                        © {currentYear} AutoMarket Rivne.
                        Усі права захищено.
                    </p>

                    <p>
                        Комерційні автомобілі для вашого бізнесу
                    </p>
                </div>
            </div>
        </footer>
    );
}
