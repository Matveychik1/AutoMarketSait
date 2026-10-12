
import {
    Link,
    Navigate,
    useParams,
} from 'react-router-dom';

import {
    ArrowLeft,
    ArrowRight,
    Phone,
    Truck,
} from 'lucide-react';

import VehicleGallery from '../components/vehicle/VehicleGallery';
import VehicleSpecifications from '../components/vehicle/VehicleSpecifications';
import BodyDimensions from '../components/vehicle/BodyDimensions';
import VehicleEquipment from '../components/vehicle/VehicleEquipment';
import VehicleStatusBanner from '../components/vehicle/VehicleStatusBanner';

import type { Vehicle } from '../types/vehicle';
import { getVehicleStatus } from '../types/vehicleStatus';

import {
    getVehicleIdFromSlug,
    getVehicleSlug,
} from '../utils/vehicleSlug';

// ========================================
// ТИПИ
// ========================================

type Props = {
    vehicles: Vehicle[];
};

// ========================================
// ФОРМАТУВАННЯ ЦІНИ
// ========================================

const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

// ========================================
// ГОЛОВНИЙ КОМПОНЕНТ
// ========================================

export default function CarDetailsPage({
                                           vehicles,
                                       }: Props) {
    // ID або SEO-friendly slug з адреси
    const { id } = useParams<{ id: string }>();

    const vehicleId = getVehicleIdFromSlug(id);

    const vehicle = vehicles.find(
        car => car.id === vehicleId
    );

    // ========================================
    // АВТОМОБІЛЬ НЕ ЗНАЙДЕНО
    // ========================================

    // Приховані автомобілі теж не потрапляють сюди,
    // оскільки App.tsx передає лише publicVehicles.
    if (!vehicle) {
        return (
            <main className="am-seasonal-surface min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
                <div className="am-seasonal-content mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Автомобіль не знайдено
                    </h1>

                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                        Можливо, оголошення більше недоступне.
                        Перегляньте актуальні автомобілі в каталозі.
                    </p>

                    <Link
                        to="/catalog"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-bold text-gray-950 transition hover:bg-yellow-500"
                    >
                        <ArrowLeft size={18} />
                        Повернутися до каталогу
                    </Link>

                </div>
            </main>
        );
    }

    // ========================================
    // ПРАВИЛЬНИЙ URL
    // ========================================

    const canonicalSlug = getVehicleSlug(vehicle);

    // Старі посилання типу /cars/1
    // автоматично перенаправляємо.
    if (id !== canonicalSlug) {
        return (
            <Navigate
                to={`/cars/${canonicalSlug}`}
                replace
            />
        );
    }

    // ========================================
    // СТАТУС АВТОМОБІЛЯ
    // ========================================

    const status = getVehicleStatus(vehicle.status);

    const isAvailable = status === 'available';
    const isReserved = status === 'reserved';
    const isSold = status === 'sold';

    // ========================================
    // ФОТОГРАФІЇ
    // ========================================

    const images =
        vehicle.images && vehicle.images.length > 0
            ? vehicle.images
            : [vehicle.image];

    // ========================================
    // YOUTUBE
    // ========================================

    const youtubeId =
        vehicle.youtubeVideoId &&
        /^[a-zA-Z0-9_-]{11}$/.test(vehicle.youtubeVideoId)
            ? vehicle.youtubeVideoId
            : null;

    // ========================================
    // СТОРІНКА АВТОМОБІЛЯ
    // ========================================

    return (
        <main className="am-seasonal-surface min-h-screen bg-gray-50 py-10 dark:bg-gray-950">

            <div className="am-seasonal-content mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ===================================
                    ПОВЕРНЕННЯ ДО КАТАЛОГУ
                =================================== */}

                <Link
                    to="/catalog"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-yellow-600 dark:text-gray-300"
                >
                    <ArrowLeft size={18} />

                    Назад до каталогу
                </Link>

                {/* ===================================
                    ЗАГОЛОВОК
                =================================== */}

                <div className="mb-8">

                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                        {vehicle.brand} {vehicle.model}
                    </h1>

                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                        {vehicle.year} рік • {vehicle.bodyType} • {vehicle.fuelType}
                    </p>

                </div>

                {/* ===================================
                    ОСНОВНА СІТКА
                =================================== */}

                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">

                    {/* ===================================
                        ЛІВА ЧАСТИНА
                    =================================== */}

                    <div className="min-w-0 space-y-8">

                        {/* Фотогалерея */}
                        <VehicleGallery
                            key={vehicle.id}
                            images={images}
                            title={`${vehicle.brand} ${vehicle.model}`}
                        />

                        {/* Характеристики */}
                        <VehicleSpecifications
                            vehicle={vehicle}
                        />

                        {/* Розміри кузова */}
                        <BodyDimensions
                            dimensions={vehicle.bodyDimensions}
                        />

                        {/* Комплектація */}
                        <VehicleEquipment
                            equipment={vehicle.equipment}
                        />

                        {/* ===================================
                            ОПИС АВТОМОБІЛЯ
                        =================================== */}

                        {vehicle.description && (
                            <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">

                                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                                    Опис автомобіля
                                </h2>

                                <p className="whitespace-pre-line leading-7 text-gray-600 dark:text-gray-300">
                                    {vehicle.description}
                                </p>

                            </section>
                        )}

                        {/* ===================================
                            YOUTUBE ВІДЕООГЛЯД
                        =================================== */}

                        {youtubeId && (
                            <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">

                                <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">
                                    Відеоогляд автомобіля
                                </h2>

                                <div className="aspect-video overflow-hidden rounded-xl">

                                    <iframe
                                        title={`Відеоогляд ${vehicle.brand} ${vehicle.model}`}
                                        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        className="h-full w-full border-0"
                                    />

                                </div>

                                <a
                                    href={`https://www.youtube.com/watch?v=${youtubeId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-block font-semibold text-yellow-600 hover:underline dark:text-yellow-400"
                                >
                                    Дивитися на YouTube ↗
                                </a>

                            </section>
                        )}

                    </div>

                    {/* ===================================
                        ПРАВА ЧАСТИНА:
                        ЦІНА, СТАТУС І КОНТАКТИ
                    =================================== */}

                    <aside className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900 lg:sticky lg:top-24">

                        {/* Ціна */}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isSold
                                ? 'Остання вказана ціна'
                                : 'Ціна автомобіля'}
                        </p>

                        <p className="mt-2 text-4xl font-extrabold text-gray-950 dark:text-white">
                            {priceFormatter.format(vehicle.price)}
                        </p>

                        {/* ===================================
                            СТАТУС АВТОМОБІЛЯ
                        =================================== */}

                        <div className="mt-5">
                            <VehicleStatusBanner
                                status={status}
                            />
                        </div>

                        {/* ===================================
                            АВТО У НАЯВНОСТІ
                        =================================== */}

                        {isAvailable && (
                            <>
                                {/* Безкоштовна доставка */}
                                <div className="mt-5 flex items-start gap-3 rounded-xl border border-yellow-400/40 bg-yellow-50 p-3 dark:bg-yellow-400/10">

                                    <Truck
                                        size={20}
                                        className="mt-0.5 shrink-0 text-yellow-600 dark:text-yellow-400"
                                    />

                                    <p className="text-sm font-semibold text-gray-900 dark:text-yellow-300">
                                        Безкоштовна доставка по всій Україні
                                    </p>

                                </div>

                                {/* Контакти */}
                                <div className="mt-6 space-y-3">

                                    <a
                                        href="tel:+380671002124"
                                        className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-4 font-bold text-gray-950 transition hover:bg-yellow-500"
                                    >
                                        <Phone size={19} />
                                        067 100 21 24
                                    </a>

                                    <a
                                        href="tel:+380502002124"
                                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-4 font-semibold text-gray-900 transition hover:border-yellow-400 dark:border-gray-700 dark:text-white"
                                    >
                                        <Phone size={19} />
                                        050 200 21 24
                                    </a>

                                </div>
                            </>
                        )}

                        {/* ===================================
                            ЗАВДАТКОВАНИЙ АВТОМОБІЛЬ
                        =================================== */}

                        {isReserved && (
                            <div className="mt-6 space-y-4">

                                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                                    Автомобіль зарезервований за покупцем.
                                    Для уточнення його статусу або підбору
                                    схожого автомобіля зв'яжіться з нами.
                                </p>

                                <a
                                    href="tel:+380671002124"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-4 font-bold text-gray-950 transition hover:bg-yellow-500"
                                >
                                    <Phone size={19} />
                                    Уточнити інформацію
                                </a>

                                <a
                                    href="tel:+380502002124"
                                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-4 font-semibold text-gray-900 transition hover:border-yellow-400 dark:border-gray-700 dark:text-white"
                                >
                                    <Phone size={19} />
                                    050 200 21 24
                                </a>

                                <Link
                                    to="/catalog"
                                    className="flex items-center justify-center gap-2 py-2 text-sm font-bold text-yellow-600 transition hover:underline dark:text-yellow-400"
                                >
                                    Інші автомобілі
                                    <ArrowRight size={17} />
                                </Link>

                            </div>
                        )}

                        {/* ===================================
                            ПРОДАНИЙ АВТОМОБІЛЬ
                        =================================== */}

                        {isSold && (
                            <div className="mt-6 space-y-4">

                                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                                    Цей автомобіль уже знайшов свого власника.
                                    Перегляньте інші доступні пропозиції
                                    AutoMarket Rivne.
                                </p>

                                <Link
                                    to="/catalog"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-4 text-center font-bold text-gray-950 transition hover:bg-yellow-500"
                                >
                                    Переглянути інші автомобілі
                                    <ArrowRight size={19} />
                                </Link>

                            </div>
                        )}

                        {/* Нижній підпис */}
                        <p className="mt-6 border-t border-gray-100 pt-5 text-center text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                            AutoMarket Rivne
                        </p>

                    </aside>

                </div>

            </div>

        </main>
    );
}
