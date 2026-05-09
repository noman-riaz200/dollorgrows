import { Head } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';

export default function AppLayout({ title, children }) {
    return (
        <>
            <Head>
                <title>{title || 'Dollar Growth | Investment Platform'}</title>
                <meta 
                    name="description" 
                    content="Premier investment platform with advanced growth strategies and secure returns. Dollar Growth - Where your investments multiply." 
                />
                <meta 
                    name="keywords" 
                    content="crypto, investment, dollar growth, finance, growth platform, dollarorgrows" 
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <div className="min-h-screen bg-gray-50">
                {children}
                <Toaster 
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            theme: {
                                primary: 'green',
                                secondary: 'black',
                            },
                        },
                    }}
                />
            </div>
        </>
    );
}