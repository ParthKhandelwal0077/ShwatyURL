"use client";

import { useEffect, useRef } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
}

const QRCode = ({ value, size = 200, bgColor = "#ffffff", fgColor = "#000000" }: QRCodeProps) => {
  const qrContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a simple placeholder - in a real app you'd use a proper QR code library
    // Dynamically load a QR code library to generate the actual QR code
    const loadQRCode = async () => {
      if (qrContainerRef.current) {
        // For the demo, we're just showing a placeholder QR code
        // In a real implementation, you'd render an actual QR code here
        qrContainerRef.current.innerHTML = '';
        
        // Create a grid to simulate a QR code
        const qrSize = 5; // 5x5 grid
        const cellSize = size / qrSize;
        
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `repeat(${qrSize}, 1fr)`;
        grid.style.width = `${size}px`;
        grid.style.height = `${size}px`;
        
        // Generate a fake but consistent pattern based on the URL
        const hash = [...value].reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        for (let i = 0; i < qrSize * qrSize; i++) {
          const cell = document.createElement('div');
          cell.style.width = `${cellSize}px`;
          cell.style.height = `${cellSize}px`;
          
          // Make a pattern that looks like a QR code
          const shouldFill = (
            // Always have the corners filled (position markers)
            i === 0 || i === qrSize - 1 || i === qrSize * (qrSize - 1) || i === qrSize * qrSize - 1 ||
            // Fill based on hash to make it look random but consistent
            (hash + i) % 3 === 0
          );
          
          if (shouldFill || i < qrSize || i % qrSize === 0 || i % qrSize === qrSize - 1 || i >= qrSize * (qrSize - 1)) {
            cell.style.backgroundColor = fgColor;
          } else {
            cell.style.backgroundColor = bgColor;
          }
          
          grid.appendChild(cell);
        }
        
        qrContainerRef.current.appendChild(grid);
      }
    };

    loadQRCode();
  }, [value, size, bgColor, fgColor]);

  return <div ref={qrContainerRef} style={{ width: size, height: size }} />;
};

export default QRCode;