import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://crecibv.com';

// Las paginas publicas indexables. El resto (login, admin) se marca noindex.
const INDEXABLE = ['/', '/donaciones'];

const Canonical = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const indexable = INDEXABLE.includes(path);

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', `${SITE_URL}${path === '/' ? '/' : path}`);

    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', indexable ? 'index, follow' : 'noindex, follow');
  }, [pathname]);

  return null;
};

export default Canonical;
