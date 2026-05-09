import AppLayout from '@/Layouts/AppLayout';
import Navbar from '@/Components/Navbar';
import Hero from '@/Components/Hero';
import OurServices from '@/Components/OurServices';
import HowItWorks from '@/Components/HowItWorks';
import Faqs from '@/Components/Faqs';
import GetinTouch from '@/Components/GetinTouch';
import Footer from '@/Components/Footer';

export default function Home() {
    return (
        <AppLayout title="Dollar Growth | Investment Platform">
            <Navbar />
            <Hero />
            <OurServices />
            <HowItWorks />
            <Faqs />
            <GetinTouch />
            <Footer />
        </AppLayout>
    );
}