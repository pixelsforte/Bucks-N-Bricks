
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustedCompanies } from './components/TrustedCompanies';
import { Services } from './components/Services';
import { Vacancies } from './components/Vacancies';
import { ResumeSection } from './components/ResumeSection';
import { JourneyTimeline } from './components/JourneyTimeline';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Team } from './components/Team';
import { Testimonials } from './components/Testimonials';
import { BlogCards } from './components/BlogCards';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AboutPage } from './components/AboutPage';
import { ServiceDetailsPage } from './components/ServiceDetailsPage';
import { CareerPage } from './components/CareerPage';
import { BlogPage } from './components/BlogPage';
import { CEOPage } from './components/CEOPage';
import { OurImpactPage } from './components/OurImpactPage';
import { JobDetailPage } from './components/JobDetailPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { Chatbot } from './components/Chatbot';
import { ConsentPopup } from './components/ConsentPopup';
import { PrivacyTermsPage } from './components/PrivacyTermsPage';
import { getAdminPanelRoute } from './services/api';

interface RouteState {
  page: string;
  adminSubRoute: 'setup' | 'login' | 'dashboard' | 'default';
  isInvalidAdmin: boolean;
}

function parseCurrentRoute(): RouteState {
  const adminRoute = getAdminPanelRoute(); // e.g. "management-portal"
  const rawHash = window.location.hash
    .replace(/^#\/?/, '')
    .replace(/^!/, '')
    .replace(/^\/+|\/+$/g, '')
    .split('?')[0];

  const rawPath = window.location.pathname
    .replace(/^\/+|\/+$/g, '')
    .split('?')[0];

  // In SPA with hash navigation, hash takes priority when present
  const rawRoute = rawHash || rawPath;

  // 1. Check if accessing admin route (supports 'admin' as well as configured adminRoute / management-portal)
  const isAdminTarget =
    rawRoute === 'admin' ||
    rawRoute.startsWith('admin/') ||
    rawRoute === adminRoute ||
    rawRoute.startsWith(`${adminRoute}/`) ||
    rawRoute === 'management-portal' ||
    rawRoute.startsWith('management-portal/');

  if (isAdminTarget) {
    let cleanSub = '';
    if (rawRoute === 'admin' || rawRoute === adminRoute || rawRoute === 'management-portal') {
      cleanSub = '';
    } else if (rawRoute.startsWith('admin/')) {
      cleanSub = rawRoute.replace(/^admin\/?/, '');
    } else if (rawRoute.startsWith('management-portal/')) {
      cleanSub = rawRoute.replace(/^management-portal\/?/, '');
    } else if (rawRoute.startsWith(`${adminRoute}/`)) {
      cleanSub = rawRoute.replace(adminRoute, '').replace(/^\/+/, '');
    }

    if (cleanSub === 'setup') return { page: 'admin', adminSubRoute: 'setup', isInvalidAdmin: false };
    if (cleanSub === 'login') return { page: 'admin', adminSubRoute: 'login', isInvalidAdmin: false };
    if (cleanSub === 'dashboard' || cleanSub.startsWith('dashboard/')) return { page: 'admin', adminSubRoute: 'dashboard', isInvalidAdmin: false };
    return { page: 'admin', adminSubRoute: 'default', isInvalidAdmin: false };
  }

  // 3. Public standalone routes
  if (rawRoute.startsWith('job-')) return { page: 'job-detail', adminSubRoute: 'default', isInvalidAdmin: false };
  if (rawRoute === 'about') return { page: 'about', adminSubRoute: 'default', isInvalidAdmin: false };
  if (rawRoute === 'career') return { page: 'career', adminSubRoute: 'default', isInvalidAdmin: false };
  if (rawRoute === 'blog') return { page: 'blog', adminSubRoute: 'default', isInvalidAdmin: false };
  if (rawRoute === 'ceo' || rawRoute === 'founder' || rawRoute === 'our-story') return { page: 'ceo', adminSubRoute: 'default', isInvalidAdmin: false };
  if (rawRoute === 'impact') return { page: 'impact', adminSubRoute: 'default', isInvalidAdmin: false };
  if (rawRoute === 'privacy-policy' || rawRoute === 'privacy') return { page: 'privacy-policy', adminSubRoute: 'default', isInvalidAdmin: false };
  if (rawRoute === 'terms' || rawRoute === 'terms-of-service') return { page: 'terms', adminSubRoute: 'default', isInvalidAdmin: false };

  const servicePages = ['executive-search', 'recruitment-solution', 'hr-consulting', 'learning-development'];
  if (servicePages.includes(rawRoute)) return { page: rawRoute, adminSubRoute: 'default', isInvalidAdmin: false };

  return { page: 'home', adminSubRoute: 'default', isInvalidAdmin: false };
}

function getInitialJobId(): string {
  const hash = window.location.hash.replace(/^#\/?/, '').replace(/^\/+|\/+$/g, '');
  if (hash.startsWith('job-')) {
    return hash.replace(/^job-/, '') || '1';
  }
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (path.startsWith('job-')) {
    return path.replace(/^job-/, '') || '1';
  }
  return '1';
}

export default function App() {
  const [selectedJobId, setSelectedJobId] = useState<string>(() => getInitialJobId());

  const [routeState, setRouteState] = useState<RouteState>(() => parseCurrentRoute());

  useEffect(() => {
    const handleLocationChange = () => {
      const state = parseCurrentRoute();
      if (state.isInvalidAdmin) {
        // Redirect invalid admin URL to public home page
        window.history.replaceState(null, '', '/#home');
        window.location.hash = '#home';
      }
      if (state.page !== 'admin' && window.location.pathname !== '/' && window.location.pathname !== '') {
        const targetHash = state.page === 'home' ? 'home' : (window.location.hash.replace(/^#\/?/, '') || state.page);
        window.history.replaceState(null, '', `/#${targetHash}`);
      }
      if (state.page === 'job-detail') {
        const hash = window.location.hash.replace(/^#\/?/, '');
        if (hash.startsWith('job-')) {
          setSelectedJobId(hash.replace(/^job-/, '') || '1');
        }
      }
      if (state.page === 'home') {
        const targetHash = window.location.hash.replace(/^#\/?/, '');
        if (targetHash === 'services' || targetHash === 'contact' || targetHash === 'team' || targetHash === 'why-choose-us') {
          setTimeout(() => {
            const el = document.getElementById(targetHash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
      setRouteState(state);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    if (routeState.isInvalidAdmin) {
      window.history.replaceState(null, '', '/#home');
      window.location.hash = '#home';
    } else if (routeState.page !== 'admin' && window.location.pathname !== '/' && window.location.pathname !== '') {
      const targetHash = routeState.page === 'home' ? 'home' : (window.location.hash.replace(/^#\/?/, '') || routeState.page);
      window.history.replaceState(null, '', `/#${targetHash}`);
    }

    const initialHash = window.location.hash.replace(/^#\/?/, '');
    if (initialHash === 'services' || initialHash === 'contact' || initialHash === 'team' || initialHash === 'why-choose-us') {
      setTimeout(() => {
        const el = document.getElementById(initialHash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handlePageChange = (page: string) => {
    if (page === 'home') {
      window.history.pushState(null, '', '/#home');
      window.location.hash = '#home';
      setRouteState({ page: 'home', adminSubRoute: 'default', isInvalidAdmin: false });
      window.scrollTo(0, 0);
    } else {
      window.history.pushState(null, '', `/#${page}`);
      window.location.hash = `#${page}`;
      setRouteState({ page, adminSubRoute: 'default', isInvalidAdmin: false });
      window.scrollTo(0, 0);
    }
  };

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    window.location.hash = `#job-${jobId}`;
    setRouteState({ page: 'job-detail', adminSubRoute: 'default', isInvalidAdmin: false });
    window.scrollTo(0, 0);
  };

  const navigateAdminSubRoute = (subRoute: 'setup' | 'login' | 'dashboard') => {
    const adminRoute = getAdminPanelRoute();
    const path = `/${adminRoute}/${subRoute}`;
    window.history.pushState(null, '', path);
    window.location.hash = `#${adminRoute}/${subRoute}`;
    setRouteState({ page: 'admin', adminSubRoute: subRoute, isInvalidAdmin: false });
  };

  if (routeState.page === 'admin') {
    return (
      <AdminLayout
        subRoute={routeState.adminSubRoute}
        onNavigateSubRoute={navigateAdminSubRoute}
        onBackToPublic={() => handlePageChange('home')}
      />
    );
  }

  const isServicePage = ['executive-search', 'recruitment-solution', 'hr-consulting', 'learning-development'].includes(routeState.page);
  const isJobDetailPage = routeState.page === 'job-detail';

  return (
    <div className="relative min-h-screen bg-[#fcfbfa] flex flex-col overflow-x-hidden antialiased">
      {/* Dynamic Header & Sticky Navigation */}
      <Navbar currentPage={routeState.page} onPageChange={handlePageChange} />

      <main className="flex-1">
        {isJobDetailPage ? (
          <JobDetailPage key={selectedJobId} jobId={selectedJobId} onBack={() => handlePageChange('career')} />
        ) : routeState.page === 'about' ? (
          <AboutPage />
        ) : routeState.page === 'career' ? (
          <CareerPage />
        ) : routeState.page === 'blog' ? (
          <BlogPage />
        ) : routeState.page === 'ceo' ? (
          <CEOPage />
        ) : routeState.page === 'impact' ? (
          <OurImpactPage />
        ) : routeState.page === 'privacy-policy' ? (
          <PrivacyTermsPage title="Privacy Policy" />
        ) : routeState.page === 'terms' ? (
          <PrivacyTermsPage title="Terms & Conditions" />
        ) : isServicePage ? (
          <ServiceDetailsPage serviceType={routeState.page as any} />
        ) : (
          <>
            {/* Hero Banner Section */}
            <Hero />

            {/* Logo Band Horizonal Loop */}
            <TrustedCompanies />

            {/* Services & Detailed Features */}
            <Services onServiceSelect={handlePageChange} />

            {/* Vacancies / Job Listings Board */}
            <Vacancies onSelectJob={handleSelectJob} />

            {/* AI Resume Check Engine */}
            <ResumeSection />

            {/* Milestone Journey Wave Timeline */}
            <JourneyTimeline />

            {/* About / Why Choose Us Column Block */}
            <WhyChooseUs />

            {/* Professional Core Members Grid */}
            <Team />

            {/* Clients & Happy Testimonies Sliders */}
            <Testimonials />

            {/* Latest Blog Post Cards Spread */}
            <BlogCards />

            {/* Custom Form & Support Panel */}
            <Contact />
          </>
        )}
      </main>
      {/* Structured Footer Column Grid */}
      <Footer onPageChange={handlePageChange} />
      <Chatbot />
      <ConsentPopup />
    </div>
  );
}

