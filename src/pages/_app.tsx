// ** React Imports
import { ReactNode } from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Store Imports
import { store } from 'src/store'
import { Provider } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import 'src/configs/i18n'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import WindowWrapper from 'src/@core/components/window-wrapper'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { NotificationsProvider } from 'src/context/NotificationsContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

import PushNotificationLayout from './components/pushNotificationLayout'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import 'bootstrap/dist/css/bootstrap.css'
import '../../styles/globals.css'

// Toastify Styles
import "react-toastify/dist/ReactToastify.css";
import Script from 'next/script'
import FacebookPixel from 'src/layouts/components/FacebookPixel'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
    Component: NextPage
    emotionCache: EmotionCache
}

type GuardProps = {
    authGuard: boolean
    guestGuard: boolean
    children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
    Router.events.on('routeChangeStart', () => {
        NProgress.start()
    })
    Router.events.on('routeChangeError', () => {
        NProgress.done()
    })
    Router.events.on('routeChangeComplete', () => {
        NProgress.done()
    })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
    if (guestGuard) {
        return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
    } else if (!guestGuard && !authGuard) {
        return <>{children}</>
    } else {
        return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
    }
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

    // Variables
    const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

    const setConfig = Component.setConfig ?? undefined

    const authGuard = Component.authGuard ?? true

    const guestGuard = Component.guestGuard ?? false

    return (
            <Provider store={store}>
                <CacheProvider value={emotionCache}>
                    <Script async src="https://www.googletagmanager.com/gtag/js?id=G-4NHSLSSK58"></Script>
                    <Script>
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', '${process.env.GA_TAG_ID}');
                    `}
                    </Script>
                    <Head>
                        <title>{`${themeConfig.templateName}`}</title>
                        <meta
                            name='description'
                            content={`${themeConfig.templateName}`}
                        />
                        <meta name='keywords' content='Comida, Hogar, Mama, Casa, Chef, Gourmet' />
                        <meta name='viewport' content='initial-scale=1, width=device-width' />
                    </Head>

                    <AuthProvider>
                        <NotificationsProvider>

                                <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
                                    <SettingsConsumer>
                                    {({ settings }) => {
                                        return (
                                            <ThemeComponent settings={settings}>
                                                <WindowWrapper>
                                                    <Guard authGuard={authGuard} guestGuard={guestGuard}>
                                                        {getLayout(<Component {...pageProps} />)}
                                                    </Guard>
                                                </WindowWrapper>
                                                    <ReactHotToast>
                                                    <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                                                </ReactHotToast>
                                            </ThemeComponent>
                                        )
                                    }}
                                    </SettingsConsumer>
                                </SettingsProvider>

                        </NotificationsProvider>
                    </AuthProvider>
                </CacheProvider>
            </Provider>

    )
}

export default App
