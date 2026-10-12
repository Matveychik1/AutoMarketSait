
import { useState } from 'react';
import type { ReactNode } from 'react';

import {
    ClipboardCheck,
    RotateCcw,
} from 'lucide-react';

import {
    VEHICLE_STATUSES,
} from '../../types/vehicleStatus';

import type {
    VehicleStatus,
} from '../../types/vehicleStatus';

export type AdminVehicleFormValues = {
    brand: string;
    model: string;
    year: string;
    price: string;
    mileage: string;
    bodyType: string;
    status: VehicleStatus;
    fuelType: 'Дизель' | 'Бензин';
    engineVolume: string;
    transmission: string;
    drivetrain: string;
    powerHp: string;
    payloadKg: string;
    grossWeightKg: string;
    length: string;
    width: string;
    height: string;
    equipment: string;
    description: string;
    youtubeVideoId: string;
};

type Props = {
    photoUploader: ReactNode;
    onSubmit: (values: AdminVehicleFormValues) => void;
    onReset: () => void;
    onDirty: () => void;
    initialValues?: Partial<AdminVehicleFormValues>;
    submitLabel?: string;
};

const BODY_TYPES = [
    'Бортовий',
    'Дубль-кабіна борт',
    'Фургон',
    'Тент',
    'Рефрижератор',
    'Самоскид',
    'Евакуатор',
];

const inputClass =
    'w-full rounded-xl border border-gray-300 bg-white ' +
    'px-4 py-3 text-sm text-gray-900 outline-none ' +
    'transition focus:border-yellow-400 ' +
    'dark:border-gray-700 dark:bg-gray-800 dark:text-white';

const labelClass =
    'mb-2 block text-sm font-semibold ' +
    'text-gray-900 dark:text-white';

function emptyForm(): AdminVehicleFormValues {
    return {
        brand: '',
        model: '',
        year: '',
        price: '',
        mileage: '',
        bodyType: '',
        status: 'available',
        fuelType: 'Дизель',
        engineVolume: '',
        transmission: '',
        drivetrain: '',
        powerHp: '',
        payloadKg: '',
        grossWeightKg: '',
        length: '',
        width: '',
        height: '',
        equipment: '',
        description: '',
        youtubeVideoId: '',
    };
}

type TextFieldKey =
    | 'brand'
    | 'model'
    | 'year'
    | 'price'
    | 'mileage'
    | 'engineVolume'
    | 'powerHp'
    | 'payloadKg'
    | 'grossWeightKg'
    | 'length'
    | 'width'
    | 'height';

type FieldDefinition = {
    key: TextFieldKey;
    label: string;
    placeholder?: string;
    type?: 'text' | 'number';
    required?: boolean;
    min?: number;
    max?: number;
    step?: string;
};

function FormSection({
                         title,
                         children,
                     }: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-6 text-xl font-extrabold text-gray-900 dark:text-white">
                {title}
            </h2>
            {children}
        </section>
    );
}

