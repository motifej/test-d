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
  status: 'UP' | 'DOWN' | 'MAINTENANCE' | string | null; // More flexible for API data
  critical: boolean;
  safety: boolean;
  updatedAt: string;
  group: string;
  company: string;
}

// Component for a single asset card
const AssetCard: React.FC<{ asset: Asset }> = ({ asset }) => {
  const status = asset.status || 'UNKNOWN';
  const statusClass = status.toLowerCase();
  const lastUpdated = new Date(asset.updatedAt).toLocaleString();

  return (
    <div className="asset-card" aria-labelledby={`asset-name-${asset._id}`}>
      <header className="card-header">
        <h2 id={`asset-name-${asset._id}`}>{asset.name}</h2>
        <div className={`status ${statusClass}`}>
          <span className="status-dot" aria-hidden="true"></span>
          {status}
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
    // Fetch real-time data from the API
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://anymaint-backend-main.anymaint.com/api/tools?lastFetched=null', {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkN2IyYjhjNjZmYjczMDAxNzJiZTVkZiIsImlhdCI6MTc1NzMzODQ1MSwiZXhwIjoxNzU3Mzk2MDUxfQ.iBlFX2DJVw5LNtR13BvnNxluvMu7hw9qj2sUfc7PW8s'
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        // The API returns an object with a 'tools' property containing the asset array
        if (data && Array.isArray(data.tools)) {
          setAssets(data.tools);
        } else {
          throw new Error('Invalid data structure from API');
        }

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