import { useContext } from 'react';
import { ScrapeContext } from './ScraperContext';

export default function Data() {
  const { scrapes, fetchScrapes } = useContext(ScrapeContext);
  return (
    <div>
      <button type="button" onClick={fetchScrapes}>
        Refresh Data
      </button>
      <Chart scrapes={scrapes.craigslist} />
      <h2>Craigslist:</h2>
      <h2>Craigslist:</h2>
      <Table scrapes={scrapes.craigslist} />
      <ul />
    </div>
  );
}
