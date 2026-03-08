'use client';

import React from 'react';
import { QuizResult } from '@/types';
import { formatDate } from '@/lib/utils';

interface ProgressChartProps {
  results: QuizResult[];
}

/**
 * SVG line chart displaying quiz score history over time.
 * Renders a simple, responsive chart without external dependencies.
 */
export default function ProgressChart({ results }: ProgressChartProps) {
  if (results.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-8 text-center">
        <p className="text-muted">No quiz data yet. Take a quiz to see your progress!</p>
      </div>
    );
  }

  // Take last 20 results, sorted by date
  const sorted = [...results]
    .sort((a, b) => new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime())
    .slice(-20);

  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale
  const xStep = sorted.length > 1 ? chartWidth / (sorted.length - 1) : chartWidth / 2;
  const maxAccuracy = 100;

  // Build points
  const points = sorted.map((r, i) => ({
    x: padding.left + i * xStep,
    y: padding.top + chartHeight - (r.accuracy / maxAccuracy) * chartHeight,
    accuracy: r.accuracy,
    date: formatDate(r.taken_at),
    type: r.quiz_type,
  }));

  // Build SVG path
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Gradient area fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  // Y-axis labels
  const yLabels = [0, 25, 50, 75, 100];

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <h3 className="font-semibold mb-4">Score History</h3>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[400px]"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Defs */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yLabels.map((label) => {
            const y = padding.top + chartHeight - (label / maxAccuracy) * chartHeight;
            return (
              <g key={label}>
                <line
                  x1={padding.left} y1={y}
                  x2={width - padding.right} y2={y}
                  stroke="var(--color-border)" strokeWidth="1"
                  strokeDasharray={label === 0 ? '0' : '4 4'}
                />
                <text
                  x={padding.left - 8} y={y + 4}
                  textAnchor="end" fontSize="10"
                  fill="var(--color-muted)"
                >
                  {label}%
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x} cy={p.y} r="4"
                fill="var(--color-surface)"
                stroke="var(--color-primary)"
                strokeWidth="2"
              />
              {/* Tooltip - show on last point and some key points */}
              {(i === points.length - 1 || (sorted.length <= 10 && i % 2 === 0)) && (
                <text
                  x={p.x} y={p.y - 10}
                  textAnchor="middle" fontSize="9"
                  fill="var(--color-muted)"
                >
                  {p.accuracy}%
                </text>
              )}
            </g>
          ))}

          {/* X-axis labels (show first, middle, last) */}
          {[0, Math.floor(points.length / 2), points.length - 1]
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((i) => (
              <text
                key={i}
                x={points[i].x}
                y={height - 5}
                textAnchor="middle"
                fontSize="9"
                fill="var(--color-muted)"
              >
                {points[i].date}
              </text>
            ))}
        </svg>
      </div>
    </div>
  );
}
