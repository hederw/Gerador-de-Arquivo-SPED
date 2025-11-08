
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary-dark text-onPrimary shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Gerador de Arquivos SPED</h1>
        <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium hidden md:block">A partir de XML</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
