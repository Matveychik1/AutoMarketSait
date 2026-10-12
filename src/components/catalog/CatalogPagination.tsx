
import {
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

type CatalogPaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const MAX_VISIBLE_PAGES = 5;

export default function CatalogPagination({
                                              currentPage,
                                              totalPages,
                                              onPageChange,
                                          }: CatalogPaginationProps) {
    // Якщо сторінка одна, кнопки не потрібні
    if (totalPages <= 1) {
        return null;
    }

    // Максимум 5 номерів сторінок одночасно
    const visibleCount = Math.min(
        MAX_VISIBLE_PAGES,
        totalPages
    );

    const firstVisiblePage = Math.max(
        1,
        Math.min(
            currentPage - Math.floor(visibleCount / 2),
            totalPages - visibleCount + 1
        )
    );

    const lastVisiblePage =
        firstVisiblePage + visibleCount - 1;

    const visiblePages = Array.from(
        { length: visibleCount },
        (_, index) => firstVisiblePage + index
    );

    const normalButtonClass =
        'flex h-11 min-w-11 items-center justify-center ' +
        'rounded-xl border border-gray-300 bg-white px-3 ' +
        'font-bold text-gray-900 transition ' +
        'hover:border-yellow-400 hover:bg-yellow-400 ' +
        'disabled:cursor-not-allowed disabled:opacity-40 ' +
        'dark:border-gray-700 dark:bg-gray-900 ' +
        'dark:text-white dark:hover:text-gray-950';

    const activeButtonClass =
        'flex h-11 min-w-11 items-center justify-center ' +
        'rounded-xl border border-yellow-400 bg-yellow-400 ' +
        'px-3 font-bold text-gray-950 shadow-sm';

    return (
        <nav
            aria-label="Сторінки каталогу автомобілів"
            className="mt-12 flex flex-col items-center gap-4"
        >
            <div className="flex flex-wrap items-center justify-center gap-2">

                {/* Попередня сторінка */}
                <button
                    type="button"
                    onClick={() =>
                        onPageChange(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    aria-label="Попередня сторінка"
                    className={normalButtonClass}
                >
                    <ChevronLeft size={21} />
                </button>

                {/* Перша сторінка, якщо її не видно */}
                {firstVisiblePage > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => onPageChange(1)}
                            aria-label="Сторінка 1"
                            className={normalButtonClass}
                        >
                            1
                        </button>

                        {firstVisiblePage > 2 && (
                            <span
                                aria-hidden="true"
                                className="px-1 text-gray-500"
                            >
                                …
                            </span>
                        )}
                    </>
                )}

                {/* Основні номери */}
                {visiblePages.map(page => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        aria-label={`Сторінка ${page}`}
                        aria-current={
                            page === currentPage
                                ? 'page'
                                : undefined
                        }
                        className={
                            page === currentPage
                                ? activeButtonClass
                                : normalButtonClass
                        }
                    >
                        {page}
                    </button>
                ))}

                {/* Остання сторінка, якщо її не видно */}
                {lastVisiblePage < totalPages && (
                    <>
                        {lastVisiblePage < totalPages - 1 && (
                            <span
                                aria-hidden="true"
                                className="px-1 text-gray-500"
                            >
                                …
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={() =>
                                onPageChange(totalPages)
                            }
                            aria-label={`Сторінка ${totalPages}`}
                            className={normalButtonClass}
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Наступна сторінка */}
                <button
                    type="button"
                    onClick={() =>
                        onPageChange(currentPage + 1)
                    }
                    disabled={currentPage === totalPages}
                    aria-label="Наступна сторінка"
                    className={normalButtonClass}
                >
                    <ChevronRight size={21} />
                </button>
            </div>

            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Сторінка {currentPage} із {totalPages}
            </p>
        </nav>
    );
}
