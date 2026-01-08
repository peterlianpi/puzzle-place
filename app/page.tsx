import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('../components/landing/Hero'));
const PopularEvents = dynamic(() => import('../components/landing/PopularEvents'));
const TopUsers = dynamic(() => import('../components/landing/TopUsers'));
const Statistics = dynamic(() => import('../components/landing/Statistics'));
const Testimonials = dynamic(() => import('../components/landing/Testimonials'));
const Features = dynamic(() => import('../components/landing/Features'));
const Footer = dynamic(() => import('../components/landing/Footer'));

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <PopularEvents />
      <TopUsers />
      <Statistics />
      <Testimonials />
      <Features />
      <Footer />
    </div>
  );
}