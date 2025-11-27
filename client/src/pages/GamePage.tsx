// GamePage.tsx (versão modificada com layout em colunas + mapa reduzido)

import React, { useEffect, useState } from 'react';
import { LEVELS } from '@/data/levels';
import { Level, FunctionDefinition } from '@/types/game';
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
import { useSound } from '@/hooks/useSound';
import { useAudioSettings } from '@/contexts/AudioContext';

interface GamePageProps {
  onBack: () => void;
}

export function GamePage({ onBack }: GamePageProps) {
  const [currentLevelId, setCurrentLevelId] = useState<string | null>(null);
  const [commands, setCommands] = useState<Command[]>([]);
  const [functions, setFunctions] = useState<FunctionDefinition[]>([]);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const { musicEnabled } = useAudioSettings();
  const bgMusic = useSound("/sounds/bg-music.mp3", { loop: true, type: "music" });
  const playExecute = useSound("/sounds/execute.wav", { type: "sfx" });
  const playSuccess = useSound("/sounds/success.wav", { type: "sfx" });
  const playError = useSound("/sounds/error.wav", { type: "sfx" });

  const currentLevel = LEVELS.find(l => l.id === currentLevelId);
  const { robotState, executionLog, isExecuting, executeCommands, reset } = useGameEngine(
    currentLevel || LEVELS[0],
    functions
  );

  useEffect(() => {
    if (musicEnabled) bgMusic.play();
    else bgMusic.stop();
    return () => bgMusic.stop();
  }, [musicEnabled, bgMusic]);

  const handleLevelSelect = (levelId: string) => {
    setCurrentLevelId(levelId);
    setShowLevelSelect(false);
    setCommands([]);
    setFunctions([]);
    setExecutionResult(null);
  };

  const handleExecute = async () => {
    if (commands.length === 0) {
      setExecutionResult({ success: false, message: 'Adicione pelo menos um comando!' });
      return;
    }

    playExecute.play();
    const result = await executeCommands(commands);
    setExecutionResult(result);

    if (result.success) {
      playSuccess.play();
      setShowSuccessDialog(true);
    } else playError.play();
  };

  const handleReset = () => {
    reset();
    setCommands([]);
    setFunctions([]);
    setExecutionResult(null);
  };

  const handleNextLevel = () => {
    const idx = LEVELS.findIndex(l => l.id === currentLevelId);
    if (idx < LEVELS.length - 1) {
      setShowSuccessDialog(false);
      setTimeout(() => handleLevelSelect(LEVELS[idx + 1].id), 100);
    } else {
      setShowLevelSelect(true);
      setShowSuccessDialog(false);
    }
  };

  if (showLevelSelect) {
    return (
      <div className="min-h-screen bg-background text-foreground dark:text-slate-100 p-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none p-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-foreground dark:text-slate-100">
              🤖 Code Crafter: A Jornada do Algoritmo
            </h1>
            <Button variant="outline" onClick={onBack} className="gap-2 dark:text-slate-100">
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LEVELS.map(level => (
              <Card
                key={level.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-400 dark:hover:border-blue-600"
                onClick={() => handleLevelSelect(level.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {level.name}
                  </h3>

                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      level.difficulty === 'easy'
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100'
                        : level.difficulty === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100'
                        : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100'
                    }`}
                  >
                    {level.difficulty === 'easy'
                      ? 'Fácil'
                      : level.difficulty === 'medium'
                      ? 'Médio'
                      : 'Difícil'}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground dark:text-slate-200 mb-4">
                  {level.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {level.allowedCommands.map(cmd => (
                    <span
                      key={cmd}
                      className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 px-2 py-1 rounded"
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
    <div className="min-h-screen bg-background text-foreground dark:text-slate-100 p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none p-6">
        <div className=" absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative min-h-screen max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" onClick={() => setShowLevelSelect(true)} className="gap-2 mb-2 dark:text-slate-100">
              <ChevronLeft className="w-4 h-4" />
              Voltar aos Níveis
            </Button>

            <h1 className="text-3xl font-bold text-foreground dark:text-slate-100">{currentLevel?.name}</h1>
            <p className="text-muted-foreground dark:text-slate-200 mt-1">{currentLevel?.description}</p>
          </div>
        </div>

        {currentLevel?.tutorial && (
          <Card className="p-4 mb-6 bg-blue-50/70 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-600/60">
            <p className="text-sm text-blue-900 dark:text-blue-100"><span className="font-semibold">💡 Dica:</span> {currentLevel.tutorial}</p>
          </Card>
        )}

        {/* === LAYOUT EM 2 COLUNAS === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* MAPA REDUZIDO */}
          <Card className="p-4 max-h-[500px] overflow-auto dark:bg-slate-900/50 dark:border-slate-600/50">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Mapa</h2>

            <div className="max-w-[450px] mx-auto">
              {currentLevel && <GameMap level={currentLevel} robotState={robotState} />}
            </div>
          </Card>

          {/* BLOCO DIREITO: Editor + Execução + Log + Botões */}
          <div className="space-y-4">

            <Card className="p-4 dark:bg-slate-900/50 dark:border-slate-600/50">
              <CommandEditor
                allowedCommands={currentLevel?.allowedCommands || []}
                commands={commands}
                functions={functions}
                onCommandsChange={setCommands}
                onFunctionsChange={setFunctions}
              />
            </Card>

            {executionResult && (
              <Card
                className={`p-4 ${
                  executionResult.success
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/40 dark:border-green-600/40'
                    : 'bg-red-50 border-red-200 dark:bg-red-900/40 dark:border-red-600/40'
                }`}
              >
                <p className={`text-sm font-semibold ${executionResult.success ? 'text-green-700 dark:text-green-100' : 'text-red-700 dark:text-red-100'}`}>
                  {executionResult.message}
                </p>
              </Card>
            )}

            {executionLog.length > 0 && (
              <Card className="p-4 dark:bg-slate-900/50 dark:border-slate-600/50">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Log de Execução</h3>
                <div className="bg-slate-900 dark:bg-slate-900/50 text-green-400 dark:text-green-100 p-3 rounded font-mono text-xs space-y-1 max-h-32 overflow-y-auto">
                  {executionLog.map((log, idx) => <div key={idx}>&gt; {log}</div>)}
                </div>
              </Card>
            )}

            <div className="flex gap-2 dark:text-slate-100">
              <Button
                onClick={handleExecute}
                disabled={isExecuting || commands.length === 0}
                className="flex-1 gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-600/90 dark:hover:bg-green-700/90"
              >
                <Play className="w-4 h-4" />
                {isExecuting ? 'Executando...' : 'Executar'}
              </Button>

              <Button
                onClick={handleReset}
                variant="outline"
                className="gap-2 dark:text-slate-100 dark:hover:bg-slate-600/90 dark:hover:text-slate-100"
              >
                <RotateCcw className="w-4 h-4" />
                Resetar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="dark:bg-slate-900/50 dark:border-slate-600/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-slate-100">🎉 Parabéns!</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="dark:text-slate-200">
            <p>{executionResult?.message}</p>
          </AlertDialogDescription>
          <div className="flex gap-2">
            <AlertDialogCancel className="dark:text-slate-100 dark:hover:bg-slate-600/90">Tentar Novamente</AlertDialogCancel>
            <AlertDialogAction className="dark:text-slate-100 dark:hover:bg-slate-600/90" onClick={handleNextLevel}>Próximo Nível</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
