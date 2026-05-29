import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import mockFarmerRecords from './mockFarmerRecords';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'add', label: 'Add', icon: 'plus' },
  { id: 'records', label: 'View Previous', icon: 'document' },
  { id: 'analysis', label: 'AI Analysis', icon: 'brain' },
  { id: 'alerts', label: 'Alerts', icon: 'bell' },
  { id: 'farmers', label: 'Farmer Records', icon: 'user' },
  { id: 'scanner', label: 'Scanner', icon: 'scan' },
];

const statCards = [
  {
    id: 'distribution',
    label: 'Total Distribution',
    value: '12,540',
    unit: 'Bags',
    icon: 'bag',
    accent: 'green',
  },
  {
    id: 'dealers',
    label: 'Registered Dealers',
    value: '320',
    unit: 'Dealers',
    icon: 'store',
    accent: 'blue',
  },
  {
    id: 'registeredFarmers',
    label: 'Registered Farmers',
    value: '8,752',
    unit: 'Farmers',
    icon: 'farmer',
    accent: 'purple',
  },
  {
    id: 'activeAlerts',
    label: 'Active Alerts',
    value: '24',
    unit: 'Alerts',
    icon: 'warning',
    accent: 'orange',
  },
];

const detailContent = {
  dashboard: {
    title: 'Dashboard Overview',
    body: 'Track distribution, review recent activity, and jump into the main government workflows from one place.',
  },
  add: {
    title: 'Add Batch',
    body: 'Open the batch creation flow and generate bag IDs from a single centered add action.',
  },
  records: {
    title: 'Previous Distribution Records',
    body: 'Inspect prior submissions, filter records, and manage updates to existing distribution entries.',
  },
  analysis: {
    title: 'AI Distribution Analysis',
    body: 'Review anomaly detection, delivery trends, and high-risk clusters surfaced by the analysis engine.',
  },
  alerts: {
    title: 'Alerts Center',
    body: 'See suspicious activity, pending escalations, and operational warnings that require quick follow-up.',
  },
  farmers: {
    title: 'Farmer Records',
    body: 'Open farmer profiles, inspect transaction history, and validate fertilizer allocation across regions.',
  },
  scanner: {
    title: 'Scanner',
    body: 'Scan QR codes from the camera or from an uploaded image.',
  },
  distribution: {
    title: 'Total Distribution',
    body: 'This section highlights overall fertilizer movement in bags across the monitored reporting period.',
  },
  dealers: {
    title: 'Registered Dealers',
    body: 'Use this area to review the current count of onboarded dealers in the distribution network.',
  },
  registeredFarmers: {
    title: 'Registered Farmers',
    body: 'This section summarizes the active farmer base currently linked to recorded transactions.',
  },
  activeAlerts: {
    title: 'Active Alerts',
    body: 'Monitor unresolved warnings and suspicious events that still need verification or action.',
  },
  logout: {
    title: 'Logout',
    body: 'Use logout when you are done reviewing the dashboard or when another admin needs secure access.',
  },
};

const alertRows = [
  ['ALT9001', 'Duplicate purchase attempt', 'Sehore', 'High', 'Open'],
  ['ALT9002', 'Dealer stock mismatch', 'Vidisha', 'Medium', 'Reviewing'],
  ['ALT9003', 'Farmer limit exceeded', 'Raisen', 'High', 'Open'],
  ['ALT9004', 'Late transaction sync', 'Hoshangabad', 'Low', 'Resolved'],
];

const cropFertilizerRules = {
  wheat: ['urea', 'dap'],
  soybean: ['dap', 'npk 20:20:0:13'],
  paddy: ['urea', 'npk 20:20:0:13'],
};

function getFarmerTransactions(farmerId, lastTransaction, fertilizerType, totalReceived) {
  const transactionTimes = ['10:30 AM', '12:15 PM', '02:40 PM', '04:05 PM', '05:25 PM'];
  const transactionDates = [
    lastTransaction,
    '16 May 2025',
    '12 May 2025',
    '08 May 2025',
    '04 May 2025',
  ];
  const totalKg = Number.parseFloat(String(totalReceived).replace(/[^\d.]/g, '')) || 250;
  const kgPerTransaction = Math.max(1, Math.round(totalKg / 5));
  const farmerSuffix = farmerId.replace(/\D/g, '').slice(-5) || '10000';

  return transactionTimes.map((time, index) => [
    `${transactionDates[index]}, ${time}`,
    'Raj Singh Dealer',
    fertilizerType,
    `BATCH-${farmerSuffix}-${String(index + 1).padStart(2, '0')}`,
    `${farmerId}-BAG-${String(index + 1).padStart(3, '0')}`,
    `${kgPerTransaction} kg`,
  ]);
}

function getFarmerRiskProfile(record) {
  const triggeredRules = [];
  const alerts = [];
  let riskScore = 18;

  if (record.fertilizerPurchasedKg > record.monthlyLimitKg) {
    triggeredRules.push('Monthly fertilizer limit exceeded');
    alerts.push({
      rule: 'Limit exceeded',
      message: `${record.name} purchased ${record.fertilizerPurchasedKg} kg against a ${record.monthlyLimitKg} kg monthly limit.`,
      severity: 'High',
    });
    riskScore += 34;
  }

  if (record.fertilizerPurchasedKg > record.districtAverageKg * 1.8) {
    triggeredRules.push('Above district average purchase');
    alerts.push({
      rule: 'District average anomaly',
      message: `${record.name} is above the ${record.district} district average of ${record.districtAverageKg} kg.`,
      severity: 'Medium',
    });
    riskScore += 24;
  }

  if (record.dealersUsed > 2) {
    triggeredRules.push('Multiple dealer purchases');
    alerts.push({
      rule: 'Multiple dealers',
      message: `${record.name} purchased through ${record.dealersUsed} dealers in the review period.`,
      severity: 'Medium',
    });
    riskScore += 18;
  }

  if (record.purchases > 5) {
    triggeredRules.push('High purchase frequency');
    alerts.push({
      rule: 'Frequent purchases',
      message: `${record.name} made ${record.purchases} fertilizer purchases recently.`,
      severity: 'Medium',
    });
    riskScore += 12;
  }

  if (record.status === 'Inactive') {
    triggeredRules.push('Inactive farmer transaction activity');
    alerts.push({
      rule: 'Inactive status',
      message: `${record.name} has recent fertilizer activity while marked inactive.`,
      severity: 'High',
    });
    riskScore += 20;
  }

  const boundedRiskScore = Math.min(99, riskScore);
  const severity = boundedRiskScore >= 70 ? 'High' : boundedRiskScore >= 45 ? 'Medium' : 'Low';

  return {
    riskScore: boundedRiskScore,
    severity,
    suspicious: triggeredRules.length > 0,
    triggeredRules,
    alerts,
  };
}

function buildFarmerAnalysisRecords() {
  return mockFarmerRecords.map((record) => {
    const riskProfile = getFarmerRiskProfile(record);
    const aiInsight = riskProfile.suspicious
      ? `${record.name} needs review because ${riskProfile.triggeredRules.join(', ').toLowerCase()}.`
      : `${record.name} is within expected fertilizer distribution limits.`;

    return {
      ...record,
      ...riskProfile,
      aiInsight,
    };
  });
}

