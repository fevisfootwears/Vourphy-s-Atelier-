import { useState, useEffect } from 'react';
import { getBranding } from './firebase';

export function useBranding() {
  const [branding, setBranding] = useState<{ logoUrl: string; heroUrl: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBranding() {
      try {
        const data = await getBranding();
        if (data) {
          setBranding({
            logoUrl: data.logoUrl || '',
            heroUrl: data.heroUrl || ''
          });
        }
      } catch (error) {
        console.error("Failed to fetch site branding:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBranding();
  }, []);

  return { branding, loading };
}
