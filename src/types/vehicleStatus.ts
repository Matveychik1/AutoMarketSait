
export type VehicleStatus =
    | 'available'
    | 'reserved'
    | 'sold'
    | 'hidden';

export const VEHICLE_STATUSES: {
    value: VehicleStatus;
    label: string;
}[] = [
    { value: 'available', label: 'У наявності' },
    { value: 'reserved', label: 'Завдаткований' },
    { value: 'sold', label: 'Продано' },
    { value: 'hidden', label: 'Приховано' },
];

export const VEHICLE_STATUS_LABELS: Record<
    VehicleStatus,
    string
> = {
    available: 'У наявності',
    reserved: 'Завдаткований',
    sold: 'Продано',
    hidden: 'Приховано',
};

export function getVehicleStatus(
    status?: VehicleStatus
): VehicleStatus {
    return status ?? 'available';
}
