import { useEffect, useState } from 'react';
import { ScrapeProvider } from './ScraperContext';

function useScrapes() {
  const [scrapes, setScrapes] = useState({
    craigslist: []
  });

  async function fetchScrapes() {
    const res = await fetch(`http://localhost:3000`);
    const data = await res.json();
    setScrapes(data);
  }

  useEffect(() => {
    fetchScrapes();
  }, []);
  return { scrapes, fetchScrapes };
}

export default function Home({ children }) {
  const hookInfo = useScrapes();
  return (
    <ScrapeProvider value={hookInfo}>
      <div className="home">{children}</div>
    </ScrapeProvider>
  );
}
