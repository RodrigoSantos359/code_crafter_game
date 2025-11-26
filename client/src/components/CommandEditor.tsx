import React, { useState } from 'react';
import { Command, CommandType } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Plus, HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
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

interface CommandItemProps {
  command: Command;
  index: number;
  allowedCommands: CommandType[];
  onUpdate: (id: string, updates: Partial<Command>) => void;
  onRemove: (id: string) => void;
  onAddChild: (parentId: string, type: CommandType) => void;
  level?: number;
}

function CommandItem({
  command,
  index,
  allowedCommands,
  onUpdate,
  onRemove,
  onAddChild,
  level = 0,
}: CommandItemProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = (command.type === 'if' || command.type === 'loop') && command.children;

  return (
    <div style={{ marginLeft: `${level * 20}px` }} className="space-y-1">
      <div className="flex items-center gap-2 p-3 bg-white border-l-4 border-blue-500 rounded shadow-sm hover:shadow-md transition-shadow">
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-slate-100 rounded"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}

        <span className="text-lg">{COMMAND_DEFINITIONS[command.type].icon}</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-700">
            {index + 1}. {COMMAND_DEFINITIONS[command.type].label}
          </p>
          {command.params?.times && (
            <p className="text-xs text-slate-500">
              Repetir {command.params.times} vezes
            </p>
          )}
        </div>

        <div className="flex gap-1">
          {command.type === 'loop' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const times = command.params?.times || 1;
                  onUpdate(command.id, {
                    params: { times: Math.max(1, times - 1) },
                  });
                }}
              >
                −
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const times = command.params?.times || 1;
                  onUpdate(command.id, {
                    params: { times: Math.min(10, times + 1) },
                  });
                }}
              >
                +
              </Button>
            </>
          )}

          {(command.type === 'if' || command.type === 'loop') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar comando a {COMMAND_DEFINITIONS[command.type].label}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2">
                  {allowedCommands
                    .filter(cmd => cmd !== 'if' && cmd !== 'loop' && cmd !== 'function')
                    .map(cmdType => (
                      <Button
                        key={cmdType}
                        variant="outline"
                        onClick={() => {
                          onAddChild(command.id, cmdType);
                        }}
                        className="justify-start"
                      >
                        <span className="mr-2">{COMMAND_DEFINITIONS[cmdType].icon}</span>
                        {COMMAND_DEFINITIONS[cmdType].label}
                      </Button>
                    ))}
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(command.id)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Comandos filhos */}
      {expanded && hasChildren && command.children && command.children.length > 0 && (
        <div className="space-y-1 border-l-2 border-blue-300 pl-2">
          {command.children.map((child, childIdx) => (
            <CommandItem
              key={child.id}
              command={child}
              index={childIdx}
              allowedCommands={allowedCommands}
              onUpdate={onUpdate}
              onRemove={(id) => {
                onUpdate(command.id, {
                  children: command.children?.filter(c => c.id !== id),
                });
              }}
              onAddChild={onAddChild}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {expanded && hasChildren && (!command.children || command.children.length === 0) && (
        <div className="text-xs text-slate-400 italic pl-8 py-2">
          Nenhum comando. Clique em + para adicionar.
        </div>
      )}
    </div>
  );
}

export function CommandEditor({ allowedCommands, commands, onCommandsChange }: CommandEditorProps) {
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
    const updateRecursive = (cmds: Command[]): Command[] => {
      return cmds.map(cmd => {
        if (cmd.id === id) {
          return { ...cmd, ...updates };
        }
        if (cmd.children) {
          return { ...cmd, children: updateRecursive(cmd.children) };
        }
        return cmd;
      });
    };
    onCommandsChange(updateRecursive(commands));
  };

  const addChildCommand = (parentId: string, type: CommandType) => {
    const newChild: Command = {
      id: `cmd-${Date.now()}-${Math.random()}`,
      type,
      label: COMMAND_DEFINITIONS[type].label,
      params: type === 'turn' ? { direction: 'right' } : {},
    };

    const addToParent = (cmds: Command[]): Command[] => {
      return cmds.map(cmd => {
        if (cmd.id === parentId && cmd.children) {
          return { ...cmd, children: [...cmd.children, newChild] };
        }
        if (cmd.children) {
          return { ...cmd, children: addToParent(cmd.children) };
        }
        return cmd;
      });
    };

    onCommandsChange(addToParent(commands));
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
              <CommandItem
                key={cmd.id}
                command={cmd}
                index={idx}
                allowedCommands={allowedCommands}
                onUpdate={updateCommand}
                onRemove={removeCommand}
                onAddChild={addChildCommand}
              />
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
