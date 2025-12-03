import React from 'react';

interface NavLinkProps {
  children: React.ReactNode;
  onClick: () => void;
}

export const NavLink = React.memo(function NavLink({ children, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden font-medium text-sm uppercase tracking-wider group h-6"
    >
      <span className="relative block transition-transform duration-300 ease-out group-hover:-translate-y-full text-gray-900 whitespace-nowrap">
        {children}
      </span>
      <span className="absolute left-0 top-full block transition-transform duration-300 ease-out group-hover:-translate-y-full bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 bg-clip-text text-transparent font-semibold whitespace-nowrap">
        {children}
      </span>
    </button>
  );
});

export const MobileNavLink = React.memo(function MobileNavLink({ children, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left text-gray-700 hover:text-violet-600 py-4 px-4 rounded-lg hover:bg-violet-50 transition-colors duration-300 touch-feedback text-lg font-medium"
    >
      {children}
    </button>
  );
});