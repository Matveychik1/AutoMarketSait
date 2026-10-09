
export type Vehicle = {
    id: number;

    brand: string;
    model: string;

    year: number;
    price: number;
    mileage: number;

    bodyType: string;
    engineVolume: number;

    fuelType:
        | 'Дизель'
        | 'Бензин'
        | 'Електро'
        | 'Гібрид';

    // Головне фото для каталогу
    image: string;

    // Дата для сортування (на сайті не показуємо)
    addedAt: string;

    // Всі фотографії автомобіля (30–50 або більше)
    images?: string[];

    // Детальний опис автомобіля
    description?: string;

    // ID відеоогляду з YouTube
    youtubeVideoId?: string;
};
