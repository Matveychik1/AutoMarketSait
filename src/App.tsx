
import { useState } from 'react';

import {
    Route,
    Routes,
    useLocation,
} from 'react-router-dom';

// ========================================
// ПУБЛІЧНИЙ САЙТ
// ========================================

import SEOManager from './components/shared/SEOManager';
import SeasonalEffects from './components/seasonal/SeasonalEffects';

import { Header } from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';

import HeroSlider from './components/home/HeroSlider';
import NewArrivals from './components/home/NewArrivals';

import ContactSection from './components/shared/ContactSection';

import CatalogPage from './pages/CatalogPage';
import AboutPage from './pages/AboutPage';
import CarDetailsPage from './pages/CarDetailsPage';

// ========================================
// АДМІН-ПАНЕЛЬ
// ========================================

import AdminLayout from './components/admin/AdminLayout';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCarsPage from './pages/admin/AdminCarsPage';
import AdminNewCarPage from './pages/admin/AdminNewCarPage';
import AdminEditCarPage from './pages/admin/AdminEditCarPage';

// ========================================
// ТИПИ
// ========================================

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
        status: 'available',
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
        status: 'available',
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
        status: 'available',
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
        status: 'available',
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
        status: 'available',
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
        status: 'available',
        image: '/PhotoAutoMarket/box1.jpg',
        addedAt: '2026-10-04',
        images: [
            '/PhotoAutoMarket/box1.jpg',
        ],
    },
    {
        id: 7,
        brand: 'Mercedes-Benz',
        model: 'Sprinter 316',
        year: 2019,
        price: 28900,
        mileage: 210000,
        bodyType: 'Бортовий',
        engineVolume: 2.2,
        fuelType: 'Дизель',
        status: 'available',
        image: '/PhotoAutoMarket/box1.jpg',
        addedAt: '2026-10-04',
        images: [
            '/PhotoAutoMarket/box1.jpg',
        ],
    },
    {
        id: 8,
        brand: 'Mercedes-Benz',
        model: 'Sprinter 316',
        year: 2019,
        price: 28900,
        mileage: 210000,
        bodyType: 'Бортовий',
        engineVolume: 2.2,
        fuelType: 'Дизель',
        status: 'available',
        image: '/PhotoAutoMarket/box1.jpg',
        addedAt: '2026-10-04',
        images: [
            '/PhotoAutoMarket/box1.jpg',
        ],
    },
    {
        id: 9,
        brand: 'Mercedes-Benz',
        model: 'Sprinter 316',
        year: 2019,
        price: 28900,
        mileage: 210000,
        bodyType: 'Бортовий',
        engineVolume: 2.2,
        fuelType: 'Дизель',
        status: 'available',
        image: '/PhotoAutoMarket/box1.jpg',
        addedAt: '2026-10-04',
        images: [
            '/PhotoAutoMarket/box1.jpg',
        ],
    },
    {
        id: 10,
        brand: 'Mercedes-Benz',
        model: 'Sprinter 316',
        year: 2019,
        price: 28900,
        mileage: 210000,
        bodyType: 'Бортовий',
        engineVolume: 2.2,
        fuelType: 'Дизель',
        status: 'available',
        image: '/PhotoAutoMarket/box1.jpg',
        addedAt: '2026-10-04',
        images: [
            '/PhotoAutoMarket/box1.jpg',
        ],
    },
    {
        id: 11,
        brand: 'Mercedes-Benz',
        model: 'Sprinter 316',
        year: 2019,
        price: 28900,
        mileage: 210000,
        bodyType: 'Бортовий',
        engineVolume: 2.2,
        fuelType: 'Дизель',
        status: 'available',
        image: '/PhotoAutoMarket/box1.jpg',
        addedAt: '2026-10-04',
        images: [
            '/PhotoAutoMarket/box1.jpg',
        ],
    },
    {
        id: 12,
        brand: 'Mercedes-Benz',
        model: 'Sprinter 316',
        year: 2019,
        price: 28900,
        mileage: 210000,
        bodyType: 'Бортовий',
        engineVolume: 2.2,
        fuelType: 'Дизель',
        status: 'available',
        image: '/PhotoAutoMarket/box1.jpg',
        addedAt: '2026-10-04',
        images: [
            '/PhotoAutoMarket/box1.jpg',
        ],
    },
    {
        id: 13,
        brand: 'Mercedes-Benz',
        model: 'Sprinter 316',
        year: 2019,
        price: 28900,
        mileage: 210000,
        bodyType: 'Бортовий',
        engineVolume: 2.2,
        fuelType: 'Дизель',
        status: 'available',
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
    const location = useLocation();

    // ========================================
    // ДАНІ АВТОМОБІЛІВ
    // ========================================

    // Тимчасове зберігання автомобілів у React.
    // Після F5 дані повернуться до тестових.
    const [vehicles, setVehicles] = useState<Vehicle[]>(
        testVehicles
    );

    // ========================================
    // АВТОМОБІЛІ ДЛЯ ПУБЛІЧНОГО САЙТУ
    // ========================================

    // Приховані автомобілі бачить тільки адмін.
    const publicVehicles = vehicles.filter(
        vehicle => vehicle.status !== 'hidden'
    );

    // ========================================
    // ЗБЕРЕЖЕННЯ ЗМІН АВТОМОБІЛЯ
    // ========================================

    function saveVehicle(updatedVehicle: Vehicle) {
        setVehicles(previous =>
            previous.map(vehicle =>
                vehicle.id === updatedVehicle.id
                    ? updatedVehicle
                    : vehicle
            )
        );
    }

    // ========================================
    // ДОДАВАННЯ НОВОГО АВТОМОБІЛЯ
    // ========================================

    function addVehicle(newVehicle: Vehicle) {
        setVehicles(previous => [
            ...previous,
            newVehicle,
        ]);
    }

    // ========================================
    // ПЕРЕВІРКА МАРШРУТУ
    // ========================================

    const isAdminRoute =
        location.pathname === '/admin' ||
        location.pathname.startsWith('/admin/');

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">

            {/* Прокручування сторінок догори */}
            <ScrollToTop />

            {/* ========================================
                ПУБЛІЧНІ КОМПОНЕНТИ
            ======================================== */}

            {!isAdminRoute && (
                <>
                    {/* SEO */}
                    <SEOManager vehicles={publicVehicles} />

                    {/* Сезонні ефекти */}
                    <SeasonalEffects />

                    {/* Шапка сайту */}
                    <Header />
                </>
            )}

            {/* ========================================
                МАРШРУТИ
            ======================================== */}

            <Routes>

                {/* ===================================
                    ПУБЛІЧНИЙ САЙТ
                =================================== */}

                {/* Головна */}
                <Route
                    path="/"
                    element={
                        <main>
                            <HeroSlider slides={slides} />

                            <NewArrivals
                                vehicles={publicVehicles}
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
                            vehicles={publicVehicles}
                        />
                    }
                />

                {/* Детальна сторінка автомобіля */}
                <Route
                    path="/cars/:id"
                    element={
                        <CarDetailsPage
                            vehicles={publicVehicles}
                        />
                    }
                />

                {/* Про компанію */}
                <Route
                    path="/about"
                    element={<AboutPage />}
                />

                {/* ===================================
                    АДМІН-ПАНЕЛЬ
                =================================== */}

                <Route
                    path="/admin"
                    element={<AdminLayout />}
                >

                    {/* Головна панель адміністратора */}
                    <Route
                        index
                        element={
                            <AdminDashboard
                                vehicles={vehicles}
                            />
                        }
                    />

                    {/* Список автомобілів */}
                    <Route
                        path="cars"
                        element={
                            <AdminCarsPage
                                vehicles={vehicles}
                            />
                        }
                    />

                    {/* Додавання нового автомобіля */}

                    <Route
                        path="cars/new"
                        element={
                            <AdminNewCarPage
                                vehicles={vehicles}
                                onCreate={addVehicle}
                            />
                        }
                    />


                    {/* Редагування автомобіля */}
                    <Route
                        path="cars/:id/edit"
                        element={
                            <AdminEditCarPage
                                vehicles={vehicles}
                                onSave={saveVehicle}
                            />
                        }
                    />

                </Route>

            </Routes>

            {/* ========================================
                ФУТЕР
            ======================================== */}

            {!isAdminRoute && <Footer />}

        </div>
    );
}

export default App;
