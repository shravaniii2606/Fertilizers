import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const translations = {
  en: {
    brandTitle: 'Dealer',
    brandLabel: 'Dashboard',
    sidebarDashboard: 'Dashboard',
    sidebarScan: 'Scan batch',
    sidebarPrevious: 'View previous records',
    sidebarSell: 'Sell',
    sidebarHistory: 'History',
    sidebarAlerts: 'Alerts',
    sidebarSettings: 'Settings',
    pageLabel: 'Dealer Dashboard',
    fertilizerDistribution: 'Fertilizer Distribution',
    trackInfo: 'Track registered farmers, scanned batches, sales and alerts in one place.',
    liveSync: 'Live Sync',
    governmentDataActive: 'Government data active',
    totalFarmersRegistered: 'Total farmers registered',
    totalScanned: 'Total scanned',
    totalSold: 'Total sold',
    activeAlerts: 'Active alerts',
    view: 'View',
    processSale: 'Process Sale',
    searchFarmerByAadhar: 'Search Farmer by Aadhar',
    enterAadharPlaceholder: 'Enter 12-digit Aadhar number',
    search: 'Search',
    sampleAadhar: 'Sample Aadhar: 123456789012, 987654321098, 456789123456',
    farmerDetails: 'Farmer Details',
    name: 'Name',
    age: 'Age',
    gender: 'Gender',
    aadhar: 'Aadhar',
    phone: 'Phone',
    address: 'Address',
    fertilizerLimit: 'Fertilizer Limit',
    alreadyPurchased: 'Already Purchased',
    availableToBuy: 'Available to Buy',
    proceedToScan: 'Proceed to Scan QR Code',
    scanBatch: 'Scan Batch',
    scanBatchSubtitle: 'Scan the batch QR code to mark it as received.',
    previousRecords: 'Previous Records',
    previousRecordsSubtitle: 'View all previously received batches.',
    salesHistory: 'Sales History',
    salesHistorySubtitle: 'View all sales records.',
    alertsTitle: 'Alerts',
    alertsSubtitle: 'View all active alerts.',
    featureComingSoon: 'Feature coming soon...',
    settingsTitle: 'Settings',
    selectLanguage: 'Select language',
    languageNames: {
      en: 'English',
      hi: 'हिन्दी',
      mr: 'मराठी'
    },
    settingsLanguageTab: 'Language',
    settingsDealerDetailsTab: 'Dealer Details',
    dealerInfoTitle: 'Dealer Information',
    dealerName: 'Dealer name',
    dealerPhone: 'Dealer phone',
    dealerEmail: 'Dealer email',
    dealerAddress: 'Dealer address',
    dealerAadhar: 'Dealer Aadhar',
    editDetails: 'Edit details',
    saveDetails: 'Save',
    cancel: 'Cancel',
    farmerNotFound: 'Farmer not found'
  },
  hi: {
    brandTitle: 'डीलर',
    brandLabel: 'डैशबोर्ड',
    sidebarDashboard: 'डैशबोर्ड',
    sidebarScan: 'बैच स्कैन करें',
    sidebarPrevious: 'पिछले रिकॉर्ड देखें',
    sidebarSell: 'बेचे',
    sidebarHistory: 'इतिहास',
    sidebarAlerts: 'अलर्ट',
    sidebarSettings: 'सेटिंग्स',
    pageLabel: 'डीलर डैशबोर्ड',
    fertilizerDistribution: 'उर्वरक वितरण',
    trackInfo: 'पंजीकृत किसानों, स्कैन किए गए बैच, बिक्री और अलर्ट को एक बार में ट्रैक करें।',
    liveSync: 'लाइव सिंक',
    governmentDataActive: 'सरकारी डेटा सक्रिय',
    totalFarmersRegistered: 'कुल पंजीकृत किसान',
    totalScanned: 'कुल स्कैन',
    totalSold: 'कुल बिक्री',
    activeAlerts: 'सक्रिय अलर्ट',
    view: 'देखें',
    processSale: 'बिक्री प्रक्रिया',
    searchFarmerByAadhar: 'किसान आधार से खोजें',
    enterAadharPlaceholder: '12 अंकों का आधार नंबर दर्ज करें',
    search: 'खोजें',
    sampleAadhar: 'नमूना आधार: 123456789012, 987654321098, 456789123456',
    farmerDetails: 'किसान विवरण',
    name: 'नाम',
    age: 'उम्र',
    gender: 'लिंग',
    aadhar: 'आधार',
    phone: 'फोन',
    address: 'पता',
    fertilizerLimit: 'उर्वरक सीमा',
    alreadyPurchased: 'पहले से खरीदा',
    availableToBuy: 'खरीदने के लिए उपलब्ध',
    proceedToScan: 'QR कोड स्कैन करने के लिए आगे बढ़ें',
    scanBatch: 'बैच स्कैन करें',
    scanBatchSubtitle: 'स्कैन करें बॅच QR कोड मार्क करने के लिए प्राप्त किया गया।',
    previousRecords: 'पिछले रिकॉर्ड',
    previousRecordsSubtitle: 'पहले प्राप्त किए गए बैच देखें।',
    salesHistory: 'विक्री इतिहास',
    salesHistorySubtitle: 'सभी बिक्री रिकॉर्ड देखें।',
    alertsTitle: 'अलर्ट',
    alertsSubtitle: 'सभी सक्रिय अलर्ट देखें।',
    featureComingSoon: 'फ़ीचर जल्द आ रहा है...',
    settingsTitle: 'सेटिंग्स',
    selectLanguage: 'भाषा चुनें',
    languageNames: {
      en: 'English',
      hi: 'हिन्दी',
      mr: 'मराठी'
    },
    settingsLanguageTab: 'भाषा',
    settingsDealerDetailsTab: 'डीलर विवरण',
    dealerInfoTitle: 'डीलर जानकारी',
    dealerName: 'डीलर का नाम',
    dealerPhone: 'डीलर फोन',
    dealerEmail: 'डीलर ईमेल',
    dealerAddress: 'डीलर पता',
    dealerAadhar: 'डीलर आधार',
    editDetails: 'विवरण संपादित करें',
    saveDetails: 'सहेजें',
    cancel: 'रद्द करें',
    farmerNotFound: 'किसान नहीं मिला'
  },
  mr: {
    brandTitle: 'डीलर',
    brandLabel: 'डॅशबोर्ड',
    sidebarDashboard: 'डॅशबोर्ड',
    sidebarScan: 'बॅच स्कॅन करा',
    sidebarPrevious: 'मागील नोंदी पहा',
    sidebarSell: 'विक्री',
    sidebarHistory: 'इतिहास',
    sidebarAlerts: 'अलर्ट',
    sidebarSettings: 'सेटिंग्ज',
    pageLabel: 'डीलर डॅशबोर्ड',
    fertilizerDistribution: 'खते वितरण',
    trackInfo: 'नोंदणीकृत शेतकरी, स्कॅन केलेली बॅच, विक्री आणि अलर्ट एकाच ठिकाणी ट्रॅक करा.',
    liveSync: 'लाइव्ह सिंक',
    governmentDataActive: 'सरकारी डेटा सक्रिय',
    totalFarmersRegistered: 'एकूण नोंदणीकृत शेतकरी',
    totalScanned: 'एकूण स्कॅन',
    totalSold: 'एकूण विक्री',
    activeAlerts: 'सक्रिय अलर्ट',
    view: 'पहा',
    processSale: 'विक्री प्रक्रिया',
    searchFarmerByAadhar: 'शेतकऱ्याचा आधार शोधा',
    enterAadharPlaceholder: '12 अंकी आधार क्रमांक प्रविष्ट करा',
    search: 'शोधा',
    sampleAadhar: 'नमुना आधार: 123456789012, 987654321098, 456789123456',
    farmerDetails: 'शेतकरी तपशील',
    name: 'नाव',
    age: 'वय',
    gender: 'लिंग',
    aadhar: 'आधार',
    phone: 'फोन',
    address: 'पत्ता',
    fertilizerLimit: 'खते मर्यादा',
    alreadyPurchased: 'आधीच विकत घेतले',
    availableToBuy: 'खरेदी करण्यासाठी उपलब्ध',
    proceedToScan: 'QR कोड स्कॅन करण्यासाठी पुढे जा',
    scanBatch: 'बॅच स्कॅन करा',
    scanBatchSubtitle: 'सूळ करा बॅच QR कोड प्राप्त झाले म्हणून मार्क करा.',
    previousRecords: 'मागील नोंदी',
    previousRecordsSubtitle: 'पूर्वी प्राप्त केलेल्या बॅच पहा.',
    salesHistory: 'विक्री इतिहास',
    salesHistorySubtitle: 'सर्व विक्री नोंदी पहा.',
    alertsTitle: 'अलर्ट',
    alertsSubtitle: 'सर्व सक्रिय अलर्ट पहा.',
    featureComingSoon: 'वैशिष्ट्य लवकरच येणार आहे...',
    settingsTitle: 'सेटिंग्ज',
    selectLanguage: 'भाषा निवडा',
    languageNames: {
      en: 'English',
      hi: 'हिन्दी',
      mr: 'मराठी'
    },
    settingsLanguageTab: 'भाषा',
    settingsDealerDetailsTab: 'डीलर तपशील',
    dealerInfoTitle: 'डीलर माहिती',
    dealerName: 'डीलर नाव',
    dealerPhone: 'डीलर फोन',
    dealerEmail: 'डीलर ईमेल',
    dealerAddress: 'डीलर पत्ता',
    dealerAadhar: 'डीलर आधार',
    editDetails: 'तपशील संपादित करा',
    saveDetails: 'जतन करा',
    cancel: 'रद्द करा',
    farmerNotFound: 'शेतकरी सापडला नाही'
  }
};

