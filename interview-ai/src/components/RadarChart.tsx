'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { FinalReport } from '@/lib/types';
import { formatRadarData } from '@/lib/scoring';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartProps {
  report: FinalReport;
}

export function RadarChart({ report }: RadarChartProps) {
  const chartRef = useRef(null);
  const data = formatRadarData(report);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: 'rgba(139, 148, 158, 0.5)',
          backdropColor: 'transparent',
          font: { size: 10 },
        },
        grid: {
          color: 'rgba(0, 240, 255, 0.08)',
        },
        angleLines: {
          color: 'rgba(0, 240, 255, 0.08)',
        },
        pointLabels: {
          color: '#8b949e',
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(13, 17, 23, 0.95)',
        borderColor: 'rgba(0, 240, 255, 0.3)',
        borderWidth: 1,
        titleColor: '#00f0ff',
        bodyColor: '#e6edf3',
        titleFont: { family: "'Orbitron', monospace", size: 11 },
        bodyFont: { family: "'Inter', sans-serif" },
        padding: 12,
        callbacks: {
          label: function (context: { parsed: { r: number } }) {
            return ` Score: ${context.parsed.r}%`;
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  return (
    <div
      className="glass-card animate-fade-in-up"
      style={{
        maxWidth: '500px',
        margin: '0 auto',
        padding: '2rem',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.8rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}
        className="neon-text-cyan"
      >
        Skill Radar Analysis
      </h3>
      <Radar ref={chartRef} data={data} options={options} />
    </div>
  );
}
