import { component$, useStyles$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';

import { ApiProvider } from './components/api/api-provider';
import { NotificationsProvider } from './components/notifications/notifications-provider';
import globalStyles from './global.css?inline';

export default component$(() => {
    /**
     * The root of a QwikCity site always start with the <QwikCityProvider> component,
     * immediately followed by the document's <head> and <body>.
     *
     * Don't remove the `<head>` and `<body>` elements.
     */
    useStyles$(globalStyles);

    return (
        <ApiProvider>
            <QwikCityProvider>
                <head>
                    <meta charSet="utf-8" />
                    <link rel="manifest" href="/manifest.json" />
                    <RouterHead />
                </head>
                <body lang="en">
                    <NotificationsProvider>
                        <RouterOutlet />
                    </NotificationsProvider>
                    <ServiceWorkerRegister />
                </body>
            </QwikCityProvider>
        </ApiProvider>
    );
});