async function readJsonResponse(response) {
  const responseText = await response.text();

  try {
    return responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    throw new Error(`Server returned ${response.status} ${response.statusText} instead of JSON.`);
  }
}

function ScanIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8V5a1 1 0 0 1 1-1h3" />
      <path d="M16 4h3a1 1 0 0 1 1 1v3" />
      <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
      <path d="M8 20H5a1 1 0 0 1-1-1v-3" />
      <path d="M7 12h10" />
      <path d="M9 9h6v6H9z" />
    </svg>
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
    setScanStatus('Updating bag status');

    try {
      if (scannerRef.current?.isScanning) {
        await stopScanner();
      }

      const bagId = getBagIdFromScan(decodedText);

      if (!bagId) {
        throw new Error('The scanned QR code does not contain a bag ID.');
      }

      const response = await fetch(`${API_BASE_URL}/api/batches/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bagId, scannedBy: 'dealer' }),
      });

      const result = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(result.error || 'Unable to update bag status.');
      }

      setScanUpdate(result);
      setScanStatus(result.changed ? 'Marked received' : 'Bag received already');
    } catch (error) {
      setScanStatus('Scan update failed');
      setScanError(error.message || 'Unable to update bag status.');
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

      const decodedText = await scanner.scanFile(file, true);
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
              <ScanIcon />
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
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const dealerDetailsByLanguage = {
    en: {
      name: 'Raj Singh Dealer',
      phone: '+91 98765 43210',
      email: 'dealer@example.com',
      address: 'Village Nandpur, Taluka Indore, District Indore, Madhya Pradesh',
      aadhar: '1234 5678 9012'
    },
    hi: {
      name: 'राज सिंह डीलर',
      phone: '+91 98765 43210',
      email: 'dealer@example.com',
      address: 'ग्राम नंदपुर, तालुका इंदौर, जिला इंदौर, मध्य प्रदेश',
      aadhar: '1234 5678 9012'
    },
    mr: {
      name: 'राज सिंग डीलर',
      phone: '+91 98765 43210',
      email: 'dealer@example.com',
      address: 'वाडा नंदपूर, तालुका इंदूर, जिल्हा इंदूर, मध्य प्रदेश',
      aadhar: '1234 5678 9012'
    }
  };

  const [language, setLanguage] = useState('en');
  const [settingsView, setSettingsView] = useState('language');
  const [aadharInput, setAadharInput] = useState('');
  const [farmerData, setFarmerData] = useState(null);
  const [dealerDetails, setDealerDetails] = useState(dealerDetailsByLanguage.en);
  const [isEditingDealer, setIsEditingDealer] = useState(false);
  const [scanMode, setScanMode] = useState('camera');
  const [scannerActive, setScannerActive] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scannedText, setScannedText] = useState('');
  const [scannedBatch, setScannedBatch] = useState(null);
  const [scanSaveStatus, setScanSaveStatus] = useState('');
  const [scanRecords, setScanRecords] = useState([]);
  const [recordsStatus, setRecordsStatus] = useState({
    status: 'idle',
    message: '',
  });
  const html5QrCodeRef = useRef(null);
  const texts = translations[language];

  const digitMap = {
    hi: {0:'०',1:'१',2:'२',3:'३',4:'४',5:'५',6:'६',7:'७',8:'८',9:'९'},
    mr: {0:'०',1:'१',2:'२',3:'३',4:'४',5:'५',6:'६',7:'७',8:'८',9:'९'}
  };

  const localizeDigits = (value) => {
    if (language === 'en' || value === null || value === undefined) return value;
    return String(value).replace(/\d/g, (digit) => digitMap[language][digit] ?? digit);
  };

  const formatDateTime = (value) => {
    if (!value) return 'N/A';
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  };

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
      alert(texts.farmerNotFound);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchFarmer();
    }
  };

  const handleLanguageChange = (langKey) => {
    setLanguage(langKey);
    setDealerDetails(dealerDetailsByLanguage[langKey]);
  };

  const updateDealerDetail = (field, value) => {
    setDealerDetails((prev) => ({ ...prev, [field]: value }));
  };

  const clearScanResult = () => {
    setScannedText('');
    setScannedBatch(null);
    setScanError('');
    setScanSaveStatus('');
  };

  const parseDecodedPayload = (decodedText) => {
    try {
      const parsed = JSON.parse(decodedText);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
      return {};
    }
  };

  const fetchBatchDetails = async (decodedText) => {
    try {
      const decodedPayload = parseDecodedPayload(decodedText);
      const res = await fetch(`${API_BASE_URL}/api/batches`);
      if (!res.ok) {
        throw new Error(`Backend returned ${res.status}`);
      }
      const payload = await res.json();
      const batches = payload.batches || [];
      const decodedBagId = decodedPayload.bagId || decodedText;
      const decodedBatchNumber = decodedPayload.batchNumber || decodedText;

      return batches.find((b) =>
        b.batch_number === decodedBatchNumber ||
        (Array.isArray(b.bag_ids) && b.bag_ids.includes(decodedBagId)) ||
        (Array.isArray(b.qr_codes) && b.qr_codes.some((qrCode) =>
          qrCode?.bagId === decodedBagId ||
          qrCode?.payload === decodedText ||
          qrCode === decodedText
        ))
      ) || null;
    } catch (error) {
      console.warn('Could not fetch batches:', error.message || error);
      return null;
    }
  };

  const loadScanRecords = async () => {
    try {
      setRecordsStatus({ status: 'loading', message: 'Loading previous scan records...' });
      const response = await fetch(`${API_BASE_URL}/api/scan-records`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to load previous scan records.');
      }

      const records = payload.scanRecords || [];
      setScanRecords(records);
      setRecordsStatus({
        status: 'success',
        message: records.length ? '' : 'No scanned batch records yet.',
      });
    } catch (error) {
      setRecordsStatus({
        status: 'error',
        message: error.message || 'Unable to load previous scan records.',
      });
    }
  };

  const saveScanRecord = async (decodedText, batch) => {
    try {
      setScanSaveStatus('Saving scan record...');
      const decodedPayload = parseDecodedPayload(decodedText);
      const response = await fetch(`${API_BASE_URL}/api/scan-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decodedText,
          decodedPayload,
          batch,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to save scan record.');
      }

      setScanSaveStatus('Scan record saved.');
      setScanRecords((records) => [payload.scanRecord, ...records]);
    } catch (error) {
      setScanSaveStatus(error.message || 'Scan result shown, but saving failed.');
    }
  };

  const stopScanner = async () => {
    const qr = html5QrCodeRef.current;
    if (qr) {
      try {
        await qr.stop();
      } catch (error) {
        // ignore stop failures
      }
      try {
        qr.clear();
      } catch (error) {
        // ignore clear failures
      }
      html5QrCodeRef.current = null;
    }
    setScannerActive(false);
  };

  const handleDecodedValue = async (decodedText) => {
    setScannedText(decodedText);
    const batch = await fetchBatchDetails(decodedText);
    setScannedBatch(batch);
    await saveScanRecord(decodedText, batch);
    if (scanMode === 'camera') {
      await stopScanner();
    }
  };

  const startCameraScanner = async () => {
    clearScanResult();
    setScanError('');
    if (scannerActive) {
      return;
    }

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const qrRegionId = 'qr-reader';
      const html5QrCode = new Html5Qrcode(qrRegionId);
      html5QrCodeRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      const qrSuccess = async (decodedText) => {
        await handleDecodedValue(decodedText);
      };

      const qrFailure = () => {
        // ignore occasional failed frames
      };

      await html5QrCode.start({ facingMode: 'environment' }, config, qrSuccess, qrFailure);
      setScannerActive(true);
    } catch (error) {
      setScanError(`Camera scanner failed: ${error?.message || error}`);
      console.error('Camera scanner error:', error);
      setScannerActive(false);
    }
  };

  const handleUploadFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    clearScanResult();
    setScanError('');

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      let html5QrCode = html5QrCodeRef.current;
      if (!html5QrCode) {
        html5QrCode = new Html5Qrcode('qr-reader');
        html5QrCodeRef.current = html5QrCode;
      }

      const result = await html5QrCode.scanFileV2(file, true);
      const decodedText = result?.decodedText || (Array.isArray(result) ? result[0]?.decodedText : null);

      if (decodedText) {
        await handleDecodedValue(decodedText);
      } else {
        setScanError('No QR code found in the uploaded image.');
      }
    } catch (error) {
      setScanError(`Upload scan failed: ${error?.message || error}`);
      console.error('Upload scan error:', error);
    } finally {
      event.target.value = '';
    }
  };

  useEffect(() => {
    if (currentPage !== 'scan') {
      stopScanner();
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 'previous') {
      loadScanRecords();
    }
  }, [currentPage]);

  return (
    <div className="dealer-dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">F</div>
          <div>
            <h1>{texts.brandTitle}</h1>
            <p>{texts.brandLabel}</p>
          </div>
        </div>

        <nav className="nav-menu">
          <button className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>{texts.sidebarDashboard}</button>
          <button className={`nav-item ${currentPage === 'scan' ? 'active' : ''}`} onClick={() => setCurrentPage('scan')}>{texts.sidebarScan}</button>
          <button className={`nav-item ${currentPage === 'previous' ? 'active' : ''}`} onClick={() => setCurrentPage('previous')}>{texts.sidebarPrevious}</button>
          <button className={`nav-item ${currentPage === 'sell' ? 'active' : ''}`} onClick={() => setCurrentPage('sell')}>{texts.sidebarSell}</button>
          <button className={`nav-item ${currentPage === 'history' ? 'active' : ''}`} onClick={() => setCurrentPage('history')}>{texts.sidebarHistory}</button>
          <button className={`nav-item ${currentPage === 'alerts' ? 'active' : ''}`} onClick={() => setCurrentPage('alerts')}>{texts.sidebarAlerts}</button>
          <button className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`} onClick={() => setCurrentPage('settings')}>{texts.sidebarSettings}</button>
        </nav>
      </aside>

      <main className="main-panel">
        {currentPage === 'dashboard' && (
          <>
            <header className="top-bar">
              <div>
                <p className="page-label">{texts.pageLabel}</p>
                <h2>{texts.fertilizerDistribution}</h2>
                <p className="subtitle">
                  {texts.trackInfo}
                </p>
              </div>
              <div className="header-card">
                <span className="header-icon">⚡</span>
                <div>
                  <p>{texts.liveSync}</p>
                  <strong>{texts.governmentDataActive}</strong>
                </div>
              </div>
            </header>

            <section className="section stats-row">
              <div className="stat-card card-green">
                <span className="stat-icon">👨‍🌾</span>
                <p>{texts.totalFarmersRegistered}</p>
                <strong>{localizeDigits(1250)}</strong>
                <button className="view-button">{texts.view}</button>
              </div>
              <div className="stat-card card-blue">
                <span className="stat-icon">📦</span>
                <p>{texts.totalScanned}</p>
                <strong>{localizeDigits(482)}</strong>
                <button className="view-button">{texts.view}</button>
              </div>
              <div className="stat-card card-orange">
                <span className="stat-icon">🛒</span>
                <p>{texts.totalSold}</p>
                <strong>{localizeDigits(348)}</strong>
                <button className="view-button">{texts.view}</button>
              </div>
              <div className="stat-card card-purple">
                <span className="stat-icon">⚠️</span>
                <p>{texts.activeAlerts}</p>
                <strong>{localizeDigits(12)}</strong>
                <button className="view-button">{texts.view}</button>
              </div>
            </section>
          </>
        )}

        {currentPage === 'sell' && (
          <>
            <header className="top-bar">
              <div>
                <p className="page-label">{texts.pageLabel}</p>
                <h2>{texts.processSale}</h2>
                <p className="subtitle">
                  {texts.searchFarmerByAadhar}
                </p>
              </div>
            </header>

            <section className="sell-section">
              <div className="search-card">
                <h3>{texts.searchFarmerByAadhar}</h3>
                <div className="search-input-group">
                  <input
                    type="text"
                    placeholder={localizeDigits(texts.enterAadharPlaceholder)}
                    value={aadharInput}
                    onChange={(e) => setAadharInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    maxLength="12"
                  />
                  <button onClick={searchFarmer} className="search-button">{texts.search}</button>
                </div>
                <p className="search-hint">{localizeDigits(texts.sampleAadhar)}</p>
              </div>

              {farmerData && (
                <div className="farmer-details-card">
                  <h3>{texts.farmerDetails}</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="label">{texts.name}</span>
                      <span className="value">{farmerData.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">{texts.age}</span>
                      <span className="value">{farmerData.age}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">{texts.gender}</span>
                      <span className="value">{farmerData.gender}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">{texts.aadhar}</span>
                      <span className="value">{localizeDigits(farmerData.aadhar)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">{texts.phone}</span>
                      <span className="value">{localizeDigits(farmerData.phone)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">{texts.address}</span>
                      <span className="value">{farmerData.address}</span>
                    </div>
                    <div className="detail-item limit-info">
                      <span className="label">{texts.fertilizerLimit}</span>
                      <span className="value">{localizeDigits(farmerData.limit)} kg</span>
                    </div>
                    <div className="detail-item purchased-info">
                      <span className="label">{texts.alreadyPurchased}</span>
                      <span className="value">{localizeDigits(farmerData.purchased)} kg</span>
                    </div>
                    <div className="detail-item available-info">
                      <span className="label">{texts.availableToBuy}</span>
                      <span className="value">{localizeDigits(farmerData.limit - farmerData.purchased)} kg</span>
                    </div>
                  </div>
                  <button className="proceed-button">{texts.proceedToScan}</button>
                </div>
              )}
            </section>
          </>
        )}

        {currentPage === 'scan' && (
          <>
            <header className="top-bar">
              <div>
                <p className="page-label">{texts.pageLabel}</p>
                <h2>{texts.scanBatch}</h2>
                <p className="subtitle">{texts.scanBatchSubtitle}</p>
              </div>
            </header>
            <ScannerPage />
          </>
        )}

        {currentPage === 'previous' && (
          <>
            <header className="top-bar">
              <div>
                <p className="page-label">{texts.pageLabel}</p>
                <h2>{texts.previousRecords}</h2>
                <p className="subtitle">{texts.previousRecordsSubtitle}</p>
              </div>
            </header>
            <section className="records-section">
              {recordsStatus.status === 'loading' && <p className="records-message">{recordsStatus.message}</p>}
              {recordsStatus.status === 'error' && <p className="records-message error">{recordsStatus.message}</p>}
              {recordsStatus.status === 'success' && scanRecords.length === 0 && (
                <p className="records-message">{recordsStatus.message}</p>
              )}
              {scanRecords.length > 0 && (
                <div className="records-table-wrap">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>Scanned At</th>
                        <th>Bag ID</th>
                        <th>Batch Number</th>
                        <th>Product</th>
                        <th>Bags</th>
                        <th>Manufacturer</th>
                        <th>Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scanRecords.map((record) => (
                        <tr key={record.id}>
                          <td>{formatDateTime(record.scanned_at)}</td>
                          <td>{record.bag_id || 'N/A'}</td>
                          <td>{record.batch_number || 'N/A'}</td>
                          <td>{record.product_name || 'N/A'}</td>
                          <td>{record.number_of_bags || 'N/A'}</td>
                          <td>{record.manufacturer || 'N/A'}</td>
                          <td>{record.bag_weight || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {currentPage === 'history' && (
          <>
            <header className="top-bar">
              <div>
                <p className="page-label">{texts.pageLabel}</p>
                <h2>{texts.salesHistory}</h2>
                <p className="subtitle">{texts.salesHistorySubtitle}</p>
              </div>
            </header>
            <section className="empty-section">
              <p>{texts.featureComingSoon}</p>
            </section>
          </>
        )}

        {currentPage === 'alerts' && (
          <>
            <header className="top-bar">
              <div>
                <p className="page-label">{texts.pageLabel}</p>
                <h2>{texts.alertsTitle}</h2>
                <p className="subtitle">{texts.alertsSubtitle}</p>
              </div>
            </header>
            <section className="empty-section">
              <p>{texts.featureComingSoon}</p>
            </section>
          </>
        )}

        {currentPage === 'settings' && (
          <>
            <header className="top-bar">
              <div>
                <p className="page-label">{texts.pageLabel}</p>
                <h2>{texts.settingsTitle}</h2>
                <p className="subtitle">
                  {settingsView === 'language' ? texts.selectLanguage : texts.dealerInfoTitle}
                </p>
              </div>
            </header>
            <section className="settings-section">
              <div className="settings-card">
                <div className="settings-tabs">
                  <button
                    className={`settings-tab ${settingsView === 'language' ? 'active' : ''}`}
                    onClick={() => setSettingsView('language')}
                  >
                    {texts.settingsLanguageTab}
                  </button>
                  <button
                    className={`settings-tab ${settingsView === 'dealer' ? 'active' : ''}`}
                    onClick={() => setSettingsView('dealer')}
                  >
                    {texts.settingsDealerDetailsTab}
                  </button>
                </div>

                {settingsView === 'language' ? (
                  <div className="language-panel">
                    <h3>{texts.selectLanguage}</h3>
                    <div className="language-options">
                      {Object.entries(texts.languageNames).map(([langKey, langLabel]) => (
                        <button
                          key={langKey}
                          className={`language-button ${language === langKey ? 'active' : ''}`}
                          onClick={() => handleLanguageChange(langKey)}
                        >
                          {langLabel}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="dealer-details-panel">
                    <h3>{texts.dealerInfoTitle}</h3>
                    {isEditingDealer ? (
                      <div className="dealer-edit-form">
                        <label>
                          {texts.dealerName}
                          <input
                            value={dealerDetails.name}
                            onChange={(e) => updateDealerDetail('name', e.target.value)}
                          />
                        </label>
                        <label>
                          {texts.dealerPhone}
                          <input
                            value={dealerDetails.phone}
                            onChange={(e) => updateDealerDetail('phone', e.target.value)}
                          />
                        </label>
                        <label>
                          {texts.dealerEmail}
                          <input
                            value={dealerDetails.email}
                            onChange={(e) => updateDealerDetail('email', e.target.value)}
                          />
                        </label>
                        <label>
                          {texts.dealerAadhar}
                          <input
                            value={dealerDetails.aadhar}
                            onChange={(e) => updateDealerDetail('aadhar', e.target.value)}
                          />
                        </label>
                        <label>
                          {texts.dealerAddress}
                          <input
                            value={dealerDetails.address}
                            onChange={(e) => updateDealerDetail('address', e.target.value)}
                          />
                        </label>
                        <div className="form-actions">
                          <button className="cancel-button" onClick={() => setIsEditingDealer(false)}>{texts.cancel}</button>
                          <button className="save-button" onClick={() => setIsEditingDealer(false)}>{texts.saveDetails}</button>
                        </div>
                      </div>
                    ) : (
                      <div className="dealer-details-view">
                        <div className="detail-row detail-primary">
                          <strong>{dealerDetails.name}</strong>
                          <span>{texts.dealerName}</span>
                        </div>
                        <div className="detail-row">
                          <strong>{localizeDigits(dealerDetails.phone)}</strong>
                          <span>{texts.dealerPhone}</span>
                        </div>
                        <div className="detail-row">
                          <strong>{dealerDetails.email}</strong>
                          <span>{texts.dealerEmail}</span>
                        </div>
                        <div className="detail-row">
                          <strong>{localizeDigits(dealerDetails.aadhar)}</strong>
                          <span>{texts.dealerAadhar}</span>
                        </div>
                        <div className="detail-row">
                          <strong>{dealerDetails.address}</strong>
                          <span>{texts.dealerAddress}</span>
                        </div>
                        <button className="edit-button" onClick={() => setIsEditingDealer(true)}>{texts.editDetails}</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
