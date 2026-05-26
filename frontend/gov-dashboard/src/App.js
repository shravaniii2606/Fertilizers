import { useMemo, useState } from 'react';
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

        <section className="detail-panel" aria-live="polite">
          <h3>{activeDetail.title}</h3>
          <p>{activeDetail.body}</p>
        </section>

        <footer className="footer-note">© 2025 Government of India. All rights reserved.</footer>
      </main>
    </div>
  );
}

export default App;
