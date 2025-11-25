import React, { useState } from 'react';
import { LEVELS } from '@/data/levels';
import { Level } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GameMap } from '@/components/GameMap';
import { CommandEditor } from '@/components/CommandEditor';
import { useGameEngine } from '@/hooks/useGameEngine';
import { Command } from '@/types/game';
import { ChevronLeft, Play, RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface GamePageProps {
  onBack: () => void;
}

export function GamePage({ onBack }: GamePageProps) {
  const [currentLevelId, setCurrentLevelId] = useState<string | null>(null);
  const [commands, setCommands] = useState<Command[]>([]);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const currentLevel = LEVELS.find(l => l.id === currentLevelId);
  const { robotState, executionLog, isExecuting, executeCommands, reset } = useGameEngine(
    currentLevel || LEVELS[0]
  );

  const handleLevelSelect = (levelId: string) => {
    setCurrentLevelId(levelId);
    setShowLevelSelect(false);
    setCommands([]);
    setExecutionResult(null);
  };

  const handleExecute = async () => {
    if (commands.length === 0) {
      setExecutionResult({
        success: false,
        message: 'Adicione pelo menos um comando!',
      });
      return;
    }

    const result = await executeCommands(commands);
    setExecutionResult(result);

    if (result.success) {
      setShowSuccessDialog(true);
    }
  };

  const handleReset = () => {
    reset();
    setCommands([]);
    setExecutionResult(null);
  };

  const handleNextLevel = () => {
    const currentIndex = LEVELS.findIndex(l => l.id === currentLevelId);
    if (currentIndex < LEVELS.length - 1) {
      handleLevelSelect(LEVELS[currentIndex + 1].id);
    } else {
      setShowLevelSelect(true);
    }
    setShowSuccessDialog(false);
  };

  if (showLevelSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-slate-800">
              🤖 Code Crafter: A Jornada do Algoritmo
            </h1>
            <Button variant="outline" onClick={onBack} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LEVELS.map(level => (
              <Card
                key={level.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-400"
                onClick={() => handleLevelSelect(level.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-800">{level.name}</h3>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      level.difficulty === 'easy'
                        ? 'bg-green-100 text-green-700'
                        : level.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {level.difficulty === 'easy'
                      ? 'Fácil'
                      : level.difficulty === 'medium'
                        ? 'Médio'
                        : 'Difícil'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">{level.description}</p>
                <div className="flex flex-wrap gap-1">
                  {level.allowedCommands.map(cmd => (
                    <span
                      key={cmd}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      {cmd}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button
              variant="outline"
              onClick={() => setShowLevelSelect(true)}
              className="gap-2 mb-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar aos Níveis
            </Button>
            <h1 className="text-3xl font-bold text-slate-800">{currentLevel?.name}</h1>
            <p className="text-slate-600 mt-1">{currentLevel?.description}</p>
          </div>
        </div>

        {/* Tutorial */}
        {currentLevel?.tutorial && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">💡 Dica:</span> {currentLevel.tutorial}
            </p>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna esquerda: Mapa */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Mapa</h2>
              {currentLevel && <GameMap level={currentLevel} robotState={robotState} />}
            </Card>
          </div>

          {/* Coluna direita: Editor e Controles */}
          <div className="lg:col-span-2 space-y-4">
            {/* Editor de Comandos */}
            <Card className="p-4">
              <CommandEditor
                allowedCommands={currentLevel?.allowedCommands || []}
                commands={commands}
                onCommandsChange={setCommands}
              />
            </Card>

            {/* Resultado da Execução */}
            {executionResult && (
              <Card
                className={`p-4 ${
                  executionResult.success
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    executionResult.success ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {executionResult.message}
                </p>
                {executionResult.error && (
                  <p className="text-xs text-red-600 mt-2">{executionResult.error}</p>
                )}
              </Card>
            )}

            {/* Log de Execução */}
            {executionLog.length > 0 && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-slate-800 mb-2">Log de Execução</h3>
                <div className="bg-slate-900 text-green-400 p-3 rounded font-mono text-xs space-y-1 max-h-32 overflow-y-auto">
                  {executionLog.map((log, idx) => (
                    <div key={idx}>
                      &gt; {log}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-2">
              <Button
                onClick={handleExecute}
                disabled={isExecuting || commands.length === 0}
                className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4" />
                {isExecuting ? 'Executando...' : 'Executar'}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Resetar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de Sucesso */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🎉 Parabéns!</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {executionResult?.message}
          </AlertDialogDescription>
          <div className="flex gap-2">
            <AlertDialogCancel onClick={() => setShowSuccessDialog(false)}>
              Tentar Novamente
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleNextLevel}>
              Próximo Nível
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
