import { useMemo, useState } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'add', label: 'Add', icon: 'plus' },
  { id: 'records', label: 'View Previous', icon: 'document' },
  { id: 'analysis', label: 'AI Analysis', icon: 'brain' },
  { id: 'alerts', label: 'Alerts', icon: 'bell' },
  { id: 'farmers', label: 'Farmer Records', icon: 'user' },
];

const actionCards = [
  {
    id: 'add',
    title: 'Add',
    description: 'Add new fertilizer distribution records and related details.',
    action: 'Add New',
    icon: 'plus',
    accent: 'green',
  },
  {
    id: 'records',
    title: 'View Previous',
    description: 'View and manage previously added distribution records.',
    action: 'View Records',
    icon: 'document',
    accent: 'blue',
  },
  {
    id: 'analysis',
    title: 'AI Analysis',
    description: 'Analyze distribution patterns and detect irregularities using AI.',
    action: 'View Analysis',
    icon: 'brain',
    accent: 'purple',
  },
  {
    id: 'alerts',
    title: 'Alerts',
    description: 'View alerts and suspicious activities requiring attention.',
    action: 'View Alerts',
    icon: 'bell',
    accent: 'orange',
  },
  {
    id: 'farmers',
    title: 'Farmer Records',
    description: 'View and manage farmer details and transaction history.',
    action: 'View Records',
    icon: 'user',
    accent: 'teal',
  },
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

const farmerRows = [
  ['FRM10001', 'Ramesh Kumar', 'Sehore', '20 May 2025', 'Urea', '500 kg', 'Active'],
  ['FRM10002', 'Sita Devi', 'Vidisha', '19 May 2025', 'DAP', '300 kg', 'Active'],
  ['FRM10003', 'Mohan Lal', 'Raisen', '18 May 2025', 'Urea', '500 kg', 'Active'],
  ['FRM10004', 'Shyam Singh', 'Hoshangabad', '17 May 2025', 'NPK 20:20:0:13', '250 kg', 'Inactive'],
  ['FRM10005', 'Kamla Bai', 'Sehore', '15 May 2025', 'DAP', '300 kg', 'Active'],
  ['FRM10006', 'Vijay Patel', 'Vidisha', '14 May 2025', 'Urea', '500 kg', 'Active'],
  ['FRM10007', 'Radha Shankar', 'Raisen', '13 May 2025', 'NPK 20:20:0:13', '250 kg', 'Inactive'],
  ['FRM10008', 'Gopal Das', 'Hoshangabad', '12 May 2025', 'Urea', '500 kg', 'Active'],
];

const previousRows = [
  ['DST10021', 'Sehore', 'Green Agro Center', 'Urea', '1,250 bags', '22 May 2025', 'Verified'],
  ['DST10022', 'Vidisha', 'Kisan Seva Store', 'DAP', '840 bags', '21 May 2025', 'Verified'],
  ['DST10023', 'Raisen', 'Madhya Fertilizer Depot', 'NPK', '610 bags', '20 May 2025', 'Pending'],
  ['DST10024', 'Hoshangabad', 'Krishi Supply Hub', 'Urea', '1,100 bags', '19 May 2025', 'Verified'],
];

const alertRows = [
  ['ALT9001', 'Duplicate purchase attempt', 'Sehore', 'High', 'Open'],
  ['ALT9002', 'Dealer stock mismatch', 'Vidisha', 'Medium', 'Reviewing'],
  ['ALT9003', 'Farmer limit exceeded', 'Raisen', 'High', 'Open'],
  ['ALT9004', 'Late transaction sync', 'Hoshangabad', 'Low', 'Resolved'],
];

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

      <section className="cards-grid" aria-label="Primary dashboard actions">
        {actionCards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`action-card accent-${card.accent} ${activeSection === card.id ? 'is-selected' : ''}`}
            onClick={() => setActiveSection(card.id)}
          >
            <span className="action-card__icon-wrap">
              <span className="action-card__icon">
                <Icon type={card.icon} />
              </span>
            </span>
            <span className="action-card__title">{card.title}</span>
            <span className="action-card__description">{card.description}</span>
            <span className="action-card__cta">{card.action}</span>
          </button>
        ))}
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
  const [saveState, setSaveState] = useState({ status: 'idle', message: '' });
  const [batchForm, setBatchForm] = useState({
    batchNumber: '',
    numberOfBags: '',
    productName: '',
    productPrice: '',
    productExpiry: '',
    manufacturer: '',
    bagWeight: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (saveState.status !== 'idle') {
      setSaveState({ status: 'idle', message: '' });
    }

    if (generatedQRCodes.length > 0) {
      setGeneratedQRCodes([]);
    }

    setBatchForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleGenerateBagIds = async () => {
    const bagCount = Number.parseInt(batchForm.numberOfBags, 10);

    if (!Number.isInteger(bagCount) || bagCount <= 0) {
      setGeneratedBagIds([]);
      setGeneratedQRCodes([]);
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
          bagIds,
        }),
      });

      const qrResult = await qrResponse.json();

      if (!qrResponse.ok) {
        throw new Error(qrResult.error || 'Unable to generate QR codes.');
      }

      const qrCodes = qrResult.qrCodes || [];
      setGeneratedQRCodes(qrCodes);

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
      };

      const saveResponse = await fetch(`${API_BASE_URL}/api/batches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchPayload),
      });

      const saveResult = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(saveResult.error || 'Unable to save batch.');
      }
      setSaveState({ status: 'success', message: 'Batch saved and QR codes generated successfully.' });
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
            value={batchForm.productExpiry}
            onChange={handleInputChange}
          />
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
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Unable to load batches.');
        }

        if (ignore) {
          return;
        }

        const loadedBatches = result.batches || [];
        setBatches(loadedBatches);
        setSelectedBatch(loadedBatches[0] || null);
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
        <div className="history-layout">
          <DataTable
            columns={['Batch Number', 'Product Name', 'No of Bags', 'Manufacturer', 'Expiry', 'Created On', 'Action']}
            rows={batchRows}
            onActionClick={(rowIndex) => setSelectedBatch(batches[rowIndex])}
          />
          {selectedBatch && (
            <section className="batch-detail-panel">
              <div className="batch-detail-panel__header">
                <h3>{selectedBatch.batch_number}</h3>
                <p>Batch details, bag IDs, and saved QR codes.</p>
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

              <div className="batch-subsection">
                <h4>Bag IDs</h4>
                <div className="detail-chip-grid">
                  {(selectedBatch.bag_ids || []).map((bagId) => (
                    <span key={bagId} className="detail-chip">{bagId}</span>
                  ))}
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
                        <a href={qrCode.qrCodeDataUrl} download={`${qrCode.bagId}.png`} className="table-action qr-download">
                          Download QR
                        </a>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </section>
  );
}

function AnalysisPage() {
  return (
    <section className="page-content">
      <PageTitle title="AI Analysis" subtitle="Analyze distribution patterns and detect irregularities using AI." />
      <div className="metric-grid">
        <MetricCard icon="brain" label="Risk Score" value="72" unit="/ 100" accent="purple" />
        <MetricCard icon="warning" label="Flagged Clusters" value="8" accent="orange" />
        <MetricCard icon="store" label="Dealer Variance" value="14%" accent="blue" />
        <MetricCard icon="bag" label="Demand Forecast" value="18,900" unit="bags" accent="green" />
      </div>
      <div className="insight-grid">
        <article className="insight-card">
          <h3>High Demand Districts</h3>
          <p>Sehore and Vidisha are projected to need additional Urea allocation in the next cycle.</p>
        </article>
        <article className="insight-card">
          <h3>Irregular Activity</h3>
          <p>Three dealers show purchase frequency above the expected range for their registered farmer count.</p>
        </article>
        <article className="insight-card">
          <h3>Stock Recommendation</h3>
          <p>Move 600 bags from low-demand blocks to active wheat and rice regions before month end.</p>
        </article>
      </div>
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
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const detailCardRef = useRef(null);

  const filteredFarmerRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return farmerRows.filter((row) => {
      const aadharNumber = row[0].replace(/\s/g, '');
      const searchableText = `${row[0]} ${aadharNumber} ${row[1]}`.toLowerCase();
      const compactSearchableText = searchableText.replace(/\s/g, '');
      const compactSearch = normalizedSearch.replace(/\s/g, '');
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch) || compactSearchableText.includes(compactSearch);
      const matchesDistrict = selectedDistrict === 'All Districts' || row[2] === selectedDistrict;
      const matchesStatus = selectedStatus === 'All Status' || row[6] === selectedStatus;

      return matchesSearch && matchesDistrict && matchesStatus;
    });
  }, [searchTerm, selectedDistrict, selectedStatus]);

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
          <option>All Districts</option>
          <option>Sehore</option>
        </select>
        <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button type="button" className="filter-button">Filters</button>
      </div>
      <div className="metric-grid">
        <MetricCard icon="user" label="Total Farmers" value="8,752" accent="teal" />
        <MetricCard icon="document" label="Total Transactions" value="18,540" accent="blue" />
        <MetricCard icon="warning" label="Active Farmers" value="7,210" accent="orange" />
      </div>
      {selectedFarmer && (
        <section className="farmer-detail-card" ref={detailCardRef} aria-live="polite">
          <div className="farmer-detail-card__header">
            <div>
              <p>Farmer Details</p>
              <h3>{selectedFarmer.name}</h3>
            </div>
            <span className={`risk-pill risk-${selectedFarmer.riskLevel.toLowerCase()}`}>{selectedFarmer.riskLevel} Risk</span>
          </div>
          <div className="farmer-detail-grid">
            <div><span>Land Size</span><strong>{selectedFarmer.landSize}</strong></div>
            <div><span>Crop Type</span><strong>{selectedFarmer.cropType}</strong></div>
            <div><span>Fertilizer Type</span><strong>{selectedFarmer.fertilizerType}</strong></div>
            <div><span>Monthly Limit</span><strong>{selectedFarmer.monthlyLimit}</strong></div>
          </div>
          <div className="farmer-detail-reason">
            <span>Reason</span>
            <p>{selectedFarmer.reason}</p>
          </div>
        </section>
      )}
      <DataTable
        columns={['Aadhar Card ID', 'Farmer Name', 'District', 'Last Transaction', 'Fertilizer Received', 'Total Received', 'Status', 'Action']}
        rows={filteredFarmerRows.map((row) => [...row, 'View Details'])}
        footer={`Showing ${filteredFarmerRows.length} of 20 records`}
        onAction={(row) => {
          const detail = farmerDetailsByAadhar[row[0]] || {
            name: row[1],
            landSize: '2 acres',
            cropType: 'Wheat',
            fertilizerType: row[4],
            monthlyLimit: row[5],
            riskLevel: row[6] === 'Active' ? 'Low' : 'Medium',
            reason: 'Hardcoded demo details for this farmer record.',
          };

          setSelectedFarmer(detail);
          setTimeout(() => {
            detailCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 0);
        }}
      />
    </section>
  );
}

function DataTable({ columns, rows, footer }) {
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
                    {isAction && <button type="button" className="table-action">{cell}</button>}
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

  const activeDetail = useMemo(
    () => detailContent[activeSection] || detailContent.dashboard,
    [activeSection]
  );

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
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
              onClick={() => setActiveSection(item.id)}
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
          onClick={() => setActiveSection('logout')}
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
        {!['dashboard', 'add', 'records', 'analysis', 'alerts', 'farmers'].includes(activeSection) && (
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
