import { useMemo, useRef, useState } from 'react';
import './App.css';

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
    title: 'Add Distribution Entry',
    body: 'Create a fresh fertilizer distribution record with location, stock, dealer, and farmer allocation details.',
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
  ['3421 5689 1047', 'Ramesh Patil', 'Sehore', '20 May 2025', 'Urea', '3 bags', 'Active'],
  ['7814 2365 9082', 'Suresh Yadav', 'Sehore', '19 May 2025', 'DAP', '8 bags', 'Active'],
  ['5490 8123 6675', 'Mahesh Sharma', 'Sehore', '18 May 2025', 'Potash', '12 bags', 'Active'],
  ['2367 9045 1188', 'Ravi Kumar', 'Sehore', '17 May 2025', 'Urea', '2 bags', 'Active'],
  ['8901 4567 2234', 'Ganesh More', 'Sehore', '15 May 2025', 'DAP', '15 bags', 'Inactive'],
  ['4128 7750 9361', 'Amit Verma', 'Sehore', '14 May 2025', 'Urea', '5 bags', 'Active'],
  ['6754 2198 4406', 'Prakash Jadhav', 'Sehore', '13 May 2025', 'Potash', '10 bags', 'Active'],
  ['9276 3104 5821', 'Nitin Pawar', 'Sehore', '12 May 2025', 'DAP', '14 bags', 'Active'],
  ['1845 7620 3397', 'Sunil Thakur', 'Sehore', '11 May 2025', 'Urea', '4 bags', 'Active'],
  ['7032 9156 8740', 'Kiran Deshmukh', 'Sehore', '10 May 2025', 'Potash', '16 bags', 'Inactive'],
  ['5186 4309 2257', 'Pooja Verma', 'Sehore', '09 May 2025', 'NPK 20:20:0:13', '250 kg', 'Active'],
  ['2690 7441 6835', 'Hariram Meena', 'Sehore', '08 May 2025', 'DAP', '300 kg', 'Inactive'],
  ['8305 1276 4908', 'Geeta Bai', 'Sehore', '07 May 2025', 'Urea', '500 kg', 'Active'],
  ['4572 6089 3314', 'Nand Kishore', 'Sehore', '06 May 2025', 'NPK 20:20:0:13', '250 kg', 'Active'],
  ['9168 3405 7723', 'Sunita Patel', 'Sehore', '05 May 2025', 'DAP', '300 kg', 'Active'],
  ['3017 8542 6096', 'Babulal Ahirwar', 'Sehore', '04 May 2025', 'Urea', '500 kg', 'Inactive'],
  ['6924 1187 5039', 'Meera Lodhi', 'Sehore', '03 May 2025', 'DAP', '300 kg', 'Active'],
  ['1458 9076 2641', 'Dinesh Parmar', 'Sehore', '02 May 2025', 'Urea', '500 kg', 'Active'],
  ['8740 2563 7195', 'Kavita Rajput', 'Sehore', '01 May 2025', 'NPK 20:20:0:13', '250 kg', 'Active'],
  ['5209 6814 3372', 'Omprakash Sahu', 'Sehore', '30 Apr 2025', 'DAP', '300 kg', 'Inactive'],
];

