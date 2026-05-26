import './App.css';
import { useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [aadharInput, setAadharInput] = useState('');
  const [farmerData, setFarmerData] = useState(null);

  // Hardcoded farmer data
  const farmerDatabase = {
    '123456789012': {
      name: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      aadhar: '123456789012',
      phone: '+91 98765 43210',
      address: 'Village Nandpur, Taluka Indore, District Indore, Madhya Pradesh',
      limit: 500,
      purchased: 280
    },
    '987654321098': {
      name: 'Priya Sharma',
      age: 38,
      gender: 'Female',
      aadhar: '987654321098',
      phone: '+91 87654 32109',
      address: 'Village Rajkheda, Taluka Ujjain, District Ujjain, Madhya Pradesh',
      limit: 400,
      purchased: 120
    },
    '456789123456': {
      name: 'Vikram Singh',
      age: 52,
      gender: 'Male',
      aadhar: '456789123456',
      phone: '+91 76543 21098',
      address: 'Village Depalpur, Taluka Mhow, District Indore, Madhya Pradesh',
      limit: 600,
      purchased: 450
    }
  };

  const searchFarmer = () => {
    if (farmerDatabase[aadharInput]) {
      setFarmerData(farmerDatabase[aadharInput]);
    } else {
      setFarmerData(null);
      alert('Farmer not found');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchFarmer();
    }
  };

  return (
    <div className="dealer-dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">F</div>
          <div>
            <h1>Dealer</h1>
            <p>Dashboard</p>
          </div>
        </div>

        <nav className="nav-menu">
          <button className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
          <button className={`nav-item ${currentPage === 'scan' ? 'active' : ''}`} onClick={() => setCurrentPage('scan')}>Scan batch</button>
          <button className={`nav-item ${currentPage === 'previous' ? 'active' : ''}`} onClick={() => setCurrentPage('previous')}>View previous records</button>
          <button className={`nav-item ${currentPage === 'sell' ? 'active' : ''}`} onClick={() => setCurrentPage('sell')}>Sell</button>
          <button className={`nav-item ${currentPage === 'history' ? 'active' : ''}`} onClick={() => setCurrentPage('history')}>History</button>
          <button className={`nav-item ${currentPage === 'alerts' ? 'active' : ''}`} onClick={() => setCurrentPage('alerts')}>Alerts</button>
        </nav>
      </aside>

      <main className="main-panel">
        {currentPage === 'dashboard' && (
          <>
            <header className="top-bar">
              <div>
                <p className="page-label">Dealer Dashboard</p>
                <h2>Fertilizer Distribution</h2>
                <p className="subtitle">
                  Track registered farmers, scanned batches, sales and alerts in one place.
                </p>
              </div>
              <div className="header-card">
                <span className="header-icon">⚡</span>
                <div>
                  <p>Live Sync</p>
                  <strong>Government data active</strong>
                </div>
              </div>
            </header>

            <section className="section stats-row">
              <div className="stat-card card-blue">
                <span className="stat-icon">👨‍🌾</span>
                <p>Total farmers registered</p>
                <strong>1,250</strong>
              </div>
              <div className="stat-card card-teal">
                <span className="stat-icon">📦</span>
                <p>Total scanned</p>
                <strong>482</strong>
              </div>
              <div className="stat-card card-green">
                <span className="stat-icon">🛒</span>
                <p>Total sold</p>
                <strong>348</strong>
              </div>
              <div className="stat-card card-orange">
                <span className="stat-icon">⚠️</span>
                <p>Active alerts</p>
                <strong>12</strong>
              </div>
            </section>
          </>
        )}

        {currentPage === 'sell' && (
          <>
            <header className="top-bar">
              <div>
                <p className="page-label">Dealer Dashboard</p>
                <h2>Process Sale</h2>
                <p className="subtitle">
                  Enter farmer Aadhar number to fetch details and process the sale.
                </p>
              </div>
            </header>

            <section className="sell-section">
              <div className="search-card">
                <h3>Search Farmer by Aadhar</h3>
                <div className="search-input-group">
                  <input
                    type="text"
                    placeholder="Enter 12-digit Aadhar number"
                    value={aadharInput}
                    onChange={(e) => setAadharInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    maxLength="12"
                  />
                  <button onClick={searchFarmer} className="search-button">Search</button>
                </div>
                <p className="search-hint">Sample Aadhar: 123456789012, 987654321098, 456789123456</p>
              </div>

              {farmerData && (
                <div className="farmer-details-card">
                  <h3>Farmer Details</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="label">Name</span>
                      <span className="value">{farmerData.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Age</span>
                      <span className="value">{farmerData.age}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Gender</span>
                      <span className="value">{farmerData.gender}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Aadhar</span>
                      <span className="value">{farmerData.aadhar}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Phone</span>
                      <span className="value">{farmerData.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Address</span>
                      <span className="value">{farmerData.address}</span>
                    </div>
                    <div className="detail-item limit-info">
                      <span className="label">Fertilizer Limit</span>
                      <span className="value">{farmerData.limit} kg</span>
                    </div>
                    <div className="detail-item purchased-info">
                      <span className="label">Already Purchased</span>
                      <span className="value">{farmerData.purchased} kg</span>
                    </div>
                    <div className="detail-item available-info">
                      <span className="label">Available to Buy</span>
                      <span className="value">{farmerData.limit - farmerData.purchased} kg</span>
                    </div>
                  </div>
                  <button className="proceed-button">Proceed to Scan QR Code</button>
                </div>
              )}
            </section>
          </>
        )}

        {currentPage === 'scan' && (
          <>
            <header className="top-bar">
              <div>
                <p className="page-label">Dealer Dashboard</p>
                <h2>Scan Batch</h2>
                <p className="subtitle">Scan the batch QR code to mark it as received.</p>
              </div>
            </header>
            <section className="empty-section">
              <p>Scan batch feature coming soon...</p>
            </section>
          </>
        )}

        {currentPage === 'previous' && (
          <>
            <header className="top-bar">
              <div>
                <p className="page-label">Dealer Dashboard</p>
                <h2>Previous Records</h2>
                <p className="subtitle">View all previously received batches.</p>
              </div>
            </header>
            <section className="empty-section">
              <p>Previous records feature coming soon...</p>
            </section>
          </>
        )}

        {currentPage === 'history' && (
          <>
            <header className="top-bar">
              <div>
                <p className="page-label">Dealer Dashboard</p>
                <h2>Sales History</h2>
                <p className="subtitle">View all sales records.</p>
              </div>
            </header>
            <section className="empty-section">
              <p>Sales history feature coming soon...</p>
            </section>
          </>
        )}

        {currentPage === 'alerts' && (
          <>
            <header className="top-bar">
              <div>
                <p className="page-label">Dealer Dashboard</p>
                <h2>Alerts</h2>
                <p className="subtitle">View all active alerts.</p>
              </div>
            </header>
            <section className="empty-section">
              <p>Alerts feature coming soon...</p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
