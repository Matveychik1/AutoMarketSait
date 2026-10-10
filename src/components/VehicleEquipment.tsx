
import { CheckCircle2 } from 'lucide-react';

type Props = {
    equipment?: string[];
};

export default function VehicleEquipment({
                                             equipment,
                                         }: Props) {
    if (!equipment || equipment.length === 0) {
        return null;
    }

    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                Комплектація
            </h2>

            <ul className="grid gap-4 sm:grid-cols-2">
                {equipment.map((item, index) => (
                    <li
                        key={`${item}-${index}`}
                        className="flex items-start gap-3"
                    >
                        <CheckCircle2
                            size={21}
                            className="mt-0.5 shrink-0 text-green-500"
                        />

                        <span className="font-medium text-gray-700 dark:text-gray-200">
                            {item}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