const farmerDetailsByAadhar = {
  '3421 5689 1047': {
    name: 'Ramesh Patil',
    landSize: '1 acre',
    cropType: 'Wheat',
    fertilizerType: 'Urea',
    monthlyLimit: '3 bags',
    riskLevel: 'Low',
    reason: 'Small land size and normal purchase activity.',
  },
  '7814 2365 9082': {
    name: 'Suresh Yadav',
    landSize: '3 acres',
    cropType: 'Rice',
    fertilizerType: 'DAP',
    monthlyLimit: '8 bags',
    riskLevel: 'Low',
    reason: 'Purchase quantity is within allowed monthly limit.',
  },
  '5490 8123 6675': {
    name: 'Mahesh Sharma',
    landSize: '5 acres',
    cropType: 'Cotton',
    fertilizerType: 'Potash',
    monthlyLimit: '12 bags',
    riskLevel: 'Medium',
    reason: 'Multiple fertilizer purchases within short duration.',
  },
  '2367 9045 1188': {
    name: 'Ravi Kumar',
    landSize: '0.5 acre',
    cropType: 'Vegetables',
    fertilizerType: 'Urea',
    monthlyLimit: '2 bags',
    riskLevel: 'Low',
    reason: 'Purchase within limit and normal activity.',
  },
  '8901 4567 2234': {
    name: 'Ganesh More',
    landSize: '7 acres',
    cropType: 'Sugarcane',
    fertilizerType: 'DAP',
    monthlyLimit: '15 bags',
    riskLevel: 'High',
    reason: 'Exceeded monthly fertilizer limit.',
  },
  '4128 7750 9361': {
    name: 'Amit Verma',
    landSize: '2 acres',
    cropType: 'Wheat',
    fertilizerType: 'Urea',
    monthlyLimit: '5 bags',
    riskLevel: 'Low',
    reason: 'Normal fertilizer purchase pattern.',
  },
  '6754 2198 4406': {
    name: 'Prakash Jadhav',
    landSize: '4 acres',
    cropType: 'Cotton',
    fertilizerType: 'Potash',
    monthlyLimit: '10 bags',
    riskLevel: 'Medium',
    reason: 'Frequent purchases detected.',
  },
  '9276 3104 5821': {
    name: 'Nitin Pawar',
    landSize: '6 acres',
    cropType: 'Rice',
    fertilizerType: 'DAP',
    monthlyLimit: '14 bags',
    riskLevel: 'Medium',
    reason: 'High purchase frequency this month.',
  },
  '1845 7620 3397': {
    name: 'Sunil Thakur',
    landSize: '1.5 acres',
    cropType: 'Vegetables',
    fertilizerType: 'Urea',
    monthlyLimit: '4 bags',
    riskLevel: 'Low',
    reason: 'Low purchase quantity and normal activity.',
  },
  '7032 9156 8740': {
    name: 'Kiran Deshmukh',
    landSize: '8 acres',
    cropType: 'Sugarcane',
    fertilizerType: 'Potash',
    monthlyLimit: '16 bags',
    riskLevel: 'High',
    reason: 'Very high fertilizer purchase frequency.',
  },
};

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

function PageTitle({ title, subtitle, action }) {
  return (
    <section className="page-title">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action && <button type="button" className="outline-action">{action}</button>}
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
  return (
    <section className="page-content">
      <PageTitle title="Add Distribution Record" subtitle="Create a new fertilizer distribution entry for district, dealer, crop and stock details." />
      <div className="form-panel">
        <label>District<input value="Sehore" readOnly /></label>
        <label>Dealer<input value="Green Agro Center" readOnly /></label>
        <label>Fertilizer Type<input value="Urea" readOnly /></label>
        <label>Quantity<input value="500 bags" readOnly /></label>
        <label>Batch ID<input value="BCH-2025-1028" readOnly /></label>
        <label>Distribution Date<input value="22 May 2025" readOnly /></label>
        <button type="button" className="primary-action">Submit Record</button>
      </div>
    </section>
  );
}

function PreviousPage() {
  return (
    <section className="page-content">
      <PageTitle title="Previous Distribution Records" subtitle="View and manage previously added distribution records." action="Export" />
      <div className="filter-row">
        <input value="Search by record, district or dealer..." readOnly />
        <select value="All Districts" readOnly><option>All Districts</option></select>
        <select value="All Fertilizers" readOnly><option>All Fertilizers</option></select>
      </div>
      <DataTable
        columns={['Record ID', 'District', 'Dealer', 'Fertilizer', 'Quantity', 'Date', 'Status']}
        rows={previousRows}
      />
    </section>
  );
}

