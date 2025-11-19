// src/frontend/src/hooks/useResponsive.js
// Hook for responsive breakpoint detection and management

import { useState, useEffect } from 'react';

const BREAKPOINTS = {
  xs: 0,
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1280
};

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isWide: false,
    breakpoint: 'md'
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let breakpoint = 'xs';
      let isMobile = false;
      let isTablet = false;
      let isDesktop = false;
      let isWide = false;

      if (width >= BREAKPOINTS.xl) {
        breakpoint = 'xl';
        isWide = true;
      } else if (width >= BREAKPOINTS.lg) {
        breakpoint = 'lg';
        isDesktop = true;
      } else if (width >= BREAKPOINTS.md) {
        breakpoint = 'md';
        isTablet = true;
      } else if (width >= BREAKPOINTS.sm) {
        breakpoint = 'sm';
        isMobile = true;
      } else {
        breakpoint = 'xs';
        isMobile = true;
      }

      setScreenSize({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        isWide,
        breakpoint
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

export default useResponsive;
