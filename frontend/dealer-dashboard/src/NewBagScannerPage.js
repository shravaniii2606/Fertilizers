import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export default function NewBagScannerPage({ setCurrentPage }) {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [bagData, setBagData] = useState(null);
  const [farmerData, setFarmerData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper to fetch bag details by bagId
  const fetchBagById = async (bagId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bags/${bagId}`);
      if (!res.ok) throw new Error('Bag not found');
      return await res.json();
    } catch (e) {
      throw e;
    }
  };

  // Helper to fetch farmer details by aadhar
  const fetchFarmerByAadhar = async (aadhar) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/farmers/${aadhar}`);
      if (!res.ok) throw new Error('Farmer not found');
      return await res.json();
    } catch (e) {
      throw e;
    }
  };

  const handleSuccess = async (decodedText) => {
    // Expect QR payload to contain JSON with at least bagId and aadhar
    let payload;
    try {
      payload = JSON.parse(decodedText);
    } catch {
      setError('Invalid QR payload');
      return;
    }
    const { bagId, aadhar } = payload;
    if (!bagId || !aadhar) {
      setError('QR missing bagId or aadhar');
      return;
    }
    setLoading(true);
    try {
      const bag = await fetchBagById(bagId);
      setBagData(bag);
      const farmer = await fetchFarmerByAadhar(aadhar);
      setFarmerData(farmer);
      setError(null);
      // Stop scanner after successful fetch
      const scanner = scannerRef.current;
      if (scanner) {
        await scanner.stop().catch(() => {});
        if (scanner.clear) scanner.clear();
      }
      setScanning(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  // Upload QR image handling
  const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    // Stop any active camera scanner before scanning file
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
      if (scannerRef.current.clear) scannerRef.current.clear();
    }
    const html5QrCode = new Html5Qrcode('qr-reader');
    const result = await html5QrCode.scanFile(file, true);
    await handleSuccess(result);
    // Cleanup after scanning (clear only, no stop)
    if (html5QrCode.clear) html5QrCode.clear();
  } catch (e) {
    setError(`Upload scan error: ${e}`);
  }
};

  // UI: hidden file input reference
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // reset
      fileInputRef.current.click();
    }
  };

  const startScanner = () => {
    if (scannerRef.current) return; // already running
    const html5QrCode = new Html5Qrcode('qr-reader');
    scannerRef.current = html5QrCode;
    html5QrCode
      .start({ facingMode: 'environment' }, { fps: 10, qrbox: 250 }, handleSuccess)
      .then(() => setScanning(true))
      .catch((err) => setError(`Scanner error: ${err}`));
  };

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    // Attempt to stop; ignore errors if not running
    await scanner.stop().catch(() => {});
    if (scanner.clear) scanner.clear();
    setScanning(false);
  };

// UI: start button when not scanning
const startButton = (
  <button className="start-scan-button" onClick={startScanner} disabled={scanning}>
    Start QR Scan
  </button>
);

useEffect(() => {
  // Cleanup on component unmount
  return () => stopScanner();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  const handlePurchase = async () => {
    if (!bagData || !farmerData) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/bags/${bagData.id}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmer_aadhar: farmerData.aadhar })
      });
      if (!res.ok) throw new Error('Purchase failed');
      alert('Purchase successful!');
      // Return to sell page after purchase
      setCurrentPage('sell');
    } catch (e) {
      alert(e.message);
    }
  };

    return (
      <div className="bag-scanner-page">
        <header className="top-bar">
          <div>
            <p className="page-label">Bag Scan</p>
            <h2>Scan Bag QR Code</h2>
          </div>
        </header>
        {startButton}
        <button className="upload-button" onClick={triggerFileInput} disabled={scanning}>
          Upload QR Image
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        {scanning && (
          <button className="stop-scan-button" onClick={stopScanner} disabled={!scanning}>
            Stop QR Scan
          </button>
        )}
        <div id="qr-reader" className="qr-reader"></div>
        {loading && <p>Loading details...</p>}
        {error && <p className="error">{error}</p>}
        {bagData && (
          <section className="bag-details">
            <h3>Bag Details</h3>
            <p><strong>ID:</strong> {bagData.id || bagData.bagId}</p>
            <p><strong>Product:</strong> {bagData.product_name || bagData.product}</p>
            <p><strong>Weight:</strong> {bagData.bag_weight || bagData.weight} kg</p>
            <p><strong>Batch:</strong> {bagData.batch_number}</p>
          </section>
        )}
        {farmerData && (
          <section className="farmer-details">
            <h3>Farmer Details</h3>
            <p><strong>Name:</strong> {farmerData.name}</p>
            <p><strong>Aadhar:</strong> {farmerData.aadhar}</p>
            <p><strong>Phone:</strong> {farmerData.phone}</p>
            <p><strong>Address:</strong> {farmerData.address}</p>
          </section>
        )}
        {bagData && farmerData && (
          <button className="purchase-button" onClick={handlePurchase}>
            Purchase Fertilizer
          </button>
        )}
      </div>
    );
}
