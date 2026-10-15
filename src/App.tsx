
import { useEffect, useState } from 'react';

import {
    Route,
    Routes,
    useLocation,
} from 'react-router-dom';

import {
    getAdminCars,
    getPublicCars,
} from './api/carsApi';

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
// АВТОРИЗАЦІЯ
// ========================================

import AdminGuard from './components/admin/AdminGuard';
import AdminLoginPage from './pages/admin/AdminLoginPage';

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
// ТИПИ ДЛЯ ЗАВАНТАЖЕННЯ ДАНИХ
// ========================================

type DataSource = 'public' | 'admin';

type VehiclesState = {
    source: DataSource | null;
    items: Vehicle[];
    error: string;
};

// ========================================
// ГОЛОВНИЙ КОМПОНЕНТ
// ========================================

function App() {
    const location = useLocation();

    // ========================================
    // ПЕРЕВІРКА МАРШРУТУ
    // ========================================

    const isAdminRoute =
        location.pathname === '/admin' ||
        location.pathname.startsWith('/admin/');

    const isLoginPage =
        location.pathname === '/admin/login';

    // Публічний сайт та адмінка використовують
    // різні API для завантаження автомобілів.
    const dataSource: DataSource | null =
        isLoginPage
            ? null
            : isAdminRoute
                ? 'admin'
                : 'public';

    // ========================================
    // СТАН АВТОМОБІЛІВ
    // ========================================

    const [vehiclesState, setVehiclesState] =
        useState<VehiclesState>({
            source: null,
            items: [],
            error: '',
        });

    // Не змішуємо публічні та адмінські дані.
    const vehicles =
        vehiclesState.source === dataSource
            ? vehiclesState.items
            : [];

    const vehiclesLoading =
        dataSource !== null &&
        vehiclesState.source !== dataSource;

    const vehiclesError =
        vehiclesState.source === dataSource
            ? vehiclesState.error
            : '';

    // ========================================
    // ПУБЛІЧНІ АВТОМОБІЛІ
    // ========================================

    const publicVehicles = vehicles.filter(
        vehicle => vehicle.status !== 'hidden'
    );

    // ========================================
    // ЗАВАНТАЖЕННЯ З POSTGRESQL
    // ========================================

    useEffect(() => {
        if (dataSource === null) {
            return;
        }

        let cancelled = false;

        async function loadVehicles() {
            try {
                const cars =
                    dataSource === 'admin'
                        ? await getAdminCars()
                        : await getPublicCars();

                if (cancelled) {
                    return;
                }

                setVehiclesState({
                    source: dataSource,
                    items: cars,
                    error: '',
                });
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setVehiclesState({
                    source: dataSource,
                    items: [],
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Не вдалося завантажити автомобілі.',
                });
            }
        }

        void loadVehicles();

        return () => {
            cancelled = true;
        };
    }, [dataSource]);

    // ========================================
    // РЕДАГУВАННЯ АВТОМОБІЛЯ
    // ========================================

    function saveVehicle(updatedVehicle: Vehicle) {
        setVehiclesState(previous => {
            if (previous.source !== 'admin') {
                return previous;
            }

            return {
                ...previous,
                items: previous.items.map(vehicle =>
                    vehicle.id === updatedVehicle.id
                        ? updatedVehicle
                        : vehicle
                ),
            };
        });
    }

    // ========================================
    // ДОДАВАННЯ АВТОМОБІЛЯ
    // ========================================

    function addVehicle(newVehicle: Vehicle) {
        setVehiclesState(previous => {
            if (previous.source !== 'admin') {
                return previous;
            }

            const withoutDuplicate =
                previous.items.filter(
                    vehicle => vehicle.id !== newVehicle.id
                );

            return {
                ...previous,
                items: [
                    newVehicle,
                    ...withoutDuplicate,
                ],
            };
        });
    }

    // ========================================
    // ВИДАЛЕННЯ АВТОМОБІЛЯ
    // ========================================

    function removeVehicle(id: number) {
        setVehiclesState(previous => {
            if (previous.source !== 'admin') {
                return previous;
            }

            return {
                ...previous,
                items: previous.items.filter(
                    vehicle => vehicle.id !== id
                ),
            };
        });
    }

    // ========================================
    // JSX
    // ========================================

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">

            {/* ========================================
                ПРОКРУЧУВАННЯ СТОРІНКИ
            ======================================== */}

            <ScrollToTop />

            {/* ========================================
                SEO ВСЬОГО САЙТУ
                ТІЛЬКИ ОДИН SEOManager
            ======================================== */}

            <SEOManager
                vehicles={publicVehicles}
                loading={vehiclesLoading}
                error={vehiclesError}
            />

            {/* ========================================
                ЗАВАНТАЖЕННЯ АВТОМОБІЛІВ
            ======================================== */}

            {!isLoginPage && vehiclesLoading && (
                <div
                    role="status"
                    className="border-b border-yellow-400/20 bg-yellow-50 px-5 py-3 text-center text-sm font-semibold text-gray-800 dark:bg-gray-900 dark:text-yellow-400"
                >
                    Завантажуємо автомобілі...
                </div>
            )}

            {/* ========================================
                ПОМИЛКА API
            ======================================== */}

            {!isLoginPage && vehiclesError && (
                <div
                    role="alert"
                    className="border-b border-red-300 bg-red-50 px-5 py-3 text-center text-sm font-semibold text-red-700 dark:bg-red-950 dark:text-red-300"
                >
                    {vehiclesError}
                </div>
            )}

            {/* ========================================
                ПУБЛІЧНІ КОМПОНЕНТИ
            ======================================== */}

            {!isAdminRoute && (
                <>
                    <SeasonalEffects />

                    <Header />
                </>
            )}

            {/* ========================================
                МАРШРУТИ
            ======================================== */}

            <Routes>

                {/* ===================================
                    ГОЛОВНА СТОРІНКА
                =================================== */}

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

                {/* ===================================
                    КАТАЛОГ АВТОМОБІЛІВ
                =================================== */}

                <Route
                    path="/catalog"
                    element={
                        <CatalogPage
                            vehicles={publicVehicles}
                        />
                    }
                />

                {/* ===================================
                    ДЕТАЛЬНА СТОРІНКА АВТОМОБІЛЯ
                =================================== */}

                <Route
                    path="/cars/:id"
                    element={
                        <CarDetailsPage
                            vehicles={publicVehicles}
                        />
                    }
                />

                {/* ===================================
                    ПРО КОМПАНІЮ
                =================================== */}

                <Route
                    path="/about"
                    element={<AboutPage />}
                />

                {/* ===================================
                    СТОРІНКА ВХОДУ В АДМІНКУ
                =================================== */}

                <Route
                    path="/admin/login"
                    element={<AdminLoginPage />}
                />

                {/* ===================================
                    ЗАХИЩЕНА АДМІН-ПАНЕЛЬ
                =================================== */}

                <Route
                    path="/admin"
                    element={
                        <AdminGuard>
                            <AdminLayout />
                        </AdminGuard>
                    }
                >

                    {/* ГОЛОВНА ПАНЕЛЬ */}

                    <Route
                        index
                        element={
                            <AdminDashboard
                                vehicles={vehicles}
                            />
                        }
                    />

                    {/* ===================================
                        СПИСОК АВТОМОБІЛІВ
                    =================================== */}

                    <Route
                        path="cars"
                        element={
                            <AdminCarsPage
                                vehicles={vehicles}
                                onDelete={removeVehicle}
                            />
                        }
                    />

                    {/* ===================================
                        ДОДАВАННЯ АВТОМОБІЛЯ
                    =================================== */}

                    <Route
                        path="cars/new"
                        element={
                            <AdminNewCarPage
                                vehicles={vehicles}
                                onCreate={addVehicle}
                            />
                        }
                    />

                    {/* ===================================
                        РЕДАГУВАННЯ АВТОМОБІЛЯ
                    =================================== */}

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