function getFarmerDetail(row) {
  return farmerDetailsByAadhar[row[0]] || {
    name: row[1],
    landSize: '2 acres',
    cropType: 'Wheat',
    fertilizerType: row[4],
    monthlyLimit: row[5],
    riskLevel: row[6] === 'Active' ? 'Low' : 'Medium',
    reason: row[6] === 'Active' ? 'Normal purchase activity.' : 'Inactive record requires follow-up.',
  };
}

function getRiskScore(detail, row) {
  const limit = Number.parseFloat(detail.monthlyLimit) || Number.parseFloat(row[5]) || 0;
  const riskBase = { High: 78, Medium: 56, Low: 24 }[detail.riskLevel] || 35;
  const landSize = Number.parseFloat(detail.landSize) || 1;
  const fertilizerFactor = detail.fertilizerType === 'Potash' ? 7 : detail.fertilizerType === 'DAP' ? 5 : 2;
  const activityFactor = row[6] === 'Inactive' ? 8 : 0;

  return Math.min(96, Math.round(riskBase + limit * 0.9 + fertilizerFactor + activityFactor - landSize * 0.6));
}

function buildAnalysisRecords() {
  return farmerRows.map((row) => {
    const detail = getFarmerDetail(row);
    const riskScore = getRiskScore(detail, row);

    return {
      aadhar: row[0],
      name: row[1],
      district: row[2],
      lastTransaction: row[3],
      fertilizer: row[4],
      totalReceived: row[5],
      status: row[6],
      ...detail,
      riskScore,
    };
  });
}

function getChatResponse(question, records, suspiciousFarmers, highRisk, topFertilizer) {
  const normalizedQuestion = question.toLowerCase();
  const mentionedFarmer = records.find((record) => normalizedQuestion.includes(record.name.toLowerCase()));
  const mentionedAadhar = records.find((record) => normalizedQuestion.includes(record.aadhar.replace(/\s/g, '')));
  const farmer = mentionedFarmer || mentionedAadhar;

  if (farmer) {
    return `${farmer.name} has a risk score of ${farmer.riskScore}. Risk level is ${farmer.riskLevel}. Reason: ${farmer.reason} Land size is ${farmer.landSize}, crop is ${farmer.cropType}, fertilizer is ${farmer.fertilizerType}, and monthly limit is ${farmer.monthlyLimit}.`;
  }

  if (normalizedQuestion.includes('high risk') || normalizedQuestion.includes('risk')) {
    return `${highRisk.length} farmers are high risk. The highest risk farmer is ${suspiciousFarmers[0]?.name || 'not available'} with score ${suspiciousFarmers[0]?.riskScore || 0}. The main reasons are exceeded monthly limits, high purchase frequency, and inactive records.`;
  }

  if (normalizedQuestion.includes('fertilizer') || normalizedQuestion.includes('common')) {
    return `${topFertilizer?.[0] || 'Urea'} is currently the most common fertilizer in farmer records, appearing in ${topFertilizer?.[1] || 0} out of ${records.length} records.`;
  }

  if (normalizedQuestion.includes('inactive') || normalizedQuestion.includes('active')) {
    const inactiveCount = records.filter((record) => record.status === 'Inactive').length;
    return `${inactiveCount} farmer records are inactive. These records are treated as follow-up signals because inactive status can indicate pending verification or irregular purchase behavior.`;
  }

  if (normalizedQuestion.includes('recommend')) {
    return `Recommended action: review ${suspiciousFarmers.length} suspicious farmers first, prioritize ${highRisk.length} high-risk cases, and verify fertilizer purchases where monthly limits are exceeded.`;
  }

  return `I analyzed ${records.length} farmer records. Ask about a farmer name, Aadhaar number, high-risk farmers, fertilizer patterns, inactive records, or recommendations.`;
}

function AnalysisPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisSearch, setAnalysisSearch] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('20 May 2025 - 27 May 2025');
  const [selectedDistrict, setSelectedDistrict] = useState('Sehore');
  const [selectedReview, setSelectedReview] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'answer',
      text: 'Ask me about a farmer name, Aadhaar number, high-risk farmers, fertilizer patterns, inactive records, or recommendations.',
    },
  ]);
  const analysisRecords = useMemo(() => buildAnalysisRecords(), []);
  const filteredAnalysisRecords = useMemo(() => {
    const normalizedSearch = analysisSearch.trim().toLowerCase();

    return analysisRecords.filter((record) => {
      const compactAadhar = record.aadhar.replace(/\s/g, '');
      const searchableText = `${record.aadhar} ${compactAadhar} ${record.name} ${record.fertilizer} ${record.riskLevel}`.toLowerCase();
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch) || searchableText.replace(/\s/g, '').includes(normalizedSearch.replace(/\s/g, ''));
      const matchesDistrict = selectedDistrict === 'All Districts' || record.district === selectedDistrict;

      return matchesSearch && matchesDistrict;
    });
  }, [analysisRecords, analysisSearch, selectedDistrict]);
  const suspiciousFarmers = filteredAnalysisRecords
    .filter((record) => record.riskScore >= 55)
    .sort((a, b) => b.riskScore - a.riskScore);
  const highRisk = filteredAnalysisRecords.filter((record) => record.riskLevel === 'High');
  const mediumRisk = filteredAnalysisRecords.filter((record) => record.riskLevel === 'Medium');
  const lowRisk = filteredAnalysisRecords.filter((record) => record.riskLevel === 'Low');
  const inactiveFarmers = filteredAnalysisRecords.filter((record) => record.status === 'Inactive');
  const fertilizerCounts = filteredAnalysisRecords.reduce((counts, record) => {
    counts[record.fertilizer] = (counts[record.fertilizer] || 0) + 1;
    return counts;
  }, {});
  const topFertilizer = Object.entries(fertilizerCounts).sort((a, b) => b[1] - a[1])[0];
  const aiConfidence = filteredAnalysisRecords.length ? Math.round(((filteredAnalysisRecords.length - inactiveFarmers.length) / filteredAnalysisRecords.length) * 100) : 0;
  const riskRows = [
    ['High Risk', highRisk.length, `${filteredAnalysisRecords.length ? Math.round((highRisk.length / filteredAnalysisRecords.length) * 100) : 0}%`, 'High purchase frequency or exceeded limit'],
    ['Medium Risk', mediumRisk.length, `${filteredAnalysisRecords.length ? Math.round((mediumRisk.length / filteredAnalysisRecords.length) * 100) : 0}%`, 'Frequent purchase pattern needs review'],
    ['Low Risk', lowRisk.length, `${filteredAnalysisRecords.length ? Math.round((lowRisk.length / filteredAnalysisRecords.length) * 100) : 0}%`, 'Normal land-size and purchase behavior'],
  ];
  const anomalyRows = suspiciousFarmers.slice(0, 5).map((record) => [
    record.riskLevel === 'High' ? 'Limit Anomaly' : 'Pattern Anomaly',
    record.reason,
    record.name,
    record.district,
    record.lastTransaction,
    record.riskLevel,
  ]);
  const tabs = [
    ['overview', 'Overview'],
    ['risk', 'Risk & Anomaly Detection'],
    ['behavior', 'Behavior Patterns'],
    ['recommendations', 'Recommendations'],
    ['chatbot', 'AI Chatbot'],
  ];

  const handleChatSubmit = (event) => {
    event.preventDefault();
    const trimmedMessage = chatInput.trim();

    if (!trimmedMessage) {
      return;
    }

    setChatMessages((messages) => [
      ...messages,
      { type: 'question', text: trimmedMessage },
      { type: 'answer', text: getChatResponse(trimmedMessage, filteredAnalysisRecords, suspiciousFarmers, highRisk, topFertilizer) },
    ]);
    setChatInput('');
  };

  return (
    <section className="page-content ai-page">
      <div className="ai-page-title">
        <PageTitle title="AI Analysis" subtitle="Rule-based insights calculated from Farmer Records." />
        <div className="ai-controls">
          <input
            type="search"
            value={analysisSearch}
            onChange={(event) => setAnalysisSearch(event.target.value)}
            placeholder="Search farmer, Aadhaar or risk..."
            aria-label="Search AI analysis records"
          />
          <select value={selectedDateRange} onChange={(event) => setSelectedDateRange(event.target.value)}>
            <option>20 May 2025 - 27 May 2025</option>
            <option>All Dates</option>
          </select>
          <select value={selectedDistrict} onChange={(event) => setSelectedDistrict(event.target.value)}>
            <option>All Districts</option>
            <option>Sehore</option>
          </select>
        </div>
      </div>

      <div className="metric-grid ai-metric-grid">
        <MetricCard icon="document" label="Records Analyzed" value={filteredAnalysisRecords.length} accent="blue" />
        <MetricCard icon="warning" label="High Risk Farmers" value={highRisk.length} accent="orange" />
        <MetricCard icon="user" label="Suspicious Farmers" value={suspiciousFarmers.length} accent="purple" />
        <MetricCard icon="brain" label="AI Confidence" value={`${aiConfidence}%`} accent="green" />
      </div>

      <div className="ai-tabs" aria-label="AI analysis sections">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={activeTab === id ? 'is-active' : ''}
            onClick={() => setActiveTab(id)}
          >
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
                <span className={`risk-pill risk-${selectedReview.riskLevel.toLowerCase()}`}>{selectedReview.riskScore} Score</span>
              </div>
              <div className="farmer-detail-grid">
                <div><span>Aadhaar</span><strong>{selectedReview.aadhar}</strong></div>
                <div><span>Land Size</span><strong>{selectedReview.landSize}</strong></div>
                <div><span>Crop</span><strong>{selectedReview.cropType}</strong></div>
                <div><span>Monthly Limit</span><strong>{selectedReview.monthlyLimit}</strong></div>
              </div>
              <div className="farmer-detail-reason">
                <span>Risk Reason</span>
                <p>{selectedReview.reason}</p>
              </div>
            </section>
          )}

          {['overview', 'risk'].includes(activeTab) && (
            <section className="ai-card">
            <div className="ai-card__header">
              <div>
                <h3>Top Suspicious Farmers</h3>
                <p>Ranked by risk score from farmer records</p>
              </div>
            </div>
            <DataTable
              compact
              columns={['Aadhar', 'Farmer Name', 'Risk Score', 'Reason', 'Action']}
              rows={suspiciousFarmers.slice(0, 6).map((record) => [
                record.aadhar,
                record.name,
                record.riskScore,
                record.reason,
                'Review',
              ])}
              onAction={(row) => {
                const record = suspiciousFarmers.find((farmer) => farmer.aadhar === row[0]);
                setSelectedReview(record);
              }}
            />
          </section>
          )}

          {['overview', 'risk'].includes(activeTab) && (
            <section className="ai-card">
            <div className="ai-card__header">
              <div>
                <h3>Recent Anomalies Detected</h3>
                <p>Built from high and medium farmer risk records</p>
              </div>
            </div>
            <DataTable
              compact
              columns={['Type', 'Description', 'Farmer', 'District', 'Detected On', 'Severity']}
              rows={anomalyRows}
            />
          </section>
          )}

          {activeTab === 'behavior' && (
            <section className="ai-card">
              <div className="ai-card__header">
                <div>
                  <h3>Behavior Patterns</h3>
                  <p>Calculated from crop, fertilizer and risk behavior in Farmer Records</p>
                </div>
              </div>
              <div className="ai-insight-list">
                <article><strong>{topFertilizer?.[0] || 'No fertilizer'} has the highest usage.</strong><span>This indicates where stock planning should focus first.</span></article>
                <article><strong>{inactiveFarmers.length} farmers are inactive.</strong><span>Inactive farmers are weighted higher because they may need verification.</span></article>
                <article><strong>{mediumRisk.length + highRisk.length} records have medium or high risk.</strong><span>These are the records that need manual review before approval.</span></article>
              </div>
            </section>
          )}

          {activeTab === 'recommendations' && (
            <section className="ai-card">
              <div className="ai-card__header">
                <div>
                  <h3>Recommendations</h3>
                  <p>Generated from the current farmer analysis</p>
                </div>
              </div>
              <div className="ai-insight-list">
                <article><strong>Review high-risk farmers first.</strong><span>Start with {suspiciousFarmers[0]?.name || 'the top suspicious farmer'} because the score is highest.</span></article>
                <article><strong>Verify monthly limits.</strong><span>High-risk reasons include exceeded limits and very high purchase frequency.</span></article>
                <article><strong>Prioritize inactive records.</strong><span>{inactiveFarmers.length} inactive records should be checked before the next distribution cycle.</span></article>
              </div>
            </section>
          )}
        </div>

        <aside className="ai-side">
          {['overview', 'behavior', 'recommendations'].includes(activeTab) && (
            <section className="ai-card">
            <div className="ai-card__header">
              <div>
                <h3>AI Insights</h3>
                <p>Patterns detected from the current farmer records</p>
              </div>
            </div>
            <div className="ai-insight-list">
              <article>
                <strong>{topFertilizer?.[0] || 'Urea'} is the most common fertilizer.</strong>
                <span>{topFertilizer?.[1] || 0} of {filteredAnalysisRecords.length} records use it.</span>
              </article>
              <article>
                <strong>{suspiciousFarmers.length} farmers need review.</strong>
                <span>Risk score is 55 or higher based on limit, fertilizer type, status and risk reason.</span>
              </article>
              <article>
                <strong>{inactiveFarmers.length} inactive records found.</strong>
                <span>Inactive records are treated as follow-up signals in the rule engine.</span>
              </article>
              <article>
                <strong>{highRisk.length} farmers are high risk.</strong>
                <span>Most high-risk cases are linked to exceeded limits or very high frequency.</span>
              </article>
            </div>
          </section>
          )}

          {['overview', 'risk'].includes(activeTab) && (
            <section className="ai-card">
            <div className="ai-card__header">
              <div>
                <h3>Risk Score Distribution</h3>
                <p>Based on farmer detail risk levels</p>
              </div>
            </div>
            <div className="risk-bars">
              {riskRows.map(([label, count, percent, note]) => (
                <div className="risk-bar-row" key={label}>
                  <div>
                    <strong>{label}</strong>
                    <span>{note}</span>
                  </div>
                  <div className="risk-bar-track">
                    <span style={{ width: percent }} />
                  </div>
                  <b>{count} ({percent})</b>
                </div>
              ))}
            </div>
          </section>
          )}

          {['overview', 'chatbot'].includes(activeTab) && (
            <section className="ai-card ai-chat">
            <div className="ai-card__header">
              <div>
                <h3>AI Assistant</h3>
                <p>Generated from farmer record analysis</p>
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
                placeholder="Ask about farmers, risk, fertilizer..."
                aria-label="Ask AI assistant"
              />
              <button type="submit">Send</button>
            </form>
          </section>
          )}
        </aside>
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
          {rows.map((row) => (
            <tr key={row.join('-')}>
              {row.map((cell, index) => {
                const isStatus = columns[index] === 'Status';
                const isAction = columns[index] === 'Action';

                return (
                  <td key={`${cell}-${index}`}>
                    {isStatus && <span className={`status-pill ${cell === 'Active' || cell === 'Verified' || cell === 'Resolved' ? 'is-active' : 'is-warning'}`}>{cell}</span>}
                    {isAction && <button type="button" className="table-action" onClick={() => onAction?.(row)}>{cell}</button>}
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
            <button type="button">‹</button>
            <button type="button" className="is-current">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <span>...</span>
            <button type="button">876</button>
            <button type="button">›</button>
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

        <footer className="footer-note">© 2025 Government of India. All rights reserved.</footer>
      </main>
    </div>
  );
}

export default App;
