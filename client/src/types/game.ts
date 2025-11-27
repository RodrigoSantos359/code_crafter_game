// Tipos de comandos disponíveis
export type CommandType = 'move' | 'turn' | 'if' | 'loop' | 'function';

// Direções do robô
export type Direction = 'up' | 'down' | 'left' | 'right';

// Tipos de obstáculos
export type ObstacleType = 'wall' | 'water' | 'gap' | 'battery';

// Estrutura de um comando
export interface Command {
  id: string;
  type: CommandType;
  label: string;
  params?: Record<string, any>;
  children?: Command[]; // Para condicionais e laços
}

// Estrutura de uma célula do mapa
export interface MapCell {
  x: number;
  y: number;
  type: 'empty' | 'obstacle' | 'goal';
  obstacle?: ObstacleType;
}

// Estrutura de um nível
export interface Level {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gridWidth: number;
  gridHeight: number;
  startX: number;
  startY: number;
  startDirection: Direction;
  goalX: number;
  goalY: number;
  map: MapCell[];
  allowedCommands: CommandType[];
  tutorial?: string;
  hints?: string[];
}

// Estrutura do estado do robô durante execução
export interface RobotState {
  x: number;
  y: number;
  direction: Direction;
  isMoving: boolean;
  hasCollided: boolean;
  reachedGoal: boolean;
}

// Estrutura de resultado de execução
export interface ExecutionResult {
  success: boolean;
  steps: number;
  message: string;
  error?: string;
  errorBlockId?: string;
}

// Estrutura de progresso do jogador
export interface PlayerProgress {
  currentLevel: number;
  completedLevels: number[];
  totalSteps: number;
  bestSteps: Record<string, number>; // levelId -> minSteps
}

export interface FunctionDefinition {
  id: string;
  name: string;
  commands: Command[];
}
