import React, { useEffect, useState } from 'react';
import { Level, RobotState } from '@/types/game';
import { Droplets, AlertCircle } from 'lucide-react';

interface GameMapProps {
  level: Level;
  robotState: RobotState;
}

export function GameMap({ level, robotState }: GameMapProps) {
  const [maxCanvasSize, setMaxCanvasSize] = useState(360);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (typeof window === 'undefined') return;
      const availableWidth = Math.max(320, window.innerWidth - 160);
      setMaxCanvasSize(Math.min(640, availableWidth));
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const dynamicCellSize = Math.floor(maxCanvasSize / Math.max(level.gridWidth, level.gridHeight));
  const cellSize = Math.max(32, Math.min(64, dynamicCellSize));
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
    <div className="flex items-center justify-center p-4 bg-linear-to-br from-slate-50 to-slate-100 rounded-lg overflow-auto">
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

        {/* Renderizar robô com design detalhado */}
        <g
          transform={`translate(${robotState.x * cellSize + cellSize / 2}, ${robotState.y * cellSize + cellSize / 2}) rotate(${getRobotRotation(robotState.direction)})`}
        >
          {/* Corpo principal do robô - cilindro */}
          <rect
            x="-12"
            y="-14"
            width="24"
            height="28"
            fill="#3b82f6"
            rx="6"
            ry="6"
          />

          {/* Topo do robô - antena */}
          <rect
            x="-2"
            y="-18"
            width="4"
            height="6"
            fill="#1e40af"
            rx="2"
          />

          {/* Bola da antena */}
          <circle cx="0" cy="-20" r="2.5" fill="#1e40af" />

          {/* Olhos do robô */}
          <circle cx="-5" cy="-8" r="2" fill="#ffffff" />
          <circle cx="5" cy="-8" r="2" fill="#ffffff" />

          {/* Pupilas dos olhos — movem conforme direção */}
          <circle
            cx={-5 + (robotState.direction === "right" ? 1.5 : robotState.direction === "left" ? -1.5 : 0)}
            cy={-8 + (robotState.direction === "down" ? 1.5 : robotState.direction === "up" ? -1.5 : 0)}
            r="1"
            fill="#000000"
          />
          <circle
            cx={5 + (robotState.direction === "right" ? 1.5 : robotState.direction === "left" ? -1.5 : 0)}
            cy={-8 + (robotState.direction === "down" ? 1.5 : robotState.direction === "up" ? -1.5 : 0)}
            r="1"
            fill="#000000"
          />

          {/* Boca do robô */}
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#ffffff" strokeWidth="1.5" />

          {/* Painel frontal */}
          <rect
            x="-10"
            y="-4"
            width="20"
            height="12"
            fill="#2563eb"
            rx="2"
          />

          {/* Botões do painel */}
          <circle cx="-5" cy="-1" r="1.5" fill="#fbbf24" />
          <circle cx="0" cy="-1" r="1.5" fill="#ef4444" />
          <circle cx="5" cy="-1" r="1.5" fill="#10b981" />

          {/* Seta frontal grande indicando direção */}
          

          {/* Rodas do robô */}
          <circle cx="-10" cy="12" r="3" fill="#1e40af" />
          <circle cx="10" cy="12" r="3" fill="#1e40af" />

          {/* Borda do robô para melhor visibilidade */}
          <rect
            x="-12"
            y="-14"
            width="24"
            height="28"
            fill="none"
            stroke="#1e40af"
            strokeWidth="1.5"
            rx="6"
            ry="6"
          />

          {/* dicionar uma sombra atrás do robô que muda conforme a direção */}
          <ellipse
            cx="0"
            cy="18"
            rx={robotState.direction === "right" ? 10 : robotState.direction === "left" ? 8 : 10}
            ry={robotState.direction === "down" ? 3 : robotState.direction === "up" ? 8 : 3}
            fill="#000"
            opacity="0.2"
          />
        </g>
      </svg>
    </div>
  );
}
