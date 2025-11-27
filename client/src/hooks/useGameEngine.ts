import { useState, useCallback, useEffect } from 'react';
import { Command, Direction, Level, RobotState, ExecutionResult, FunctionDefinition } from '@/types/game';

const DIRECTIONS: Direction[] = ['right', 'down', 'left', 'up'];

export function useGameEngine(level: Level, functionDefinitions: FunctionDefinition[] = []) {
  const [robotState, setRobotState] = useState<RobotState>({
    x: level.startX,
    y: level.startY,
    direction: level.startDirection,
    isMoving: false,
    hasCollided: false,
    reachedGoal: false,
  });

  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Resetar robô quando o nível mudar
  useEffect(() => {
    setRobotState({
      x: level.startX,
      y: level.startY,
      direction: level.startDirection,
      isMoving: false,
      hasCollided: false,
      reachedGoal: false,
    });
    setExecutionLog([]);
  }, [level.id]);

  // Verificar se uma posição é válida no mapa
  const isValidPosition = useCallback((x: number, y: number): boolean => {
    if (x < 0 || x >= level.gridWidth || y < 0 || y >= level.gridHeight) {
      return false;
    }
    const cell = level.map.find(c => c.x === x && c.y === y);
    return !!(cell && cell.type !== 'obstacle');
  }, [level]);

  // Executar um comando individual
  const executeCommand = useCallback(
    async (command: Command, state: RobotState): Promise<{ state: RobotState; error?: string }> => {
      let newState = { ...state };

      switch (command.type) {
        case 'move': {
          const [dx, dy] = getDirectionVector(state.direction);
          const newX = state.x + dx;
          const newY = state.y + dy;

          if (!isValidPosition(newX, newY)) {
            return {
              state,
              error: 'Você tentou se mover para um obstáculo ou fora do mapa!',
            };
          }

          newState = { ...state, x: newX, y: newY };
          setExecutionLog(prev => [...prev, `Andou para (${newX}, ${newY})`]);
          break;
        }

        case 'turn': {
          const direction = command.params?.direction || 'right';
          const currentIndex = DIRECTIONS.indexOf(state.direction);
          let newIndex = currentIndex;

          if (direction === 'right') {
            newIndex = (currentIndex + 1) % 4;
          } else if (direction === 'left') {
            newIndex = (currentIndex - 1 + 4) % 4;
          }

          newState = { ...state, direction: DIRECTIONS[newIndex] };
          setExecutionLog(prev => [...prev, `Virou para ${DIRECTIONS[newIndex]}`]);
          break;
        }

        case 'if': {
          // Verificar se há obstáculo à frente
          const [dx, dy] = getDirectionVector(state.direction);
          const nextX = state.x + dx;
          const nextY = state.y + dy;
          const hasObstacle = !isValidPosition(nextX, nextY);

          setExecutionLog(prev => [...prev, `Verificação: Obstáculo à frente? ${hasObstacle ? 'Sim' : 'Não'}`]);

          if (hasObstacle && command.children && command.children.length > 0) {
            // Executar bloco "então" (todos os comandos filhos)
            setExecutionLog(prev => [...prev, 'Executando bloco ENTÃO...']);
            for (const child of command.children) {
              const result = await executeCommand(child, newState);
              if (result.error) return result;
              newState = result.state;
            }
          }
          break;
        }

        case 'loop': {
          const times = command.params?.times || 1;
          setExecutionLog(prev => [...prev, `Iniciando loop: ${times} vezes`]);

          for (let i = 0; i < times; i++) {
            if (command.children && command.children.length > 0) {
              setExecutionLog(prev => [...prev, `Iteração ${i + 1}/${times}`]);
              for (const child of command.children) {
                const result = await executeCommand(child, newState);
                if (result.error) return result;
                newState = result.state;
              }
            }
          }
          break;
        }

        case 'function': {
          const functionId = command.params?.functionId;
          const fnDef = functionDefinitions.find(fn => fn.id === functionId);

          if (!functionId || !fnDef) {
            return {
              state,
              error: 'Função não encontrada. Verifique se ela ainda existe.',
            };
          }

          setExecutionLog(prev => [...prev, `Executando função ${fnDef.name}`]);

          for (const child of fnDef.commands) {
            const result = await executeCommand(child, newState);
            if (result.error) return result;
            newState = result.state;
          }
          break;
        }

        default:
          break;
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      return { state: newState };
    },
    [isValidPosition, functionDefinitions]
  );

  // Executar sequência de comandos
  const executeCommands = useCallback(
    async (commands: Command[]): Promise<ExecutionResult> => {
      setIsExecuting(true);
      setExecutionLog([]);
      let currentState = { ...robotState };
      let stepCount = 0;

      try {
        for (const command of commands) {
          const result = await executeCommand(command, currentState);
          if (result.error) {
            return {
              success: false,
              steps: stepCount,
              message: result.error,
              error: result.error,
              errorBlockId: command.id,
            };
          }
          currentState = result.state;
          stepCount++;
        }

        if (currentState.x === level.goalX && currentState.y === level.goalY) {
          setRobotState({ ...currentState, reachedGoal: true });
          return {
            success: true,
            steps: stepCount,
            message: `Sucesso! Você alcançou a bateria em ${stepCount} passos! 🎉`,
          };
        } else {
          return {
            success: false,
            steps: stepCount,
            message: 'Você não alcançou a bateria. Tente novamente!',
          };
        }
      } catch (error) {
        return {
          success: false,
          steps: stepCount,
          message: 'Erro ao executar os comandos',
          error: String(error),
        };
      } finally {
        setIsExecuting(false);
        setRobotState(currentState);
      }
    },
    [robotState, level, executeCommand]
  );

  const reset = useCallback(() => {
    setRobotState({
      x: level.startX,
      y: level.startY,
      direction: level.startDirection,
      isMoving: false,
      hasCollided: false,
      reachedGoal: false,
    });
    setExecutionLog([]);
  }, [level]);

  return {
    robotState,
    executionLog,
    isExecuting,
    executeCommands,
    reset,
  };
}

function getDirectionVector(direction: Direction): [number, number] {
  const vectors: Record<Direction, [number, number]> = {
    right: [1, 0],
    down: [0, 1],
    left: [-1, 0],
    up: [0, -1],
  };
  return vectors[direction];
}
