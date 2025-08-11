// src/components/Header.tsx

import { ArrowRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom'; 

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* left side logo ANd BrANDH NAME */}
        <div className="flex items-center gap-2">
          {/* 2. WAPED LOGO AND LINK*/}
          <Link to="/">
            <img
              src="/logo.svg"
              alt="Passet.vc Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
          
          {/* 3. CHANEG LIn ed to a div */}
          <Link to="/" className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold rounded-full text-sm cursor-pointer">
            PASSET.VC
          </Link>
        </div>

        {/* signUp Buton right side -- MODIFIED LINK BELOW */}
        <a
          href="/signup"
          target="_blank"
          rel="noopener noreferrer"
          // CHANGE: Replaced zinc background with purple gradient and updated text style
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold px-5 py-2.5 rounded-full text-sm"
        >
          <span>Sign up as an Operator</span>
          {/* CHANGE: Updated arrow color for better contrast */}
          <ArrowRight className="w-4 h-4 text-white" />
        </a>
      </div>
    </header>
  );
};

export default Header;