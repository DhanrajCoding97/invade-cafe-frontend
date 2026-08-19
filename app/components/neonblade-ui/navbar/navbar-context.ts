'use client';
import { createContext, useContext } from 'react';

export const NavMobileMenuContext = createContext<{
  closeMobileMenu: () => void;
}>({
  closeMobileMenu: () => {},
});

export const useNavMobileMenu = () => useContext(NavMobileMenuContext);
// in navbar-context.tsx
// export const NavMobileMenuContext = createContext<{
//   closeMobileMenu: () => void;
// }>({
//   closeMobileMenu: () => console.log('DEFAULT NO-OP FIRED'),
// });
// export const useNavMobileMenu = () => useContext(NavMobileMenuContext);