const farmerDetailsByAadhar = Object.fromEntries(
  buildFarmerAnalysisRecords().map((record) => [
    record.id,
    {
      landSize: record.landSize,
      cropType: record.cropType,
      monthlyLimit: `${record.monthlyLimitKg} kg`,
      riskLevel: record.severity,
      reason: record.triggeredRules.join(', ') || 'No risk rule triggered for this farmer.',
      fertilizersNeeded: cropFertilizerRules[record.cropType.toLowerCase()]?.join(', ') || record.fertilizerType,
    },
  ])
);

function Icon({ type }) {
  const common = { width: 34, height: 34, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

  switch (type) {
    case 'grid':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.2" />
          <rect x="14" y="3" width="7" height="7" rx="1.2" />
          <rect x="3" y="14" width="7" height="7" rx="1.2" />
          <rect x="14" y="14" width="7" height="7" rx="1.2" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case 'document':
      return (
        <svg {...common}>
          <path d="M7 3h7l5 5v13H7z" />
          <path d="M14 3v5h5" />
          <path d="M10 13h6" />
          <path d="M10 17h6" />
        </svg>
      );
    case 'brain':
      return (
        <svg {...common}>
          <path d="M9 5a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6 3 3 0 0 0 3 4" />
          <path d="M15 5a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6 3 3 0 0 1-3 4" />
          <path d="M9 9a3 3 0 0 1 3-3" />
          <path d="M15 9a3 3 0 0 0-3-3" />
          <path d="M12 6v12" />
          <path d="M9 13h3" />
          <path d="M12 13h3" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M15 17H5l1.5-2.5V10a5.5 5.5 0 1 1 11 0v4.5L19 17h-4" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </svg>
      );
    case 'user':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 19a7 7 0 0 1 14 0" />
        </svg>
      );
    case 'scan':
      return (
        <svg {...common}>
          <path d="M4 8V5a1 1 0 0 1 1-1h3" />
          <path d="M16 4h3a1 1 0 0 1 1 1v3" />
          <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
          <path d="M8 20H5a1 1 0 0 1-1-1v-3" />
          <path d="M7 12h10" />
          <path d="M9 9h6v6H9z" />
        </svg>
      );
    case 'bag':
      return (
        <svg {...common}>
          <path d="M8 5h8l-1 3H9z" />
          <path d="M7 8h10l2 4v5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-5z" />
          <path d="M12 11v5" />
          <path d="M9.5 13.5h5" />
        </svg>
      );
    case 'store':
      return (
        <svg {...common}>
          <path d="M4 10.5 5.5 5h13L20 10.5" />
          <path d="M5 10.5A2.5 2.5 0 0 0 10 11a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5-.5" />
          <path d="M6 11v8h12v-8" />
          <path d="M10 19v-4h4v4" />
        </svg>
      );
    case 'farmer':
      return (
        <svg {...common}>
          <path d="M12 5 7 8l5 3 5-3z" />
          <path d="M9 10v3a3 3 0 0 0 6 0v-3" />
          <path d="M6 19a6 6 0 0 1 12 0" />
          <path d="M4 8h3" />
          <path d="M17 8h3" />
        </svg>
      );
    case 'warning':
      return (
        <svg {...common}>
          <path d="M12 4 3.5 19h17z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...common}>
          <path d="M10 17 5 12l5-5" />
          <path d="M5 12h10" />
          <path d="M14 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
        </svg>
      );
    case 'chevron':
      return (
        <svg {...common}>
          <path d="m9 10 3 3 3-3" />
        </svg>
      );
    default:
      return null;
  }
}

function DashboardPage({ activeSection, setActiveSection }) {
  return (
    <>
      <section className="hero-copy">
        <h2>Dashboard</h2>
        <p>Welcome, Admin</p>
      </section>

      <section className="stats-panel">
        {statCards.map((stat) => (
          <button
            key={stat.id}
            type="button"
            className={`stat-card accent-${stat.accent} ${activeSection === stat.id ? 'is-selected' : ''}`}
            onClick={() => setActiveSection(stat.id)}
          >
            <span className="stat-card__icon-wrap">
              <span className="stat-card__icon">
                <Icon type={stat.icon} />
              </span>
            </span>
            <span className="stat-card__content">
              <span className="stat-card__label">{stat.label}</span>
              <span className="stat-card__value">{stat.value}</span>
              <span className="stat-card__unit">{stat.unit}</span>
            </span>
          </button>
        ))}
      </section>
    </>
  );
}

function PageTitle({ title, subtitle, action, onAction }) {
  return (
    <section className="page-title">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action && (
        <button type="button" className="outline-action" onClick={onAction}>
          {action}
        </button>
      )}
    </section>
  );
}

function MetricCard({ icon, label, value, unit, accent }) {
  return (
    <div className={`metric-card accent-${accent}`}>
      <span className="metric-card__icon">
        <Icon type={icon} />
      </span>
      <span>
        <span className="metric-card__label">{label}</span>
        <strong>{value}</strong>
        {unit && <small>{unit}</small>}
      </span>
    </div>
  );
}

