
export type Vehicle = {
    id: number;
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    bodyType: string;
    engineVolume: number | null;

    fuelType:
        | 'Дизель'
        | 'Бензин';

    // Фото та опис
    image: string;
    images?: string[];
    description?: string;
    youtubeVideoId?: string;

    // Для сортування (покупцю не показуємо)
    addedAt: string;

    // Додаткові технічні характеристики
    transmission?: string;
    drivetrain?: string;
    powerHp?: number;
    payloadKg?: number;
    grossWeightKg?: number;

    // Габарити кузова в метрах
    bodyDimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };

    // Комплектація автомобіля
    equipment?: string[];
};
