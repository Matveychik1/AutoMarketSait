
import {
    CheckCircle2,
    LockKeyhole,
    CircleCheck,
    EyeOff,
} from 'lucide-react';

import type { VehicleStatus } from '../../types/vehicleStatus';

type Props = {
    status?: VehicleStatus;
};

export default function VehicleStatusBanner({
                                                status = 'available',
                                            }: Props) {
    if (status === 'available') {
        return (
            <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 dark:border-green-900 dark:bg-green-500/10">
                <CheckCircle2
                    size={24}
                    className="shrink-0 text-green-600 dark:text-green-400"
                />

                <div>
                    <p className="font-extrabold text-green-800 dark:text-green-400">
                        У наявності
                    </p>

                    <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                        Автомобіль доступний для покупки.
                    </p>
                </div>
            </div>
        );
    }

    if (status === 'reserved') {
        return (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 dark:border-amber-800 dark:bg-amber-500/10">
                <LockKeyhole
                    size={24}
                    className="shrink-0 text-amber-600 dark:text-amber-400"
                />

                <div>
                    <p className="font-extrabold text-amber-800 dark:text-amber-400">
                        Завдаткований
                    </p>

                    <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                        За автомобіль уже внесено завдаток.
                        Він зарезервований за покупцем.
                    </p>
                </div>
            </div>
        );
    }

    if (status === 'sold') {
        return (
            <div className="flex items-center gap-3 rounded-2xl border border-gray-300 bg-gray-100 px-5 py-4 dark:border-gray-700 dark:bg-gray-800">
                <CircleCheck
                    size={24}
                    className="shrink-0 text-gray-600 dark:text-gray-300"
                />

                <div>
                    <p className="font-extrabold text-gray-900 dark:text-white">
                        Продано
                    </p>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Цей автомобіль уже проданий.
                        Перегляньте інші пропозиції в каталозі.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-900 dark:bg-red-500/10">
            <EyeOff
                size={24}
                className="shrink-0 text-red-600 dark:text-red-400"
            />

            <div>
                <p className="font-extrabold text-red-800 dark:text-red-400">
                    Приховано
                </p>

                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    Автомобіль недоступний для публічного перегляду.
                </p>
            </div>
        </div>
    );
}