export default function AdminVehicleForm({
                                             photoUploader,
                                             onSubmit,
                                             onReset,
                                             onDirty,
                                             initialValues,
                                             submitLabel = 'Перевірити дані',
                                         }: Props) {
    const [form, setForm] = useState<AdminVehicleFormValues>(
        () => ({
            ...emptyForm(),
            ...initialValues,
        })
    );

    const currentYear = new Date().getFullYear();

    function updateField<K extends keyof AdminVehicleFormValues>(
        key: K,
        value: AdminVehicleFormValues[K]
    ) {
        setForm(previous => ({
            ...previous,
            [key]: value,
        }));
        onDirty();
    }

    function resetForm() {
        if (!window.confirm('Скинути зміни у формі та фотографіях?')) {
            return;
        }

        setForm({
            ...emptyForm(),
            ...initialValues,
        });

        onReset();
    }

    const basicFields: FieldDefinition[] = [
        {
            key: 'brand',
            label: 'Марка',
            placeholder: 'Mercedes-Benz',
            required: true,
        },
        {
            key: 'model',
            label: 'Модель',
            placeholder: 'Sprinter 316',
            required: true,
        },
        {
            key: 'year',
            label: 'Рік випуску',
            type: 'number',
            required: true,
            min: 1900,
            max: currentYear + 1,
            step: '1',
        },
        {
            key: 'price',
            label: 'Ціна, $',
            type: 'number',
            required: true,
            min: 1,
            step: '1',
        },
        {
            key: 'mileage',
            label: 'Пробіг, км',
            type: 'number',
            required: true,
            min: 0,
            step: '1',
        },
    ];

    const technicalFields: FieldDefinition[] = [
        {
            key: 'engineVolume',
            label: 'Об’єм двигуна, л',
            placeholder: '2.2',
            type: 'number',
            min: 0.1,
            step: '0.01',
        },
        {
            key: 'powerHp',
            label: 'Потужність, к. с.',
            type: 'number',
            min: 0,
            step: '1',
        },
        {
            key: 'payloadKg',
            label: 'Вантажопідйомність, кг',
            type: 'number',
            min: 0,
            step: '1',
        },
        {
            key: 'grossWeightKg',
            label: 'Повна маса, кг',
            type: 'number',
            min: 0,
            step: '1',
        },
    ];

    const dimensions: FieldDefinition[] = [
        {
            key: 'length',
            label: 'Довжина, м',
            type: 'number',
            min: 0,
            step: '0.01',
        },
        {
            key: 'width',
            label: 'Ширина, м',
            type: 'number',
            min: 0,
            step: '0.01',
        },
        {
            key: 'height',
            label: 'Висота, м',
            type: 'number',
            min: 0,
            step: '0.01',
        },
    ];

    function renderField(field: FieldDefinition) {
        return (
            <div key={field.key}>
                <label
                    htmlFor={`admin-${field.key}`}
                    className={labelClass}
                >
                    {field.label}{field.required ? ' *' : ''}
                </label>

                <input
                    id={`admin-${field.key}`}
                    type={field.type ?? 'text'}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={event =>
                        updateField(field.key, event.target.value)
                    }
                    className={inputClass}
                />
            </div>
        );
    }

    return (
        <form
            className="space-y-7"
            onSubmit={event => {
                event.preventDefault();
                onSubmit(form);
            }}
        >
            {/* ОСНОВНІ ДАНІ */}
            <FormSection title="Основна інформація">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {basicFields.map(renderField)}

                    <div>
                        <label
                            htmlFor="admin-bodyType"
                            className={labelClass}
                        >
                            Тип кузова *
                        </label>

                        <select
                            id="admin-bodyType"
                            required
                            value={form.bodyType}
                            onChange={event =>
                                updateField(
                                    'bodyType',
                                    event.target.value
                                )
                            }
                            className={inputClass}
                        >
                            <option value="">Оберіть тип кузова</option>
                            {BODY_TYPES.map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="admin-fuelType"
                            className={labelClass}
                        >
                            Тип палива *
                        </label>

                        <select
                            id="admin-fuelType"
                            required
                            value={form.fuelType}
                            onChange={event =>
                                updateField(
                                    'fuelType',
                                    event.target.value as
                                        AdminVehicleFormValues['fuelType']
                                )
                            }
                            className={inputClass}
                        >
                            <option value="Дизель">Дизель</option>
                            <option value="Бензин">Бензин</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="admin-status"
                            className={labelClass}
                        >
                            Статус автомобіля *
                        </label>

                        <select
                            id="admin-status"
                            required
                            value={form.status}
                            onChange={event =>
                                updateField(
                                    'status',
                                    event.target.value as VehicleStatus
                                )
                            }
                            className={inputClass}
                        >
                            {VEHICLE_STATUSES.map(item => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </select>

                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Приховані авто не відображатимуться
                            у публічному каталозі.
                        </p>
                    </div>
                </div>
            </FormSection>

            {/* ТЕХНІЧНІ ХАРАКТЕРИСТИКИ */}
            <FormSection title="Технічні характеристики">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {technicalFields.map(renderField)}

                    <div>
                        <label
                            htmlFor="admin-transmission"
                            className={labelClass}
                        >
                            Коробка передач
                        </label>

                        <select
                            id="admin-transmission"
                            value={form.transmission}
                            onChange={event =>
                                updateField(
                                    'transmission',
                                    event.target.value
                                )
                            }
                            className={inputClass}
                        >
                            <option value="">Не вказано</option>
                            <option value="Механічна">Механічна</option>
                            <option value="Автоматична">Автоматична</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="admin-drivetrain"
                            className={labelClass}
                        >
                            Привід
                        </label>

                        <select
                            id="admin-drivetrain"
                            value={form.drivetrain}
                            onChange={event =>
                                updateField(
                                    'drivetrain',
                                    event.target.value
                                )
                            }
                            className={inputClass}
                        >
                            <option value="">Не вказано</option>
                            <option value="Передній">Передній</option>
                            <option value="Задній">Задній</option>
                            <option value="Повний">Повний</option>
                        </select>
                    </div>
                </div>
            </FormSection>

            {/* ГАБАРИТИ */}
            <FormSection title="Розміри кузова">
                <div className="grid gap-5 sm:grid-cols-3">
                    {dimensions.map(renderField)}
                </div>
            </FormSection>

            {/* ОПИС І КОМПЛЕКТАЦІЯ */}
            <FormSection title="Опис і комплектація">
                <div className="space-y-5">
                    <div>
                        <label
                            htmlFor="admin-equipment"
                            className={labelClass}
                        >
                            Комплектація
                        </label>

                        <textarea
                            id="admin-equipment"
                            rows={6}
                            value={form.equipment}
                            onChange={event =>
                                updateField(
                                    'equipment',
                                    event.target.value
                                )
                            }
                            placeholder={
                                'Кондиціонер\nКруїз-контроль\nКамера заднього виду'
                            }
                            className={inputClass}
                        />

                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Кожну опцію пиши з нового рядка.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="admin-description"
                            className={labelClass}
                        >
                            Опис автомобіля
                        </label>

                        <textarea
                            id="admin-description"
                            rows={7}
                            value={form.description}
                            onChange={event =>
                                updateField(
                                    'description',
                                    event.target.value
                                )
                            }
                            placeholder="Стан автомобіля та додаткова інформація..."
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="admin-youtube"
                            className={labelClass}
                        >
                            YouTube-відео
                        </label>

                        <input
                            id="admin-youtube"
                            type="text"
                            value={form.youtubeVideoId}
                            onChange={event =>
                                updateField(
                                    'youtubeVideoId',
                                    event.target.value
                                )
                            }
                            placeholder="Посилання або ID YouTube-відео"
                            className={inputClass}
                        />
                    </div>
                </div>
            </FormSection>

            {/* ФОТОГРАФІЇ */}
            {photoUploader}

            {/* ДІЇ */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    * Обов'язкові поля
                </p>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-900 hover:border-yellow-400 dark:border-gray-700 dark:text-white"
                    >
                        <RotateCcw size={18} />
                        Скинути
                    </button>

                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-extrabold text-gray-950 transition hover:bg-yellow-500"
                    >
                        <ClipboardCheck size={19} />
                        {submitLabel}
                    </button>
                </div>
            </div>
        </form>
    );
}
