import { useContext } from 'react';
import { SiteSettingsContext } from '../context/SiteSettingsProvider';

export const useSiteSettings = () => useContext(SiteSettingsContext);
