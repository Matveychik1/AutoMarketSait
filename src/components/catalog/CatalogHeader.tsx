
type CatalogResultsHeaderProps = {
    totalVehicles: number;
    firstShown: number;
    lastShown: number;
    bodyType: string;
};

// Головний заголовок сторінки
export default function CatalogHeader() {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                Каталог автомобілів
            </h1>

            <p className="mt-3 text-gray-500 dark:text-gray-400">
                Знайдіть автомобіль для вашого бізнесу
            </p>
        </div>
    );
}

// Заголовок результатів
export function CatalogResultsHeader({
                                         totalVehicles,
                                         firstShown,
                                         lastShown,
                                         bodyType,
                                     }: CatalogResultsHeaderProps) {
    return (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Автомобілі в наявності
                </h2>

                {bodyType && (
                    <p className="mt-2 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                        Категорія: {bodyType}
                    </p>
                )}
            </div>

            <div className="text-right">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Знайдено: {totalVehicles}
                </p>

                {totalVehicles > 0 && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Показано {firstShown}–{lastShown} із {totalVehicles}
                    </p>
                )}
            </div>
        </div>
    );
}
