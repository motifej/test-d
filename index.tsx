/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Define the structure of an Asset
interface Asset {
  _id: string;
  name: string;
  status: 'UP' | 'DOWN' | 'MAINTENANCE';
  critical: boolean;
  safety: boolean;
  updatedAt: string;
  group: string;
  company: string;
}

// Mock data based on the provided example, with variations
const mockData: Asset[] = [
  {
    _id: "686cb3ed3a11b7e2f54ab80c",
    name: "KGI",
    status: "UP",
    critical: true,
    safety: false,
    updatedAt: "2025-09-07T13:53:05.371Z",
    group: "68bd8e27d1dcae4fa530e46a",
    company: "5d7b2b8c66fb7300172be5de",
  },
  {
    _id: "a1b2c3d4e5f6g7h8i9j0k1l2",
    name: "Primary Compressor",
    status: "DOWN",
    critical: true,
    safety: true,
    updatedAt: "2025-09-07T11:21:00.150Z",
    group: "68bd8e27d1dcae4fa530e46a",
    company: "5d7b2b8c66fb7300172be5de",
  },
  {
    _id: "z9y8x7w6v5u4t3s2r1q0p9o8",
    name: "Conveyor Belt 1A",
    status: "MAINTENANCE",
    critical: false,
    safety: true,
    updatedAt: "2025-09-06T08:00:15.987Z",
    group: "2a3b4c5d6e7f8g9h0i1j2k3l",
    company: "5d7b2b8c66fb7300172be5de",
  },
    {
    _id: "m1n2o3p4q5r6s7t8u9v0w1x2",
    name: "HVAC Unit 3",
    status: "UP",
    critical: false,
    safety: false,
    updatedAt: "2025-09-07T14:05:30.456Z",
    group: "2a3b4c5d6e7f8g9h0i1j2k3l",
    company: "3c4d5e6f7g8h9i0j1k2l3m4n",
  },
];

// Component for a single asset card
const AssetCard: React.FC<{ asset: Asset }> = ({ asset }) => {
  const statusClass = asset.status.toLowerCase();
  const lastUpdated = new Date(asset.updatedAt).toLocaleString();

  return (
    <div className="asset-card" aria-labelledby={`asset-name-${asset._id}`}>
      <header className="card-header">
        <h2 id={`asset-name-${asset._id}`}>{asset.name}</h2>
        <div className={`status ${statusClass}`}>
          <span className="status-dot" aria-hidden="true"></span>
          {asset.status}
        </div>
      </header>
      <div className="card-body">
        <p><strong>Group:</strong> {asset.group}</p>
        <p><strong>Company:</strong> {asset.company}</p>
        <p><strong>Last Updated:</strong> {lastUpdated}</p>
      </div>
      <footer className="card-footer">
        {asset.critical && <span className="badge critical">CRITICAL</span>}
        {asset.safety && <span className="badge safety">SAFETY</span>}
      </footer>
    </div>
  );
};

// Main App component
function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In the future, you can fetch real-time data here.
    const fetchData = async () => {
      try {
        setLoading(true);
        // TODO: Replace mockData with a fetch call to the real API
        // const response = await fetch('https://anymaint-backend-main.anymaint.com/api/tools?lastFetched=null');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch data');
        // }
        // const data = await response.json();
        // setAssets(data);
        
        // Using mock data for now
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setAssets(mockData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <header className="app-header">
        <h1>Asset Dashboard</h1>
      </header>
      <main>
        {loading && <p className="loading-message" role="status">Loading assets...</p>}
        {error && <p className="error-message" role="alert">Error: {error}</p>}
        {!loading && !error && (
          <div className="dashboard-grid">
            {assets.map((asset) => (
              <AssetCard key={asset._id} asset={asset} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);