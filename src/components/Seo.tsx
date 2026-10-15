
import { useEffect } from 'react';

type SeoProps = {
    title: string;
    description: string;
    path: string;
};

export default function Seo({
                                title,
                                description,
                                path,
                            }: SeoProps) {
    useEffect(() => {
        const previousTitle = document.title;
        const restore: Array<() => void> = [];

        document.title = title;

        const canonicalUrl = new URL(
            path,
            window.location.origin
        ).href;

        function setMeta(
            attribute: 'name' | 'property',
            key: string,
            content: string
        ) {
            let element =
                document.head.querySelector<HTMLMetaElement>(
                    `meta[${attribute}="${key}"]`
                );

            const created = !element;
            const previous = element?.getAttribute('content');

            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, key);
                document.head.appendChild(element);
            }

            const target = element;
            target.content = content;

            restore.push(() => {
                if (created) {
                    target.remove();
                } else if (previous !== null &&
                    previous !== undefined) {
                    target.content = previous;
                } else {
                    target.removeAttribute('content');
                }
            });
        }

        setMeta('name', 'description', description);

        setMeta('property', 'og:type', 'website');
        setMeta('property', 'og:title', title);
        setMeta('property', 'og:description', description);
        setMeta('property', 'og:url', canonicalUrl);

        setMeta('name', 'twitter:title', title);
        setMeta('name', 'twitter:description', description);

        // Canonical URL
        let canonical =
            document.head.querySelector<HTMLLinkElement>(
                'link[rel="canonical"]'
            );

        const createdCanonical = !canonical;
        const previousHref =
            canonical?.getAttribute('href');

        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }

        const canonicalElement = canonical;
        canonicalElement.href = canonicalUrl;

        restore.push(() => {
            if (createdCanonical) {
                canonicalElement.remove();
            } else if (previousHref !== null &&
                previousHref !== undefined) {
                canonicalElement.setAttribute(
                    'href',
                    previousHref
                );
            } else {
                canonicalElement.removeAttribute('href');
            }
        });

        return () => {
            restore.reverse().forEach(cleanup => cleanup());
            document.title = previousTitle;
        };
    }, [title, description, path]);

    return null;
}
