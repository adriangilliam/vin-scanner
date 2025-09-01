'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { NotFoundException } from '@zxing/library';

export default function VinScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [vin, setVin] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    // Initialize the barcode reader
    readerRef.current = new BrowserMultiFormatReader();
    
    return () => {
      // Cleanup on unmount
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    setError('');
    setIsScanning(true);

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Start scanning with ZXing
        if (readerRef.current) {
          readerRef.current.decodeFromVideoDevice(
            undefined, // Use default video device
            videoRef.current,
            (result, error) => {
              if (result) {
                const scannedText = result.getText();
                
                // VIN validation: VINs are typically 17 characters long
                if (scannedText.length === 17) {
                  setVin(scannedText);
                  stopScanning();
                } else {
                  // Continue scanning if not a valid VIN length
                  setError('Scanned code is not a valid VIN (must be 17 characters)');
                }
              }
              
              if (error && !(error instanceof NotFoundException)) {
                console.error('Scanning error:', error);
              }
            }
          );
        }
      }
    } catch (err) {
      setHasPermission(false);
      setError('Camera access denied. Please allow camera access and try again.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    
    if (readerRef.current) {
      readerRef.current.reset();
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const resetScanner = () => {
    setVin('');
    setError('');
    setHasPermission(null);
    stopScanning();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          VIN Barcode Scanner
        </h1>

        {!isScanning && !vin && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Tap the button below to start scanning a VIN barcode with your camera.
            </p>
            <button
              onClick={startScanning}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Start Scanning
            </button>
          </div>
        )}

        {isScanning && (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg border-2 border-gray-300"
                style={{ maxHeight: '300px' }}
              />
              <div className="absolute inset-0 border-2 border-red-500 border-dashed rounded-lg pointer-events-none opacity-50"></div>
            </div>
            <p className="text-center text-gray-600 text-sm">
              Point your camera at a VIN barcode
            </p>
            <button
              onClick={stopScanning}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Stop Scanning
            </button>
          </div>
        )}

        {vin && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                VIN Detected:
              </h2>
              <p className="text-lg font-mono bg-white p-3 rounded border text-gray-800 break-all">
                {vin}
              </p>
            </div>
            <button
              onClick={resetScanner}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Scan Another VIN
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <p className="text-red-800 text-sm">{error}</p>
            {hasPermission === false && (
              <button
                onClick={startScanning}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {hasPermission === false && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-yellow-800 text-sm">
              To use this app, you need to allow camera access in your browser settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}