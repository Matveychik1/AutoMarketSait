
import CatalogHeader, {
    CatalogResultsHeader,
} from '../components/catalog/CatalogHeader';

import CatalogFilters from '../components/catalog/CatalogFilters';
import CatalogGrid from '../components/catalog/CatalogGrid';
import CatalogPagination from '../components/catalog/CatalogPagination';

import { useCatalog } from '../hooks/useCatalog';

import type { Vehicle } from '../types/vehicle';

type CatalogPageProps = {
    vehicles: Vehicle[];
};

export default function CatalogPage({
                                        vehicles,
                                    }: CatalogPageProps) {
    // Уся логіка каталогу зберігається в hook
    const catalog = useCatalog(vehicles);

    return (
        <main className="am-seasonal-surface min-h-screen bg-gray-50 py-12 dark:bg-gray-950">

            <div className="am-seasonal-content mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Назва сторінки */}
                <CatalogHeader />

                {/* Пошук, фільтри, сортування */}
                <CatalogFilters
                    key={catalog.filterKey}
                    appliedFilters={catalog.appliedFilters}
                    brands={catalog.brands}
                    fuelTypes={catalog.fuelTypes}
                    engineVolumes={catalog.engineVolumes}
                    onApply={catalog.applyFilters}
                    onReset={catalog.resetFilters}
                />

                {/* Результати каталогу */}
                <section
                    id="catalog-results"
                    aria-label="Автомобілі в каталозі"
                    className="scroll-mt-28"
                >
                    {/* Заголовок та кількість авто */}
                    <CatalogResultsHeader
                        totalVehicles={catalog.totalVehicles}
                        firstShown={catalog.firstShown}
                        lastShown={catalog.lastShown}
                        bodyType={catalog.appliedFilters.bodyType}
                    />

                    {/* Картки автомобілів */}
                    <CatalogGrid
                        vehicles={catalog.paginatedVehicles}
                        onResetFilters={catalog.resetFilters}
                    />

                    {/* Перемикання кожних 12 авто */}
                    <CatalogPagination
                        currentPage={catalog.currentPage}
                        totalPages={catalog.totalPages}
                        onPageChange={catalog.goToPage}
                    />

                </section>

            </div>
        </main>
    );
}
