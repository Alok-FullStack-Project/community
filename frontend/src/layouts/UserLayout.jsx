import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const ManagerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
                 <Header />
                 <main className="flex-1 container mx-auto p-0">
            
                   <Outlet />
                 </main>
                 <Footer />
           </div>
  );
};

export default ManagerLayout;
