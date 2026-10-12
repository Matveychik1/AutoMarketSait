
import { Route, Routes } from 'react-router-dom';

import SEOManager from './components/SEOManager';
import SeasonalEffects from './components/SeasonalEffects';
import { Header } from './components/Header';
import HeroSlider from './components/HeroSlider';
import NewArrivals from './components/NewArrivals';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import CatalogPage from './pages/CatalogPage';
import AboutPage from './pages/AboutPage';
import CarDetailsPage from './pages/CarDetailsPage';

import type { Vehicle } from './types/vehicle';

// ========================================
// БАНЕРИ ГОЛОВНОЇ СТОРІНКИ
// ========================================

const slides = [
    {
        id: 1,
        image: '/PhotoAutoMarket/baner.jpg',
        title: 'Комерційні автомобілі з Європи',
        description: 'Надійний транспорт для вашого бізнесу',
    },
    {
        id: 2,
        image: '/PhotoAutoMarket/baner2.jpg',
        title: 'Великий вибір автомобілів',
        description: 'Mercedes-Benz, Volkswagen та MAN',
    },
    {
        id: 3,
        image: '/PhotoAutoMarket/baner3.jpg',
        title: 'AutoMarket Rivne',
        description: 'Понад 20 років досвіду',
    },
    {
        id: 4,
        image: '/PhotoAutoMarket/baner4.jpg',
        title: 'Автомобілі для вашого бізнесу',
        description: 'Практичні рішення для перевезення вантажів',
    },
    {
        id: 5,
        image: '/PhotoAutoMarket/baner5.jpg',
        title: 'Рефрижератори та фургони',
        description: 'Комерційний транспорт для різних потреб',
    },
    {
        id: 6,
        image: '/PhotoAutoMarket/baner6.jpg',
        title: 'Бортові та тентовані автомобілі',
        description: 'Обирайте транспорт відповідно до ваших завдань',
    },
    {
        id: 7,
        image: '/PhotoAutoMarket/baner7.jpg',
        title: 'Ваш надійний партнер — AutoMarket Rivne',
        description: 'Перегляньте наш каталог комерційних автомобілів',
    },
];

// ========================================
// ТЕСТОВІ АВТОМОБІЛІ
// ========================================

const testVehicles: Vehicle[] = [
    {
        id: 1,
        brand: 'Mercedes-Benz',
        model: 'Sprinter 314',
        year: 2021,
        price: 29800,
        mileage: 200000,
        bodyType: 'Фургон',
        engineVolume: 2.2,
        fuelType: 'Дизель',
        image: '/PhotoAutoMarket/box1.jpg',
        addedAt: '2026-10-09',

        transmission: 'Механічна',
        drivetrain: 'Задній',
        powerHp: 163,
        payloadKg: 1500,
        grossWeightKg: 3500,

        bodyDimensions: {
            length: 3.6,
            width: 2.2,
            height: 2.1,
        },

        equipment: [
            'Кондиціонер',
            'Круїз-контроль',
            'Камера заднього виду',
            'Мультимедійна система',
            'Електросклопідйомники',
            'Центральний замок',
            'Підігрів дзеркал',
        ],

        images: [
            '/PhotoAutoMarket/box1.jpg',
            '/PhotoAutoMarket/box1.jpg',
            '/PhotoAutoMarket/box1.jpg',
            '/PhotoAutoMarket/box1.jpg',
        ],

        description:
            'Mercedes-Benz Sprinter 314. ' +
            'Тестовий опис автомобіля. ' +
            'Тут буде детальна інформація про стан, ' +
            'комплектацію, розміри кузова та обладнання.',
    },
    {
        id: 2,
        brand: 'Volkswagen',
        model: 'Crafter',
        year: 2017,
        price: 23900,
        mileage: 245000,
        bodyType: 'Рефрижератор',
        engineVolume: 2.0,
        fuelType: 'Дизель',
        image: '/PhotoAutoMarket/box1.jpg',
        addedAt: '2026-10-08',
        images: [
            '/PhotoAutoMarket/box1.jpg',
        ],
    },
    {
        id: 3,
        brand: 'MAN',
        model: 'TGE',
        year: 2020,
        price: 27900,
        mileage: 180000,
        bodyType: 'Тент',
        engineVolume: 2.0,
        fuelType: 'Дизель',
        image: '/PhotoAutoMarket/box1.jpg',
        addedAt: '2026-10-07',
        images: [
            '/PhotoAutoMarket/box1.jpg',
        ],
    },
    {
        id: 4,
        brand: 'Mercedes-Benz',
        model: 'Sprinter 316',
        year: 2019,
        price: 28900,
        mileage: 210000,
        bodyType: 'Бортовий',
        engineVolume: 2.2,
        fuelType: 'Дизель',
        image: '/PhotoAutoMarket/box1.jpg',
        addedAt: '2026-10-06',
        images: [
            '/PhotoAutoMarket/box1.jpg',
        ],
    },
    {
        id: 5,
        brand: 'Mercedes-Benz',
        model: 'Sprinter 316',
        year: 2019,
        price: 28900,
        mileage: 210000,
        bodyType: 'Бортовий',
        engineVolume: 2.2,
        fuelType: 'Дизель',
        image: '/PhotoAutoMarket/box1.jpg',
        addedAt: '2026-10-05',
        images: [
            '/PhotoAutoMarket/box1.jpg',
        ],
    },
    {
        id: 6,
        brand: 'Mercedes-Benz',
        model: 'Sprinter 316',
        year: 2019,
        price: 28900,
        mileage: 210000,
        bodyType: 'Бортовий',
        engineVolume: 2.2,
        fuelType: 'Дизель',
        image: '/PhotoAutoMarket/box1.jpg',
        addedAt: '2026-10-04',
        images: [
            '/PhotoAutoMarket/box1.jpg',
        ],
    },
];

// ========================================
// ГОЛОВНИЙ КОМПОНЕНТ APP
// ========================================

function App() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">

            {/* Прокручування сторінок нагору */}
            <ScrollToTop />

            {/* SEO: заголовки та метадані сторінок */}
            <SEOManager vehicles={testVehicles} />

            {/* Сезонне оформлення сайту */}
            <SeasonalEffects />

            {/* Шапка сайту */}
            <Header />

            {/* Маршрути */}
            <Routes>

                {/* Головна */}
                <Route
                    path="/"
                    element={
                        <main>
                            <HeroSlider slides={slides} />

                            <NewArrivals
                                vehicles={testVehicles}
                            />

                            <ContactSection />
                        </main>
                    }
                />

                {/* Каталог автомобілів */}
                <Route
                    path="/catalog"
                    element={
                        <CatalogPage
                            vehicles={testVehicles}
                        />
                    }
                />

                {/* Детальна сторінка автомобіля */}
                <Route
                    path="/cars/:id"
                    element={
                        <CarDetailsPage
                            vehicles={testVehicles}
                        />
                    }
                />

                {/* Про компанію */}
                <Route
                    path="/about"
                    element={<AboutPage />}
                />

            </Routes>

            {/* Футер */}
            <Footer />

        </div>
    );
}

export default App;
