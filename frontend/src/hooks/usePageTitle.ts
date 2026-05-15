import { useEffect } from 'react';

export function usePageTitle(title: string | undefined) {
  useEffect(() => {
    document.title = title ? `${title} — AURCache` : 'AURCache';
    return () => {
      document.title = 'AURCache';
    };
  }, [title]);
}