function AddPage() {
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [generatedBagIds, setGeneratedBagIds] = useState([]);
  const [generatedQRCodes, setGeneratedQRCodes] = useState([]);
  const [generatedBatchQRCode, setGeneratedBatchQRCode] = useState('');
  const [saveState, setSaveState] = useState({ status: 'idle', message: '' });
  const [expiryError, setExpiryError] = useState('');
  const [batchForm, setBatchForm] = useState({
    batchNumber: '',
    numberOfBags: '',
    productName: '',
    productPrice: '',
    productExpiry: '',
    manufacturer: '',
    bagWeight: '',
  });
  const now = new Date();
  const todayIsoDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (saveState.status !== 'idle') {
      setSaveState({ status: 'idle', message: '' });
    }

    if (generatedQRCodes.length > 0) {
      setGeneratedQRCodes([]);
    }

    if (generatedBatchQRCode) {
      setGeneratedBatchQRCode('');
    }

    if (name === 'productExpiry') {
      if (value && value < todayIsoDate) {
        setExpiryError('Expiry date cannot be in the past.');
      } else {
        setExpiryError('');
      }
    }

    setBatchForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleGenerateBagIds = async () => {
    const bagCount = Number.parseInt(batchForm.numberOfBags, 10);
    const hasPastExpiry = batchForm.productExpiry && batchForm.productExpiry < todayIsoDate;

    if (hasPastExpiry) {
      setExpiryError('Expiry date cannot be in the past.');
      setSaveState({ status: 'error', message: 'Expiry date cannot be in the past.' });
      return;
    }

    if (!Number.isInteger(bagCount) || bagCount <= 0) {
      setGeneratedBagIds([]);
      setGeneratedQRCodes([]);
      setGeneratedBatchQRCode('');
      setSaveState({ status: 'error', message: 'Enter a valid number of bags before generating.' });
      return;
    }

    const batchPrefix = (batchForm.batchNumber || 'BATCH')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const safePrefix = batchPrefix || 'BATCH';
    const bagIds = Array.from(
      { length: bagCount },
      (_, index) => `${safePrefix}-BAG-${String(index + 1).padStart(3, '0')}`
    );

    setGeneratedBagIds(bagIds);

    try {
      setSaveState({ status: 'saving', message: 'Generating QR codes and saving batch...' });

      const qrResponse = await fetch(`${API_BASE_URL}/api/qrcodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchNumber: batchForm.batchNumber,
          productName: batchForm.productName,
          manufacturer: batchForm.manufacturer,
          bagWeight: batchForm.bagWeight,
          numberOfBags: bagCount,
          productPrice: batchForm.productPrice,
          productExpiry: batchForm.productExpiry,
          bagIds,
        }),
      });

      const qrResult = await readJsonResponse(qrResponse);

      if (!qrResponse.ok) {
        throw new Error(qrResult.error || 'Unable to generate QR codes.');
      }

      const qrCodes = qrResult.qrCodes || [];
      const batchQrCodeDataUrl = qrResult.batchQrCodeDataUrl || '';
      setGeneratedQRCodes(qrCodes);
      setGeneratedBatchQRCode(batchQrCodeDataUrl);

      const batchPayload = {
        batchNumber: batchForm.batchNumber,
        numberOfBags: bagCount,
        productName: batchForm.productName,
        productPrice: batchForm.productPrice,
        productExpiry: batchForm.productExpiry,
        manufacturer: batchForm.manufacturer,
        bagWeight: batchForm.bagWeight,
        bagIds,
        qrCodes,
        batchQrCode: batchQrCodeDataUrl,
      };

      const saveResponse = await fetch(`${API_BASE_URL}/api/batches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchPayload),
      });

      const saveResult = await readJsonResponse(saveResponse);

      if (!saveResponse.ok) {
        throw new Error(saveResult.error || 'Unable to save batch.');
      }
      setSaveState({ status: 'success', message: 'Batch saved to Supabase and QR codes generated successfully.' });
    } catch (error) {
      setSaveState({
        status: 'error',
        message: error.message || 'Bag IDs were generated, but saving or QR generation failed.',
      });
    }
  };

  if (!showBatchForm) {
    return (
      <section className="page-content add-launch-page">
        <PageTitle
          title="Add Batch"
          subtitle="Use the single add button below to open the batch creation page."
        />
        <div className="add-launch-panel">
          <button
            type="button"
            className="add-launch-button"
            onClick={() => setShowBatchForm(true)}
            aria-label="Open add batch page"
          >
            <span>+</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-content">
      <PageTitle
        title="Add Batch"
        subtitle="Fill batch details, then generate one bag ID for every bag entered."
        action="Back"
        onAction={() => setShowBatchForm(false)}
      />

      <div className="form-panel batch-form-panel">
        <label>
          Batch Number
          <input
            name="batchNumber"
            value={batchForm.batchNumber}
            onChange={handleInputChange}
            placeholder="Enter batch number"
          />
        </label>
        <label>
          No of Bags
          <input
            name="numberOfBags"
            type="number"
            min="1"
            value={batchForm.numberOfBags}
            onChange={handleInputChange}
            placeholder="Enter number of bags"
          />
        </label>
        <label>
          Product Name
          <input
            name="productName"
            value={batchForm.productName}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
        </label>
        <label>
          Product Price
          <input
            name="productPrice"
            type="number"
            min="0"
            value={batchForm.productPrice}
            onChange={handleInputChange}
            placeholder="Enter product price"
          />
        </label>
        <label>
          Product Expiry
          <input
            name="productExpiry"
            type="date"
            min={todayIsoDate}
            value={batchForm.productExpiry}
            onChange={handleInputChange}
          />
          {expiryError && <span className="form-hint form-hint--error">{expiryError}</span>}
        </label>
        <label>
          Manufacturer
          <input
            name="manufacturer"
            value={batchForm.manufacturer}
            onChange={handleInputChange}
            placeholder="Enter manufacturer name"
          />
        </label>
        <label className="full-width">
          Weight of Each Bag
          <input
            name="bagWeight"
            value={batchForm.bagWeight}
            onChange={handleInputChange}
            placeholder="Example: 50 kg"
          />
        </label>

        <div className="batch-form-actions full-width">
          <button type="button" className="outline-action" onClick={() => setShowBatchForm(false)}>
            Back
          </button>
          <button type="button" className="primary-action" onClick={handleGenerateBagIds}>
            Generate
          </button>
        </div>
      </div>

      {generatedBatchQRCode && (
        <section className="generated-panel qr-panel batch-qr-panel">
          <div className="generated-panel__header">
            <h3>Batch QR Code</h3>
            <p>This QR code contains all batch-level details (including total bags, price, and expiry) and can be scanned to view or process the entire batch.</p>
          </div>
          <div className="batch-qr-container" style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <article className="generated-bag-card qr-card batch-qr-card" style={{ maxWidth: '280px', width: '100%', textAlign: 'center', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <img src={generatedBatchQRCode} alt={`QR for batch ${batchForm.batchNumber}`} className="qr-image batch-qr-image" style={{ width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px' }} />
              <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '5px' }}>Batch: {batchForm.batchNumber}</strong>
              <small style={{ display: 'block', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '5px' }}>Includes: {batchForm.numberOfBags} Bags</small>
              {batchForm.productName && <span className="batch-qr-info" style={{ display: 'block', fontSize: '0.9rem', marginBottom: '15px' }}>Product: {batchForm.productName}</span>}
              <a href={generatedBatchQRCode} download={`BATCH-${batchForm.batchNumber}.png`} className="table-action qr-download" style={{ display: 'inline-block', width: '100%', padding: '10px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                Download Batch QR
              </a>
            </article>
          </div>
        </section>
      )}

      {generatedBagIds.length > 0 && (
        <section className="generated-panel">
          <div className="generated-panel__header">
            <h3>Generated Bag IDs</h3>
            <p>{generatedBagIds.length} bag IDs created for batch {batchForm.batchNumber || 'BATCH'}.</p>
          </div>
          <div className="generated-bag-grid">
            {generatedBagIds.map((bagId) => (
              <article key={bagId} className="generated-bag-card">
                <strong>{bagId}</strong>
                <span>{batchForm.productName || 'Product name pending'}</span>
                <small>{batchForm.bagWeight || 'Weight not set'}</small>
              </article>
            ))}
          </div>
        </section>
      )}

      {generatedQRCodes.length > 0 && (
        <section className="generated-panel qr-panel">
          <div className="generated-panel__header">
            <h3>Bag QR Codes</h3>
            <p>Each bag now has its own QR code linked to the generated bag ID.</p>
          </div>
          <div className="generated-bag-grid qr-grid">
            {generatedQRCodes.map((qrCode) => (
              <article key={qrCode.bagId} className="generated-bag-card qr-card">
                <img src={qrCode.qrCodeDataUrl} alt={`QR for ${qrCode.bagId}`} className="qr-image" />
                <strong>{qrCode.bagId}</strong>
                <small>Status: {qrCode.status || 'not scanned'}</small>
                <a href={qrCode.qrCodeDataUrl} download={`${qrCode.bagId}.png`} className="table-action qr-download">
                  Download QR
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      {saveState.status !== 'idle' && (
        <p className={`form-hint form-hint--${saveState.status}`}>{saveState.message}</p>
      )}

      {generatedBagIds.length === 0 && batchForm.numberOfBags && (
        <p className="form-hint">Enter a valid number of bags and click Generate to create bag IDs.</p>
      )}
    </section>
  );
}

function formatDate(value) {
  if (!value) {
    return 'Not set';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

async function readJsonResponse(response) {
  const responseText = await response.text();

  try {
    return responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    throw new Error(`Server returned ${response.status} ${response.statusText} instead of JSON.`);
  }
}

function PreviousPage() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [historyState, setHistoryState] = useState({
    status: 'loading',
    message: 'Loading saved batches...',
  });

  useEffect(() => {
    let ignore = false;

    async function loadBatches() {
      try {
        setHistoryState({ status: 'loading', message: 'Loading saved batches...' });

        const response = await fetch(`${API_BASE_URL}/api/batches`);
        const result = await readJsonResponse(response);

        if (!response.ok) {
          throw new Error(result.error || 'Unable to load batches.');
        }

        if (ignore) {
          return;
        }

        const loadedBatches = result.batches || [];
        setBatches(loadedBatches);
        setSelectedBatch(null);
        setHistoryState({
          status: 'success',
          message: loadedBatches.length ? '' : 'No batches have been created yet.',
        });
      } catch (error) {
        if (!ignore) {
          setHistoryState({
            status: 'error',
            message: error.message || 'Unable to load batches.',
          });
        }
      }
    }

    loadBatches();

    return () => {
      ignore = true;
    };
  }, []);

  const batchRows = batches.map((batch) => ([
    batch.batch_number,
    batch.product_name || 'Not set',
    `${batch.number_of_bags} bags`,
    batch.manufacturer || 'Not set',
    formatDate(batch.product_expiry),
    formatDate(batch.created_at),
    'View Details',
  ]));

  return (
    <section className="page-content">
      <PageTitle title="Previous Batches" subtitle="View every created batch and open full batch details." />
      {historyState.status !== 'success' && (
        <p className={`form-hint form-hint--${historyState.status === 'loading' ? 'saving' : 'error'}`}>
          {historyState.message}
        </p>
      )}
      {historyState.status === 'success' && batches.length > 0 && (
        <DataTable
          columns={['Batch Number', 'Product Name', 'No of Bags', 'Manufacturer', 'Expiry', 'Created On', 'Action']}
          rows={batchRows}
          onAction={(row) => {
            const selectedRowBatchNumber = row[0];
            setSelectedBatch(
              batches.find((batch) => batch.batch_number === selectedRowBatchNumber) || null
            );
          }}
        />
      )}
      {selectedBatch && (
        <div className="details-modal-backdrop" role="presentation" onClick={() => setSelectedBatch(null)}>
          <section
            className="details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="batch-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="details-modal__header">
              <div>
                <h3 id="batch-details-title">{selectedBatch.batch_number}</h3>
                <p>Batch details, bag IDs, and saved QR codes.</p>
              </div>
              <button type="button" className="outline-action" onClick={() => setSelectedBatch(null)}>Close</button>
            </div>

            <div className="batch-detail-grid">
              <div><span>Product Name</span><strong>{selectedBatch.product_name || 'Not set'}</strong></div>
              <div><span>No of Bags</span><strong>{selectedBatch.number_of_bags}</strong></div>
              <div><span>Product Price</span><strong>{selectedBatch.product_price || 'Not set'}</strong></div>
              <div><span>Product Expiry</span><strong>{formatDate(selectedBatch.product_expiry)}</strong></div>
              <div><span>Manufacturer</span><strong>{selectedBatch.manufacturer || 'Not set'}</strong></div>
              <div><span>Weight of Each Bag</span><strong>{selectedBatch.bag_weight || 'Not set'}</strong></div>
              <div><span>Created On</span><strong>{formatDate(selectedBatch.created_at)}</strong></div>
            </div>

            {selectedBatch.batch_qr_code && (
              <div className="batch-subsection">
                <h4>Batch QR Code</h4>
                <div className="batch-qr-container" style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
                  <article className="generated-bag-card qr-card batch-qr-card" style={{ maxWidth: '240px', width: '100%', textAlign: 'center', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <img src={selectedBatch.batch_qr_code} alt={`QR for batch ${selectedBatch.batch_number}`} className="qr-image batch-qr-image" style={{ width: '100%', height: 'auto', marginBottom: '10px', borderRadius: '6px' }} />
                    <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '5px' }}>Batch: {selectedBatch.batch_number}</strong>
                    <small style={{ display: 'block', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '10px' }}>Includes: {selectedBatch.number_of_bags} Bags</small>
                    <a href={selectedBatch.batch_qr_code} download={`BATCH-${selectedBatch.batch_number}.png`} className="table-action qr-download" style={{ display: 'inline-block', width: '100%', padding: '8px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      Download Batch QR
                    </a>
                  </article>
                </div>
              </div>
            )}

            <div className="batch-subsection">
              <h4>Bag IDs</h4>
              <div className="detail-chip-grid">
                {(selectedBatch.bag_ids || []).map((bagId) => {
                  const qrStatus = selectedBatch.qr_codes?.find((qrCode) => qrCode?.bagId === bagId)?.status;

                  return (
                    <span key={bagId} className="detail-chip">
                      {bagId}
                      <small>{qrStatus || 'not scanned'}</small>
                    </span>
                  );
                })}
              </div>
            </div>

            {!!selectedBatch.qr_codes?.length && (
              <div className="batch-subsection">
                <h4>Saved QR Codes</h4>
                <div className="generated-bag-grid qr-grid">
                  {selectedBatch.qr_codes.map((qrCode) => (
                    <article key={qrCode.bagId} className="generated-bag-card qr-card">
                      <img src={qrCode.qrCodeDataUrl} alt={`QR for ${qrCode.bagId}`} className="qr-image" />
                      <strong>{qrCode.bagId}</strong>
                      <small>Status: {qrCode.status || 'not scanned'}</small>
                      <a href={qrCode.qrCodeDataUrl} download={`${qrCode.bagId}.png`} className="table-action qr-download">
                        Download QR
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}

function AnalysisPage() {
  const [records, setRecords] = useState([]);
  const [state, setState] = useState({ status: 'loading', message: 'Loading farmer records...' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedSeverity, setSelectedSeverity] = useState('All Severity');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReview, setSelectedReview] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'answer', text: 'Ask about flagged farmers, triggered rules, high risk list, or specific farmer IDs.' },
  ]);

  useEffect(() => {
    setState({ status: 'loading', message: 'Loading farmer records...' });
    const timer = setTimeout(() => {
      const loaded = buildFarmerAnalysisRecords();
      setRecords(loaded);
      setState({ status: 'success', message: loaded.length ? '' : 'No farmer records found.' });
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const districts = useMemo(
    () => ['All Districts', ...Array.from(new Set(records.map((record) => record.district).filter(Boolean)))],
    [records]
  );

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return records.filter((record) => {
      const haystack = `${record.id} ${record.name} ${record.district} ${record.cropType} ${record.fertilizerType}`.toLowerCase();
      const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch);
      const matchesDistrict = selectedDistrict === 'All Districts' || record.district === selectedDistrict;
      const matchesSeverity = selectedSeverity === 'All Severity' || record.severity === selectedSeverity;
      return matchesSearch && matchesDistrict && matchesSeverity;
    });
  }, [records, searchTerm, selectedDistrict, selectedSeverity]);

  const suspiciousFarmers = useMemo(
    () => [...filteredRecords].filter((record) => record.suspicious).sort((a, b) => b.riskScore - a.riskScore),
    [filteredRecords]
  );
  const highRiskCount = filteredRecords.filter((record) => record.severity === 'High').length;
  const mediumRiskCount = filteredRecords.filter((record) => record.severity === 'Medium').length;
  const lowRiskCount = filteredRecords.filter((record) => record.severity === 'Low').length;
  const triggerCount = filteredRecords.reduce((sum, record) => sum + record.triggeredRules.length, 0);
  const suspiciousDealerCount = new Set(suspiciousFarmers.filter((record) => record.dealersUsed > 2).map((record) => `${record.district}-${record.dealersUsed}`)).size;
  const ruleTriggerRows = suspiciousFarmers.flatMap((record) => record.triggeredRules.map((rule) => [record.id, record.name, rule, record.severity]));
  const recentAlerts = suspiciousFarmers.slice(0, 5).flatMap((record) => record.alerts.map((alert) => [alert.rule, alert.message, record.district, alert.severity])).slice(0, 8);
  const aiInsightFeed = suspiciousFarmers.slice(0, 5).map((record) => `${record.aiInsight} Triggered: ${record.triggeredRules.join(', ')}.`);

  const tabs = [
    ['overview', 'Overview'],
    ['risk', 'Rule Engine Risk Detection'],
    ['behavior', 'Rule-Based Risk Triggers'],
    ['recommendations', 'Recommendations'],
    ['chatbot', 'AI Chatbot'],
  ];

  const handleChatSubmit = (event) => {
    event.preventDefault();
    const question = chatInput.trim();
    if (!question) return;

    const normalizedQuestion = question.toLowerCase();
    let answer = `Rule Engine analyzed ${filteredRecords.length} farmer records. AI explains these outputs only.`;
    const mentioned = records.find((record) => normalizedQuestion.includes(record.id.toLowerCase()) || normalizedQuestion.includes(record.name.toLowerCase()));

    if (mentioned) {
      answer = `${mentioned.name} (${mentioned.id}) has Rule Risk Score ${mentioned.riskScore} (${mentioned.severity}) due to: ${mentioned.triggeredRules.join(', ') || 'No rule triggered'}. AI Insight: ${mentioned.aiInsight}`;
    } else if (normalizedQuestion.includes('high risk')) {
      answer = `High risk farmers: ${suspiciousFarmers.filter((record) => record.severity === 'High').map((record) => `${record.name} (${record.id})`).join(', ') || 'None in current filters'}.`;
    } else if (normalizedQuestion.includes('multiple dealer')) {
      answer = `Farmers with multiple dealer purchases: ${suspiciousFarmers.filter((record) => record.triggeredRules.includes('Multiple dealer purchases')).map((record) => `${record.name} (${record.id})`).join(', ') || 'None'}.`;
    } else if (normalizedQuestion.includes('triggered rules')) {
      answer = `Triggered rule count is ${triggerCount}. Top triggered rules: ${ruleTriggerRows.slice(0, 5).map((row) => row[2]).join(', ') || 'None'}.`;
    }

    setChatMessages((current) => [...current, { type: 'question', text: question }, { type: 'answer', text: answer }]);
    setChatInput('');
  };

  return (
    <section className="page-content ai-page">
      <div className="ai-page-title">
        <PageTitle title="AI Analysis" subtitle="AI-powered insights and rule-based risk scoring from live Farmer Records." />
        <div className="ai-controls">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search farmer, Aadhaar, district, fertilizer..."
            aria-label="Search analysis records"
          />
          <select value={selectedDistrict} onChange={(event) => setSelectedDistrict(event.target.value)}>
            {districts.map((district) => <option key={district}>{district}</option>)}
          </select>
          <select value={selectedSeverity} onChange={(event) => setSelectedSeverity(event.target.value)}>
            <option>All Severity</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      {state.status !== 'success' && (
        <p className={`form-hint form-hint--${state.status === 'loading' ? 'saving' : 'error'}`}>{state.message}</p>
      )}

      {state.status === 'success' && (
        <>
          <div className="metric-grid ai-metric-grid">
            <MetricCard icon="document" label="Total Records Analyzed" value={filteredRecords.length} accent="blue" />
            <MetricCard icon="warning" label="High Risk Farmers" value={highRiskCount} accent="orange" />
            <MetricCard icon="store" label="Suspicious Dealers" value={suspiciousDealerCount} accent="purple" />
            <MetricCard icon="brain" label="Rule Trigger Count" value={triggerCount} accent="green" />
          </div>

          <div className="ai-tabs" aria-label="AI analysis sections">
            {tabs.map(([id, label]) => (
              <button key={id} type="button" className={activeTab === id ? 'is-active' : ''} onClick={() => setActiveTab(id)}>
                {label}
              </button>
            ))}
          </div>

          <div className="ai-layout">
            <div className="ai-main">
              {selectedReview && (
                <section className="farmer-detail-card">
                  <div className="farmer-detail-card__header">
                    <div>
                      <p>Selected Risk Review</p>
                      <h3>{selectedReview.name}</h3>
                    </div>
                    <span className={`risk-pill risk-${selectedReview.severity.toLowerCase()}`}>Rule Risk Score {selectedReview.riskScore}</span>
                  </div>
                  <div className="farmer-detail-grid">
                    <div><span>Farmer ID</span><strong>{selectedReview.id}</strong></div>
                    <div><span>Land Size</span><strong>{selectedReview.landSize}</strong></div>
                    <div><span>Crop</span><strong>{selectedReview.cropType}</strong></div>
                    <div><span>Fertilizer Purchased</span><strong>{selectedReview.fertilizerPurchasedKg} kg</strong></div>
                  </div>
                  <div className="farmer-detail-reason">
                    <span>Rule Engine Triggers</span>
                    <p>{selectedReview.triggeredRules.join(', ') || 'No trigger'}</p>
                  </div>
                </section>
              )}

              {['overview', 'risk'].includes(activeTab) && (
                <section className="ai-card">
                  <div className="ai-card__header">
                    <div>
                      <h3>Top Suspicious Farmers</h3>
                      <p>Generated by Rule Engine from Farmer Records</p>
                    </div>
                  </div>
                  <DataTable
                    columns={['Farmer ID', 'Farmer Name', 'District', 'Rule Risk Score', 'Trigger (Top)', 'Action']}
                    rows={suspiciousFarmers.map((record) => [record.id, record.name, record.district, record.riskScore, record.triggeredRules[0] || 'None', 'View Details'])}
                    onAction={(row) => {
                      const record = suspiciousFarmers.find((farmer) => farmer.id === row[0]);
                      setSelectedReview(record || null);
                    }}
                  />
                </section>
              )}

              {['overview', 'risk'].includes(activeTab) && (
                <section className="ai-card">
                  <div className="ai-card__header">
                    <div>
                      <h3>Rule Trigger Table</h3>
                      <p>Rule Engine trigger outputs by farmer</p>
                    </div>
                  </div>
                  <DataTable columns={['Farmer ID', 'Farmer Name', 'Rule Trigger', 'Severity']} rows={ruleTriggerRows} />
                </section>
              )}

              {activeTab === 'behavior' && (
                <section className="ai-card">
                  <div className="ai-card__header">
                    <div>
                      <h3>Recent Alerts</h3>
                      <p>Latest anomaly alerts from Rule Engine</p>
                    </div>
                  </div>
                  <DataTable columns={['Type', 'Description', 'District', 'Severity']} rows={recentAlerts} />
                </section>
              )}

              {activeTab === 'recommendations' && (
                <section className="ai-card">
                  <div className="ai-card__header">
                    <div>
                      <h3>AI Insight Feed</h3>
                      <p>AI explanations based on Rule Engine outputs</p>
                    </div>
                  </div>
                  <div className="ai-insight-list">
                    {aiInsightFeed.map((insight) => (
                      <article key={insight}><strong>AI Explanation</strong><span>{insight}</span></article>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="ai-side">
              {['overview', 'chatbot'].includes(activeTab) && (
                <section className="ai-card ai-chat">
                  <div className="ai-card__header">
                    <div>
                      <h3>AI Chatbot</h3>
                      <p>AI explains Rule Engine decisions. It does not make decisions.</p>
                    </div>
                  </div>
                  <div className="chat-messages">
                    {chatMessages.map((message, index) => (
                      <div key={`${message.type}-${index}`} className={`chat-bubble chat-bubble--${message.type}`}>
                        {message.text}
                      </div>
                    ))}
                  </div>
                  <form className="chat-form" onSubmit={handleChatSubmit}>
                    <input
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      placeholder="Ask about high-risk farmers, fertilizer patterns, inactive records..."
                      aria-label="Ask AI chatbot"
                    />
                    <button type="submit">Send</button>
                  </form>
                </section>
              )}
            </aside>
          </div>
        </>
      )}
    </section>
  );
}

function AlertsPage() {
  return (
    <section className="page-content">
      <PageTitle title="Alerts" subtitle="View alerts and suspicious activities requiring attention." />
      <div className="metric-grid">
        <MetricCard icon="warning" label="Active Alerts" value="24" accent="orange" />
        <MetricCard icon="bell" label="High Priority" value="6" accent="purple" />
        <MetricCard icon="document" label="In Review" value="11" accent="blue" />
        <MetricCard icon="grid" label="Resolved Today" value="7" accent="green" />
      </div>
      <DataTable
        columns={['Alert ID', 'Issue', 'District', 'Priority', 'Status']}
        rows={alertRows}
      />
    </section>
  );
}

function FarmerRecordsPage() {
  const [farmers, setFarmers] = useState([]);
  const [state, setState] = useState({ status: 'loading', message: 'Loading farmer records...' });
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [farmerMetrics, setFarmerMetrics] = useState({
    totalFarmers: 8752,
    activeFarmers: 7210,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadFarmerMetrics() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/farmer-records/metrics`);
        const result = await readJsonResponse(response);

        if (!response.ok) {
          throw new Error(result.error || 'Unable to load farmer metrics.');
        }

        if (isMounted) {
          setFarmerMetrics({
            totalFarmers: result.totalFarmers ?? 0,
            activeFarmers: result.activeFarmers ?? 0,
          });
        }
      } catch (error) {
        console.error('Unable to load farmer metrics:', error);
      }
    }

    loadFarmerMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setState({ status: 'loading', message: 'Loading farmer records...' });
    const timer = setTimeout(() => {
      const loadedFarmers = buildFarmerAnalysisRecords();
      setFarmers(loadedFarmers);
      setState({ status: 'success', message: loadedFarmers.length ? '' : 'No farmer records found.' });
    }, 120);
    return () => clearTimeout(timer);
  }, []);

  const districts = useMemo(
    () => ['All Districts', ...Array.from(new Set(farmers.map((farmer) => farmer.district).filter(Boolean)))],
    [farmers]
  );

  const filteredFarmers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return farmers.filter((record) => {
      const aadharNumber = record.id.replace(/\s/g, '');
      const searchableText = `${record.id} ${aadharNumber} ${record.name}`.toLowerCase();
      const compactSearchableText = searchableText.replace(/\s/g, '');
      const compactSearch = normalizedSearch.replace(/\s/g, '');
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch) || compactSearchableText.includes(compactSearch);
      const matchesDistrict = selectedDistrict === 'All Districts' || record.district === selectedDistrict;
      const matchesStatus = selectedStatus === 'All Status' || record.status === selectedStatus;

      return matchesSearch && matchesDistrict && matchesStatus;
    });
  }, [farmers, searchTerm, selectedDistrict, selectedStatus]);

  if (selectedFarmer) {
    return (
      <section className="page-content">
        <PageTitle
          title="Farmer Details"
          subtitle="Review the selected farmer record."
          action="Back"
          onAction={() => setSelectedFarmer(null)}
        />

        <section className="farmer-detail-card farmer-detail-card--page" aria-live="polite">
          <div className="farmer-detail-card__header">
            <div>
              <p>Farmer Details</p>
              <h3>{selectedFarmer.name}</h3>
            </div>
            <span className={`risk-pill risk-${selectedFarmer.riskLevel.toLowerCase()}`}>{selectedFarmer.riskLevel} Risk</span>
          </div>
          <div className="farmer-detail-grid">
            <div><span>Aadhar Card ID</span><strong>{selectedFarmer.aadharCardId}</strong></div>
            <div><span>District</span><strong>{selectedFarmer.district}</strong></div>
            <div><span>Last Transaction</span><strong>{selectedFarmer.lastTransaction}</strong></div>
            <div><span>Status</span><strong>{selectedFarmer.status}</strong></div>
            <div><span>Land Size</span><strong>{selectedFarmer.landSize}</strong></div>
            <div><span>Crop Type</span><strong>{selectedFarmer.cropType}</strong></div>
            <div><span>Fertilizer Type</span><strong>{selectedFarmer.fertilizerType}</strong></div>
            <div><span>Total Received</span><strong>{selectedFarmer.totalReceived}</strong></div>
            <div><span>Monthly Limit</span><strong>{selectedFarmer.monthlyLimit}</strong></div>
            <div><span>Fertilizers Needed</span><strong>{selectedFarmer.fertilizersNeeded}</strong></div>
          </div>
          <div className="farmer-detail-reason">
            <span>Reason</span>
            <p>{selectedFarmer.reason}</p>
          </div>
        </section>

        <section className="farmer-transactions-panel">
          <div className="farmer-transactions-panel__header">
            <h3>Transactions</h3>
            <p>Recent fertilizer transactions for this farmer.</p>
          </div>
          <DataTable
            columns={['Date Time', 'Dealer', 'Fertilizer Name', 'Batch Number', 'Bag ID', 'KG']}
            rows={selectedFarmer.transactions}
          />
        </section>
      </section>
    );
  }

  return (
    <section className="page-content">
      <PageTitle title="Farmer Records" subtitle="View and manage farmer details and transaction history." action="Export" />
      <div className="filter-row">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by farmer name or Aadhaar number..."
          aria-label="Search farmer records"
        />
        <select value={selectedDistrict} onChange={(event) => setSelectedDistrict(event.target.value)}>
          {districts.map((district) => <option key={district}>{district}</option>)}
        </select>
        <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button type="button" className="filter-button">Filters</button>
      </div>
      {state.status !== 'success' && (
        <p className={`form-hint form-hint--${state.status === 'loading' ? 'saving' : 'error'}`}>{state.message}</p>
      )}
      <div className="metric-grid">
        <MetricCard icon="user" label="Total Farmers" value={farmerMetrics.totalFarmers.toLocaleString('en-IN')} accent="teal" />
        <MetricCard icon="document" label="Total Transactions" value="18,540" accent="blue" />
        <MetricCard icon="warning" label="Active Farmers" value={farmerMetrics.activeFarmers.toLocaleString('en-IN')} accent="orange" />
      </div>
      <DataTable
        columns={['Aadhar Card ID', 'Farmer Name', 'District', 'Last Transaction', 'Fertilizer Received', 'Total Received', 'Status', 'Action']}
        rows={filteredFarmers.map((record) => [
          record.id,
          record.name,
          record.district,
          formatDate(record.lastPurchase),
          record.fertilizerType,
          `${record.fertilizerPurchasedKg} kg`,
          record.status,
          'View Details',
        ])}
        footer={`Showing ${filteredFarmers.length} records`}
        onAction={(row) => {
          const detail = {
            ...(farmerDetailsByAadhar[row[0]] || {
              landSize: '2 acres',
              cropType: 'Wheat',
              monthlyLimit: row[5],
              riskLevel: row[6] === 'Active' ? 'Low' : 'Medium',
              reason: 'Hardcoded demo details for this farmer record.',
            }),
            aadharCardId: row[0],
            name: row[1],
            district: row[2],
            lastTransaction: row[3],
            fertilizerType: row[4],
            totalReceived: row[5],
            status: row[6],
            fertilizersNeeded: 'Not set',
          };

          detail.transactions = getFarmerTransactions(row[0], row[3], row[4], row[5]);
          setSelectedFarmer(detail);
        }}
      />
    </section>
  );
}

function ScannerPage() {
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const scanRequestRef = useRef(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('Ready');
  const [scanResult, setScanResult] = useState('');
  const [scanUpdate, setScanUpdate] = useState(null);
  const [scanError, setScanError] = useState('');
  const isResultUrl = /^https?:\/\//i.test(scanResult);

  useEffect(() => {
    let isMounted = true;

    Html5Qrcode.getCameras()
      .then((availableCameras) => {
        if (!isMounted) return;

        setCameras(availableCameras);
        if (availableCameras.length > 0) {
          setSelectedCamera(availableCameras[0].id);
        }
      })
      .catch(() => {
        if (isMounted) {
          setScanStatus('Camera unavailable');
        }
      });

    return () => {
      isMounted = false;

      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop()
          .then(() => scannerRef.current?.clear())
          .catch(() => {});
      } else {
        scannerRef.current?.clear?.();
      }
    };
  }, []);

  async function getScanner() {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode('qr-reader');
    }

    return scannerRef.current;
  }

  async function stopScanner() {
    const scanner = scannerRef.current;
    if (!scanner) return;

    if (scanner.isScanning) {
      await scanner.stop();
    }

    scanner.clear();
    setIsScanning(false);
  }

  function getBagIdFromScan(decodedText) {
    try {
      const parsedValue = JSON.parse(decodedText);
      return parsedValue.bagId || parsedValue.bag_id || parsedValue.id || '';
    } catch {
      return decodedText;
    }
  }

  async function handleScanSuccess(decodedText) {
    if (scanRequestRef.current) return;

    scanRequestRef.current = true;
    setScanResult(decodedText);
    setScanUpdate(null);
    setScanError('');
    setScanStatus('Updating status...');

    try {
      if (scannerRef.current?.isScanning) {
        await stopScanner();
      }

      let isBatchQR = false;
      let batchNumber = '';
      try {
        const parsed = JSON.parse(decodedText);
        if (parsed && parsed.batchNumber && !parsed.bagId) {
          isBatchQR = true;
          batchNumber = parsed.batchNumber;
        }
      } catch (err) {
        // Not a JSON payload, treated as raw text (bag ID)
      }

      let response;
      if (isBatchQR) {
        setScanStatus('Updating batch status');
        response = await fetch(`${API_BASE_URL}/api/batches/scan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ batchNumber, scannedBy: 'gov' }),
        });
      } else {
        const bagId = getBagIdFromScan(decodedText);
        if (!bagId) {
          throw new Error('The scanned QR code does not contain a valid bag ID.');
        }

        setScanStatus('Updating bag status');
        response = await fetch(`${API_BASE_URL}/api/batches/scan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bagId, scannedBy: 'gov' }),
        });
      }

      const result = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(result.error || 'Unable to update status.');
      }

      if (isBatchQR) {
        setScanUpdate({
          bagId: `BATCH: ${result.batchNumber}`,
          message: result.message,
          batchNumber: result.batchNumber,
          status: result.status,
          changed: result.changed,
        });
        setScanStatus(result.changed ? 'Marked sent' : 'Batch already sent');
      } else {
        setScanUpdate(result);
        setScanStatus(result.changed ? 'Marked sent' : 'Bag already sent');
      }
    } catch (error) {
      setScanStatus('Scan update failed');
      setScanError(error.message || 'Unable to update status.');
    } finally {
      scanRequestRef.current = false;
    }
  }

  async function startScanner() {
    setScanError('');
    setScanStatus('Starting camera');

    try {
      const scanner = await getScanner();

      if (scanner.isScanning) {
        await stopScanner();
      }

      await scanner.start(
        selectedCamera || { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1,
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        }
      );

      setIsScanning(true);
      setScanStatus('Scanning');
    } catch (error) {
      setIsScanning(false);
      setScanStatus('Camera unavailable');
      setScanError(error?.message || 'Unable to start scanner.');
    }
  }

  async function scanFileWithNativeDetector(file) {
    if (!window.BarcodeDetector || !window.createImageBitmap) {
      throw new Error('Native QR detector is not available in this browser.');
    }

    const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
    const imageBitmap = await window.createImageBitmap(file);

    try {
      const codes = await detector.detect(imageBitmap);
      const qrCode = codes.find((code) => code.rawValue);

      if (!qrCode) {
        throw new Error('No QR code could be read from this image.');
      }

      return qrCode.rawValue;
    } finally {
      imageBitmap.close?.();
    }
  }
  async function resizeImage(file, maxDimension) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Canvas resize failed'));
          resolve(new File([blob], file.name, { type: file.type }));
        },
        file.type || 'image/jpeg'
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image failed to load for resizing'));
    };

    img.src = url;
  });
}
  async function handleFileScan(event) {
  const [file] = event.target.files || [];
  if (!file) return;

  setScanError('');
  setScanStatus('Reading image');

    try {
      const scanner = await getScanner();

      if (scanner.isScanning) {
        await stopScanner();
      }

      let decodedText = null;
      let scanErrorOccurred = null;

      // 1. Try scanning original file
      try {
        decodedText = await scanner.scanFile(file, true);
      } catch (err1) {
        scanErrorOccurred = err1;
      }

      // 2. Try scanning at 800px resize
      if (!decodedText) {
        try {
          const resized800 = await resizeImage(file, 800);
          decodedText = await scanner.scanFile(resized800, true);
        } catch (err2) {
          scanErrorOccurred = err2;
        }
      }

      // 3. Try scanning at 400px resize
      if (!decodedText) {
        try {
          const resized400 = await resizeImage(file, 400);
          decodedText = await scanner.scanFile(resized400, true);
        } catch (err3) {
          scanErrorOccurred = err3;
        }
      }

      // 4. Try scanning with native BarcodeDetector if supported
      if (!decodedText && window.BarcodeDetector && window.createImageBitmap) {
        try {
          decodedText = await scanFileWithNativeDetector(file);
        } catch (err4) {
          scanErrorOccurred = err4;
        }
      }

      if (!decodedText) {
        throw scanErrorOccurred || new Error('No QR code could be read from this image.');
      }

      await handleScanSuccess(decodedText);
  } catch (error) {
    setScanStatus('No QR found');
    setScanError(error?.message || 'No QR code could be read from this image.');
  } finally {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
}
  async function copyResult() {
    if (!scanResult) return;

    try {
      await navigator.clipboard.writeText(scanResult);
      setScanStatus('Copied');
    } catch {
      setScanError('Unable to copy result.');
    }
  }

  return (
    <section className="page-content">
      <PageTitle title="Scanner" subtitle="Scan QR codes from camera or image files." />

      <div className="scanner-layout">
        <section className="scanner-panel">
          <div className="scanner-toolbar">
            <select
              value={selectedCamera}
              onChange={(event) => setSelectedCamera(event.target.value)}
              disabled={isScanning || cameras.length === 0}
              aria-label="Camera"
            >
              {cameras.length === 0 && <option value="">Default camera</option>}
              {cameras.map((camera, index) => (
                <option key={camera.id} value={camera.id}>
                  {camera.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>

            <button type="button" className="primary-action" onClick={isScanning ? stopScanner : startScanner}>
              {isScanning ? 'Stop' : 'Start'}
            </button>

            <label className="upload-action">
              Upload
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileScan} />
            </label>
          </div>

          <div className={`scanner-reader ${isScanning ? 'is-active' : ''}`}>
            <div id="qr-reader" />
            {!isScanning && (
              <div className="scanner-placeholder">
                <Icon type="scan" />
              </div>
            )}
          </div>
        </section>

        <aside className="scanner-result-panel" aria-live="polite">
          <span className="scanner-status">{scanStatus}</span>
          <h3>Scan Result</h3>

          {scanResult ? (
            <>
              <pre>{scanResult}</pre>
              {scanUpdate && (
                <div className={`scanner-update ${scanUpdate.changed ? 'is-sent' : 'is-unchanged'}`}>
                  <strong>{scanUpdate.bagId}</strong>
                  <span>{scanUpdate.message}</span>
                  <small>Batch: {scanUpdate.batchNumber || 'Not found'} | Status: {scanUpdate.status}</small>
                </div>
              )}
              <div className="scanner-result-actions">
                <button type="button" className="outline-action" onClick={copyResult}>Copy</button>
                {isResultUrl && (
                  <a className="outline-action scanner-link" href={scanResult} target="_blank" rel="noreferrer">
                    Open
                  </a>
                )}
              </div>
            </>
          ) : (
            <p>No QR code scanned yet.</p>
          )}

          {scanError && <p className="form-hint form-hint--error">{scanError}</p>}
        </aside>
      </div>
    </section>
  );
}

function DataTable({ columns, rows, footer, onAction }) {
  return (
    <div className="table-panel">
      <table>
        <thead>
          <tr>
            {columns.map((column) => <th key={column}>{column}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.join('-')}>
              {row.map((cell, index) => {
                const isStatus = columns[index] === 'Status';
                const isAction = columns[index] === 'Action';

                return (
                  <td key={`${cell}-${index}`}>
                    {isStatus && <span className={`status-pill ${cell === 'Active' || cell === 'Verified' || cell === 'Resolved' ? 'is-active' : 'is-warning'}`}>{cell}</span>}
                    {isAction && (
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => onAction?.(row, rowIndex)}
                      >
                        {cell}
                      </button>
                    )}
                    {!isStatus && !isAction && cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {footer && (
        <div className="table-footer">
          <span>{footer}</span>
          <div className="pagination">
            <button type="button">&lt;</button>
            <button type="button" className="is-current">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <span>...</span>
            <button type="button">876</button>
            <button type="button">&gt;</button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeDetail = useMemo(
    () => detailContent[activeSection] || detailContent.dashboard,
    [activeSection]
  );

  return (
    <div className="dashboard-shell">
      <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark" aria-hidden="true">
            <div className="brand-mark__inner">GOI</div>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Government dashboard navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar-link ${activeSection === item.id ? 'is-active' : ''}`}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
            >
              <span className="sidebar-link__icon">
                <Icon type={item.icon} />
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          type="button"
          className={`sidebar-link sidebar-link--logout ${activeSection === 'logout' ? 'is-active' : ''}`}
          onClick={() => {
            setActiveSection('logout');
            setSidebarOpen(false);
          }}
        >
          <span className="sidebar-link__icon">
            <Icon type="logout" />
          </span>
          <span>Logout</span>
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <button type="button" className="menu-toggle" onClick={() => setSidebarOpen((current) => !current)} aria-label="Toggle navigation menu">
              <span />
              <span />
              <span />
            </button>
            <h1>Government Dashboard</h1>
            <p>Fertilizer Distribution Monitoring System</p>
          </div>

          <button
            type="button"
            className="profile-chip"
            onClick={() => setActiveSection('dashboard')}
            aria-label="Admin profile"
          >
            <span className="profile-chip__icon">
              <Icon type="user" />
            </span>
            <span>Admin</span>
            <span className="profile-chip__chevron">
              <Icon type="chevron" />
            </span>
          </button>
        </header>

        {activeSection === 'dashboard' && (
          <DashboardPage activeSection={activeSection} setActiveSection={setActiveSection} />
        )}
        {activeSection === 'add' && <AddPage />}
        {activeSection === 'records' && <PreviousPage />}
        {activeSection === 'analysis' && <AnalysisPage />}
        {activeSection === 'alerts' && <AlertsPage />}
        {activeSection === 'farmers' && <FarmerRecordsPage />}
        {activeSection === 'scanner' && <ScannerPage />}
        {!['dashboard', 'add', 'records', 'analysis', 'alerts', 'farmers', 'scanner'].includes(activeSection) && (
          <section className="detail-panel" aria-live="polite">
            <h3>{activeDetail.title}</h3>
            <p>{activeDetail.body}</p>
          </section>
        )}

        <footer className="footer-note">(c) 2025 Government of India. All rights reserved.</footer>
      </main>
    </div>
  );
}

export default App;


