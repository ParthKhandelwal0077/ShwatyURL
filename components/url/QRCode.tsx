"use client";

import { useMemo } from 'react';
import QRCodeSVG from 'react-qr-code';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

const QRCode = ({ value, size = 200, className = '' }: QRCodeProps) => {
  // Generate a simple overlay pattern based on the value
  const overlayCells = useMemo(() => {
    const cells = [];
    const grid = 8; // 8x8 overlay grid
    const cellSize = size / grid;
    const hash = Array.from(value).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    for (let i = 0; i < grid * grid; i++) {
      const shouldColor = (hash + i) % 11 === 0;
      if (shouldColor) {
        cells.push(
          <div
            key={i}
            style={{
              position: 'absolute',
              width: cellSize,
              height: cellSize,
              top: Math.floor(i / grid) * cellSize,
              left: (i % grid) * cellSize,
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              pointerEvents: 'none',
            }}
          />
        );
      }
    }
    return cells;
  }, [value, size]);

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <QRCodeSVG value={value} size={size} bgColor="#fff" fgColor="#000" level="H" />
      {/* Overlay pattern */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: size, height: size, pointerEvents: 'none' }}>
        {overlayCells}
      </div>
    </div>
  );
};

export default QRCode;