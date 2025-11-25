import React from 'react';
import { Level, RobotState } from '@/types/game';
import { Zap, Droplets, AlertCircle } from 'lucide-react';

interface GameMapProps {
  level: Level;
  robotState: RobotState;
}

export function GameMap({ level, robotState }: GameMapProps) {
  const cellSize = 50;
  const width = level.gridWidth * cellSize;
  const height = level.gridHeight * cellSize;

  // Obter ícone de obstáculo
  const getObstacleIcon = (type: string) => {
    switch (type) {
      case 'water':
        return <Droplets className="w-6 h-6 text-blue-500" />;
      case 'wall':
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
      case 'gap':
        return <div className="w-6 h-6 bg-gray-400 rounded" />;
      default:
        return null;
    }
  };

  // Obter rotação do robô em graus
  const getRobotRotation = (direction: string): number => {
    const rotations: Record<string, number> = {
      right: 0,
      down: 90,
      left: 180,
      up: 270,
    };
    return rotations[direction] || 0;
  };

  return (
    <div className="flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
      <svg width={width} height={height} className="border-2 border-slate-300 rounded bg-white">
        {/* Renderizar células do mapa */}
        {level.map.map((cell, idx) => (
          <g key={idx}>
            {/* Célula de fundo */}
            <rect
              x={cell.x * cellSize}
              y={cell.y * cellSize}
              width={cellSize}
              height={cellSize}
              fill={cell.type === 'goal' ? '#fef3c7' : '#ffffff'}
              stroke="#e5e7eb"
              strokeWidth="1"
            />

            {/* Objetivo (bateria) */}
            {cell.type === 'goal' && (
              <g>
                <circle
                  cx={cell.x * cellSize + cellSize / 2}
                  cy={cell.y * cellSize + cellSize / 2}
                  r="12"
                  fill="#fbbf24"
                />
                <text
                  x={cell.x * cellSize + cellSize / 2}
                  y={cell.y * cellSize + cellSize / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                >
                  ⚡
                </text>
              </g>
            )}

            {/* Obstáculos */}
            {cell.type === 'obstacle' && (
              <foreignObject
                x={cell.x * cellSize + cellSize / 2 - 12}
                y={cell.y * cellSize + cellSize / 2 - 12}
                width="24"
                height="24"
              >
                <div className="flex items-center justify-center">
                  {getObstacleIcon(cell.obstacle || '')}
                </div>
              </foreignObject>
            )}
          </g>
        ))}

        {/* Renderizar robô */}
        <g
          transform={`translate(${robotState.x * cellSize + cellSize / 2}, ${robotState.y * cellSize + cellSize / 2}) rotate(${getRobotRotation(robotState.direction)})`}
        >
          {/* Corpo do robô */}
          <rect
            x="-12"
            y="-12"
            width="24"
            height="24"
            fill="#3b82f6"
            rx="4"
          />
          {/* Olho do robô */}
          <circle cx="6" cy="-4" r="3" fill="#ffffff" />
          {/* Seta de direção */}
          <polygon
            points="0,-12 4,-6 -4,-6"
            fill="#60a5fa"
          />
        </g>
      </svg>
    </div>
  );
}
