
import { Check, X } from 'lucide-react';

type BodyTypeSelectorProps = {
    value: string;
    onChange: (value: string) => void;
};

const bodyTypes = [
    {
        name: 'Бортовий',
        image: '/PhotoAutoMarket/bodytypes/bort.png',
    },
    {
        name: 'Рефрижератор',
        image: '/PhotoAutoMarket/bodytypes/ref.png',
    },
    {
        name: 'Тент',
        image: '/PhotoAutoMarket/bodytypes/tent.png',
    },
    {
        name: 'Фургон',
        image: '/PhotoAutoMarket/bodytypes/furgon.png',
    },
];

export default function BodyTypeSelector({
                                             value,
                                             onChange,
                                         }: BodyTypeSelectorProps) {
    return (
        <div>
            <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Тип кузова
                </h3>

                {value && (
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-yellow-600 dark:text-gray-400"
                    >
                        <X size={15} />
                        Очистити
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {bodyTypes.map(type => {
                    const selected = value === type.name;

                    return (
                        <button
                            key={type.name}
                            type="button"
                            onClick={() => onChange(
                                selected ? '' : type.name
                            )}
                            aria-pressed={selected}
                            className={`group relative overflow-hidden rounded-2xl border-2 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 ${
                                selected
                                    ? 'border-yellow-400 bg-yellow-50 dark:bg-gray-700'
                                    : 'border-gray-200 bg-gray-50 hover:border-yellow-400 dark:border-gray-700 dark:bg-gray-800'
                            }`}
                        >
                            {/* Фото автомобіля */}
                            <div className="relative flex aspect-[5/3] items-center justify-center overflow-hidden p-2">
                                <img
                                    src={type.image}
                                    alt=""
                                    loading="lazy"
                                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                                />

                                {selected && (
                                    <span className="absolute right-2 top-2 rounded-full bg-yellow-400 p-1 text-gray-950">
                                        <Check size={16} strokeWidth={3} />
                                    </span>
                                )}
                            </div>

                            {/* Назва кузова */}
                            <div className="border-t border-gray-200 px-2 py-3 text-center dark:border-gray-700">
                                <span className="text-xs font-bold text-gray-900 sm:text-sm dark:text-white">
                                    {type.name}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {value
                    ? `Обрано: ${value}`
                    : 'Оберіть тип кузова або залиште всі типи'}
            </p>
        </div>
    );
}
