
import { Ruler } from 'lucide-react';
import type { Vehicle } from '../types/vehicle';

type Props = {
    dimensions?: Vehicle['bodyDimensions'];
};

export default function BodyDimensions({
                                           dimensions,
                                       }: Props) {
    if (!dimensions) return null;

    const sizes = [
        { label: 'Довжина', value: dimensions.length },
        { label: 'Ширина', value: dimensions.width },
        { label: 'Висота', value: dimensions.height },
    ].filter(
        (item): item is { label: string; value: number } =>
            item.value !== undefined
    );

    if (sizes.length === 0) return null;

    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
            <div className="mb-6 flex items-center gap-3">
                <Ruler size={24} className="text-yellow-500" />

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Розміри кузова
                </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {sizes.map(size => (
                    <div
                        key={size.label}
                        className="rounded-xl bg-gray-50 p-5 text-center dark:bg-gray-800"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {size.label}
                        </p>

                        <p className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">
                            {size.value.toLocaleString('uk-UA', {
                                maximumFractionDigits: 2,
                            })} м
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
