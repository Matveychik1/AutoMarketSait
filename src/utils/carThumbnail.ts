
/**
 * Повертає URL маленького WebP-прев'ю.
 *
 * Нові фотографії:
 * /uploads/cars/GUID.webp
 *               ↓
 * /uploads/cars/GUID_thumb.webp
 *
 * Старі JPG, PNG та інші URL не змінюються.
 */
export function getCarThumbnailUrl(
    imageUrl: string
): string {
    const match = imageUrl.match(
        /^\/uploads\/cars\/([a-f0-9]{32})\.webp$/i
    );

    if (!match) {
        return imageUrl;
    }

    return `/uploads/cars/${match[1]}_thumb.webp`;
}
