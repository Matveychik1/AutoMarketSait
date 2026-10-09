import {
    SiYoutube,
    SiInstagram,
    SiTiktok,
    SiViber,
    SiTelegram,
} from 'react-icons/si';
import { Phone, MapPin, Clock } from 'lucide-react';

const navigation = [
    { label: 'Головна', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    { label: 'Про нас', href: '/about' },
];

const categories = [
    { label: 'Бортові', value: 'Бортовий' },
    { label: 'Рефрижератори', value: 'Рефрижератор' },
    { label: 'Тенти', value: 'Тент' },
    { label: 'Фургони', value: 'Фургон' },
];

const socialLinks = [
    {
        name: 'YouTube',
        url: 'https://www.youtube.com/@AutoMarketRivne1',
        icon: SiYoutube,
    },
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/automarket_rivne_official?psln=OTB3aTgwdXNkNmZq&utm_source=qr',
        icon: SiInstagram,
    },
    {
        name: 'TikTok',
        url: 'https://www.tiktok.com/@automarket.rivne?_r=1&_t=ZS-9APP6tyJlzz',
        icon: SiTiktok,
    },
    {
        name: 'Viber',
        url: 'https://invite.viber.com/?g2=AQAVxv6JSRRVOU09TEBdAWxOTHw4l5Ju%2FxSSYJ0sqYgCy714YXZubqsJ8QjWLLkF',
        icon: SiViber,
    },
    {
        name: 'Telegram',
        url: 'https://t.me/automarketrv',
        icon: SiTelegram,
    },
];

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-white">
            <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">

                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Логотип та компанія */}
                    <div>
                        <a href="/" aria-label="AutoMarket Rivne — головна">
                            <img
                                src="/PhotoAutoMarket/LogoAutoMarket.png"
                                alt="AutoMarket Rivne"
                                className="mb-5 h-14 w-auto object-contain"
                            />
                        </a>

                        <p className="max-w-xs text-sm leading-7 text-gray-400">
                            Комерційні автомобілі з Європи.
                            Понад 20 років досвіду.
                            Надійний транспорт для вашого бізнесу.
                        </p>
                    </div>

                    {/* Навігація */}
                    <div>
                        <h3 className="mb-5 text-lg font-bold text-yellow-400">
                            Навігація
                        </h3>

                        <ul className="space-y-3">
                            {navigation.map((item) => (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        className="text-sm text-gray-300 transition hover:text-yellow-400"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Категорії автомобілів */}
                    <div>
                        <h3 className="mb-5 text-lg font-bold text-yellow-400">
                            Каталог автомобілів
                        </h3>

                        <ul className="space-y-3">
                            {categories.map((category) => (
                                <li key={category.value}>
                                    <a
                                        href={`/catalog?bodyType=${encodeURIComponent(category.value)}`}
                                        className="text-sm text-gray-300 transition hover:text-yellow-400"
                                    >
                                        {category.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Контакти */}
                    <div>
                        <h3 className="mb-5 text-lg font-bold text-yellow-400">
                            Контакти
                        </h3>

                        <div className="space-y-5">

                            <div className="flex items-start gap-3">
                                <Phone
                                    size={19}
                                    className="shrink-0 text-yellow-400"
                                />

                                <div className="flex flex-col gap-2">
                                    <a
                                        href="tel:+380671002124"
                                        className="text-sm text-gray-300 hover:text-yellow-400"
                                    >
                                        067 100 21 24
                                    </a>

                                    <a
                                        href="tel:+380502002124"
                                        className="text-sm text-gray-300 hover:text-yellow-400"
                                    >
                                        050 200 21 24
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin
                                    size={19}
                                    className="shrink-0 text-yellow-400"
                                />

                                <p className="text-sm leading-6 text-gray-300">
                                    Рівненська область
                                    <br />
                                    вул.Приміська, 87в, с.Біла Криниця
                                    <br />
                                    Траса Київ — Чоп, біля Рівного
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock
                                    size={19}
                                    className="shrink-0 text-yellow-400"
                                />

                                <div className="text-sm leading-7 text-gray-300">
                                    <p>Пн–Пт: 09:00–18:30</p>
                                    <p>Сб: 09:00–14:00</p>
                                    <p>Нд: вихідний</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Соціальні мережі */}
                <div className="mt-12 border-t border-gray-800 pt-8">
                    <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">

                        <div>
                            <h3 className="text-center text-lg font-bold text-white sm:text-left">
                                Ми в соціальних мережах
                            </h3>

                            <p className="mt-1 text-center text-sm text-gray-400 sm:text-left">
                                Слідкуйте за новими надходженнями
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;

                                const iconClass =
                                    'flex h-12 w-12 items-center justify-center rounded-xl border border-gray-700 bg-gray-800 text-white transition-colors duration-200 hover:border-yellow-400 hover:bg-yellow-400 hover:text-gray-950';

                                return social.url ? (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Відкрити ${social.name} AutoMarket Rivne`}
                                        title={social.name}
                                        className={iconClass}
                                    >
                                        <Icon size={22} />
                                    </a>
                                ) : (
                                    <span
                                        key={social.name}
                                        title={`${social.name}: посилання ще не додано`}
                                        aria-label={`${social.name}: посилання ще не додано`}
                                        className={`${iconClass} cursor-not-allowed opacity-50`}
                                    >
                        <Icon size={22} />
                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Нижня частина Footer */}
                <div className="mt-12 border-t border-gray-800 pt-6">
                    <p className="text-center text-sm text-gray-400">
                        © {new Date().getFullYear()} AutoMarket Rivne.
                        Усі права захищено.
                    </p>
                </div>
            </div>
        </footer>
    );
}
