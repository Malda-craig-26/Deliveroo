import { useState, useEffect } from 'react';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import DemoModal from '../components/DemoModal';
import MpesaPayment from '../components/MpesaPayment';
import Header from '../components/Header';
import Features from '../components/Features';
import FunctionalFeatures from '../components/FunctionalFeatures';
import Status from '../components/Status';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import Hero from '../components/Hero';

const Index = ( ) => {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showDemo, setShowDemo] = useState(false);
    const [showMpesaPayment, setShowMpesaPayment] = useState(false);

    const handelGetStarted = () => {
        setShowMpesaPayment(true);
    } ;  
    
    const handelSignUpSuccess = () => {
        setShowMpesaPayment(true);
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-blue-100'>
    <Header 
        onLoginClick={ () => setShowLogin(true) }
        onSignupClick={ () => setShowSignup(true) }
    />
    <Hero 
        onGetStartedClick={handelGetStarted} 
        onWatchDemoClick={() => setShowDemo(true)} 
    />
    <Features />
    <FunctionalFeatures />
    <Status />
    <Pricing />
    <Contact />

    <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    <SignupModal 
        open={showSignup}
        onOpenChange={setShowSignup}
        onSignUpSuccess={handelSignUpSuccess}
    
    />
    <DemoModal open={showDemo} onOpenChange={setShowDemo} />
    <MpesaPayment open={showMpesaPayment} onOpenChamge={setShowMpesaPayment}
                            />
            
        </div>
    );

    
    
};

export default Index;
