import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ behavior = 'smooth' }) => { 
  const { pathname } = useLocation(); 

  useEffect(() => {
    window.scrollTo({ 
      top: 0,
      left: 0,
      behavior: behavior,
    });
  }, [pathname, behavior]); 

  return null; 
};

export default ScrollToTop;
