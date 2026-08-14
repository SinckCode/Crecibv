import { createContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { DEFAULT_SITE_SETTINGS } from '../lib/defaultSiteSettings';
import { deepMerge } from '../lib/deepMerge';

export const SiteSettingsContext = createContext({
  settings: DEFAULT_SITE_SETTINGS,
  loading: true,
});

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'content', 'siteSettings'),
      (snap) => {
        if (snap.exists()) {
          setSettings(deepMerge(DEFAULT_SITE_SETTINGS, snap.data()));
        } else {
          setSettings(DEFAULT_SITE_SETTINGS);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading site settings:', error);
        setSettings(DEFAULT_SITE_SETTINGS);
        setLoading(false);
      },
    );

    return () => unsub();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
