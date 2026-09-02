'use client';
import { createContext, useContext } from 'react';

export const NavMobileMenuContext = createContext<{
  closeMobileMenu: () => void;
}>({
  closeMobileMenu: () => {},
});

export const useNavMobileMenu = () => useContext(NavMobileMenuContext);
