import React, { useState } from 'react';
import { Command, CommandType } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Plus, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CommandEditorProps {
  allowedCommands: CommandType[];
  commands: Command[];
  onCommandsChange: (commands: Command[]) => void;
}

const COMMAND_DEFINITIONS: Record<CommandType, { label: string; description: string; icon: string }> = {
  move: {
    label: 'Andar',
    description: 'Move o robô um passo à frente na direção que está virado',
    icon: '👣',
  },
  turn: {
    label: 'Virar',
    description: 'Vira o robô 90 graus para a direita',
    icon: '🔄',
  },
  if: {
    label: 'Se',
    description: 'Executa comandos se uma condição for verdadeira (ex: se houver obstáculo)',
    icon: '❓',
  },
  loop: {
    label: 'Repetir',
    description: 'Repete um conjunto de comandos um número específico de vezes',
    icon: '🔁',
  },
  function: {
    label: 'Função',
    description: 'Agrupa comandos em um bloco reutilizável',
    icon: '📦',
  },
};

export function CommandEditor({ allowedCommands, commands, onCommandsChange }: CommandEditorProps) {
  const [selectedCommand, setSelectedCommand] = useState<CommandType | null>(null);

  const addCommand = (type: CommandType) => {
    const newCommand: Command = {
      id: `cmd-${Date.now()}-${Math.random()}`,
      type,
      label: COMMAND_DEFINITIONS[type].label,
      params: type === 'loop' ? { times: 1 } : type === 'turn' ? { direction: 'right' } : {},
      children: type === 'if' || type === 'loop' ? [] : undefined,
    };
    onCommandsChange([...commands, newCommand]);
  };

  const removeCommand = (id: string) => {
    onCommandsChange(commands.filter(cmd => cmd.id !== id));
  };

  const updateCommand = (id: string, updates: Partial<Command>) => {
    onCommandsChange(
      commands.map(cmd => (cmd.id === id ? { ...cmd, ...updates } : cmd))
    );
  };

  return (
    <div className="space-y-4">
      {/* Paleta de comandos */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Blocos de Comando</h3>
        <div className="grid grid-cols-2 gap-2">
          {allowedCommands.map(cmdType => (
            <div key={cmdType} className="flex items-center gap-2">
              <Button
                onClick={() => addCommand(cmdType)}
                variant="outline"
                size="sm"
                className="flex-1 justify-start"
              >
                <span className="mr-2">{COMMAND_DEFINITIONS[cmdType].icon}</span>
                <span className="text-xs">{COMMAND_DEFINITIONS[cmdType].label}</span>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{COMMAND_DEFINITIONS[cmdType].label}</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    {COMMAND_DEFINITIONS[cmdType].description}
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </Card>

      {/* Área de edição de comandos */}
      <Card className="p-4 min-h-[200px] bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Seu Programa</h3>
        {commands.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm">Arraste blocos de comando aqui para começar</p>
          </div>
        ) : (
          <div className="space-y-2">
            {commands.map((cmd, idx) => (
              <div
                key={cmd.id}
                className="flex items-center gap-2 p-3 bg-white border-l-4 border-blue-500 rounded shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-lg">{COMMAND_DEFINITIONS[cmd.type].icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">
                    {idx + 1}. {COMMAND_DEFINITIONS[cmd.type].label}
                  </p>
                  {cmd.params?.times && (
                    <p className="text-xs text-slate-500">
                      Repetir {cmd.params.times} vezes
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  {cmd.type === 'loop' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const times = cmd.params?.times || 1;
                        updateCommand(cmd.id, {
                          params: { times: Math.max(1, times - 1) },
                        });
                      }}
                    >
                      −
                    </Button>
                  )}
                  {cmd.type === 'loop' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const times = cmd.params?.times || 1;
                        updateCommand(cmd.id, {
                          params: { times: Math.min(10, times + 1) },
                        });
                      }}
                    >
                      +
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCommand(cmd.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Botões de ação */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onCommandsChange([])}
          className="flex-1"
        >
          Limpar Tudo
        </Button>
      </div>
    </div>
  );
}
