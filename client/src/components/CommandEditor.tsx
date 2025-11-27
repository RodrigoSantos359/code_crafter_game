import React, { useState } from 'react';
import { Command, CommandType, FunctionDefinition } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  functions: FunctionDefinition[];
  onCommandsChange: (commands: Command[]) => void;
  onFunctionsChange: (functions: FunctionDefinition[]) => void;
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

const generateCommandId = () => `cmd-${Date.now()}-${Math.random()}`;

const createCommand = (type: CommandType, options?: { functionId?: string }): Command => ({
  id: generateCommandId(),
  type,
  label: COMMAND_DEFINITIONS[type].label,
  params:
    type === 'loop'
      ? { times: 1 }
      : type === 'turn'
        ? { direction: 'right' }
        : type === 'function'
          ? { functionId: options?.functionId }
          : {},
  children: type === 'if' || type === 'loop' ? [] : undefined,
});

const updateCommandsTree = (commands: Command[], targetId: string, updates: Partial<Command>): Command[] => {
  return commands.map(cmd => {
    if (cmd.id === targetId) {
      return { ...cmd, ...updates };
    }
    if (cmd.children) {
      return { ...cmd, children: updateCommandsTree(cmd.children, targetId, updates) };
    }
    return cmd;
  });
};

const removeCommandFromTree = (commands: Command[], targetId: string): Command[] => {
  return commands
    .filter(cmd => cmd.id !== targetId)
    .map(cmd => (cmd.children ? { ...cmd, children: removeCommandFromTree(cmd.children, targetId) } : cmd));
};

const addChildToTree = (commands: Command[], parentId: string, child: Command): Command[] => {
  return commands.map(cmd => {
    if (cmd.id === parentId && cmd.children) {
      return { ...cmd, children: [...cmd.children, child] };
    }
    if (cmd.children) {
      return { ...cmd, children: addChildToTree(cmd.children, parentId, child) };
    }
    return cmd;
  });
};

const removeFunctionReferences = (commands: Command[], functionId: string): Command[] => {
  return commands
    .filter(cmd => !(cmd.type === 'function' && cmd.params?.functionId === functionId))
    .map(cmd =>
      cmd.children ? { ...cmd, children: removeFunctionReferences(cmd.children, functionId) } : cmd
    );
};

interface CommandItemProps {
  command: Command;
  index: number;
  allowedCommands: CommandType[];
  functions: FunctionDefinition[];
  onUpdate: (id: string, updates: Partial<Command>) => void;
  onRemove: (id: string) => void;
  onAddChild: (parentId: string, type: CommandType) => void;
  level?: number;
}

function CommandItem({
  command,
  index,
  allowedCommands,
  functions,
  onUpdate,
  onRemove,
  onAddChild,
  level = 0,
}: CommandItemProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = (command.type === 'if' || command.type === 'loop') && command.children;
  const referencedFunction = command.type === 'function' ? functions.find(fn => fn.id === command.params?.functionId) : null;
  const childCommandOptions = allowedCommands.filter(cmd => {
    if (cmd === 'if' || cmd === 'loop') return false;
    if (cmd === 'function' && functions.length === 0) return false;
    return true;
  });

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
            {command.type === 'function'
              ? referencedFunction
                ? `${index + 1}. Executar ${referencedFunction.name}`
                : `${index + 1}. Função removida`
              : `${index + 1}. ${COMMAND_DEFINITIONS[command.type].label}`}
          </p>
          {command.params?.times && (
            <p className="text-xs text-slate-500">
              Repetir {command.params.times} vezes
            </p>
          )}
          {command.type === 'function' && !referencedFunction && (
            <p className="text-xs text-red-500">
              Esta função não existe mais. Remova o bloco ou selecione outra função.
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
                  {childCommandOptions.map(cmdType => (
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
              functions={functions}
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
        <div className="text-xs text-slate-800 italic pl-8 py-2">
          Nenhum comando. Clique em + para adicionar.
        </div>
      )}
    </div>
  );
}

export function CommandEditor({
  allowedCommands,
  commands,
  functions,
  onCommandsChange,
  onFunctionsChange,
}: CommandEditorProps) {
  const [functionDialogOpen, setFunctionDialogOpen] = useState(false);
  const [functionTarget, setFunctionTarget] = useState<{ scope: 'root' | 'child'; parentId?: string } | null>(null);
  const functionsUnlocked = allowedCommands.includes('function');

  const handleAddCommand = (type: CommandType) => {
    if (type === 'function') {
      if (!functionsUnlocked || functions.length === 0) return;
      setFunctionTarget({ scope: 'root' });
      setFunctionDialogOpen(true);
      return;
    }
    onCommandsChange([...commands, createCommand(type)]);
  };

  const handleRemoveCommand = (id: string) => {
    onCommandsChange(removeCommandFromTree(commands, id));
  };

  const handleUpdateCommand = (id: string, updates: Partial<Command>) => {
    onCommandsChange(updateCommandsTree(commands, id, updates));
  };

  const handleAddChildCommand = (parentId: string, type: CommandType) => {
    if (type === 'function') {
      if (!functionsUnlocked || functions.length === 0) return;
      setFunctionTarget({ scope: 'child', parentId });
      setFunctionDialogOpen(true);
      return;
    }
    onCommandsChange(addChildToTree(commands, parentId, createCommand(type)));
  };

  const handleFunctionSelected = (functionId: string) => {
    const newCommand = createCommand('function', { functionId });
    if (functionTarget?.scope === 'child' && functionTarget.parentId) {
      onCommandsChange(addChildToTree(commands, functionTarget.parentId, newCommand));
    } else {
      onCommandsChange([...commands, newCommand]);
    }
    setFunctionDialogOpen(false);
    setFunctionTarget(null);
  };

  const handleAddFunction = () => {
    if (!functionsUnlocked) return;
    const newFunction: FunctionDefinition = {
      id: `fn-${Date.now()}-${Math.random()}`,
      name: `Função ${functions.length + 1}`,
      commands: [],
    };
    onFunctionsChange([...functions, newFunction]);
  };

  const handleUpdateFunctionName = (functionId: string, name: string) => {
    if (!functionsUnlocked) return;
    onFunctionsChange(
      functions.map(fn => (fn.id === functionId ? { ...fn, name: name || 'Função' } : fn))
    );
  };

  const handleRemoveFunction = (functionId: string) => {
    if (!functionsUnlocked) return;
    onFunctionsChange(functions.filter(fn => fn.id !== functionId));
    onCommandsChange(removeFunctionReferences(commands, functionId));
  };

  const handleAddCommandToFunction = (functionId: string, type: CommandType) => {
    if (!functionsUnlocked || type === 'function') return;
    onFunctionsChange(
      functions.map(fn =>
        fn.id === functionId ? { ...fn, commands: [...fn.commands, createCommand(type)] } : fn
      )
    );
  };

  const handleUpdateFunctionCommand = (functionId: string, commandId: string, updates: Partial<Command>) => {
    if (!functionsUnlocked) return;
    onFunctionsChange(
      functions.map(fn =>
        fn.id === functionId ? { ...fn, commands: updateCommandsTree(fn.commands, commandId, updates) } : fn
      )
    );
  };

  const handleRemoveFunctionCommand = (functionId: string, commandId: string) => {
    if (!functionsUnlocked) return;
    onFunctionsChange(
      functions.map(fn =>
        fn.id === functionId ? { ...fn, commands: removeCommandFromTree(fn.commands, commandId) } : fn
      )
    );
  };

  const handleAddFunctionChildCommand = (functionId: string, parentId: string, type: CommandType) => {
    if (!functionsUnlocked || type === 'function') return;
    onFunctionsChange(
      functions.map(fn =>
        fn.id === functionId
          ? { ...fn, commands: addChildToTree(fn.commands, parentId, createCommand(type)) }
          : fn
      )
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
                onClick={() => handleAddCommand(cmdType)}
                variant="outline"
                size="sm"
                disabled={cmdType === 'function' && functions.length === 0}
                className="flex-1 justify-start disabled:opacity-50"
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
        {allowedCommands.includes('function') && functions.length === 0 && (
          <p className="text-[11px] text-slate-500 mt-3">
            Crie uma função no painel abaixo para liberar o bloco "Função".
          </p>
        )}
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
                functions={functions}
                onUpdate={handleUpdateCommand}
                onRemove={handleRemoveCommand}
                onAddChild={handleAddChildCommand}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Funções personalizadas */}
      {functionsUnlocked ? (
        <Card className="p-4 bg-purple-50/70 border-purple-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-purple-900">Funções personalizadas</h3>
              <p className="text-xs text-purple-700">
                Agrupe passos repetidos e reutilize com o bloco "Função".
              </p>
            </div>
            <Button size="sm" variant="secondary" onClick={handleAddFunction}>
              Nova função
            </Button>
          </div>

          {functions.length === 0 ? (
            <p className="text-xs text-purple-700 bg-white/70 border border-dashed border-purple-200 rounded p-3">
              Nenhuma função criada. Clique em "Nova função" para começar e depois preencha os comandos que
              serão reutilizados.
            </p>
          ) : (
            functions.map((fn, idx) => (
              <div key={fn.id} className="bg-white rounded border border-purple-100 p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={fn.name}
                    onChange={e => handleUpdateFunctionName(fn.id, e.target.value)}
                    placeholder={`Função ${idx + 1}`}
                    className="text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFunction(fn.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {fn.commands.length === 0 ? (
                  <p className="text-xs text-slate-500 border border-dashed rounded p-2">
                    Nenhum comando nesta função ainda.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {fn.commands.map((cmd, fnIdx) => (
                      <CommandItem
                        key={cmd.id}
                        command={cmd}
                        index={fnIdx}
                        allowedCommands={allowedCommands}
                        functions={functions}
                        onUpdate={(id, updates) => handleUpdateFunctionCommand(fn.id, id, updates)}
                        onRemove={id => handleRemoveFunctionCommand(fn.id, id)}
                        onAddChild={(parentId, type) => handleAddFunctionChildCommand(fn.id, parentId, type)}
                      />
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-50">
                  {allowedCommands
                    .filter(cmd => cmd !== 'function')
                    .map(cmdType => (
                      <Button
                        key={cmdType}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddCommandToFunction(fn.id, cmdType)}
                        className="text-xs"
                      >
                        <span className="mr-1">{COMMAND_DEFINITIONS[cmdType].icon}</span>
                        {COMMAND_DEFINITIONS[cmdType].label}
                      </Button>
                    ))}
                </div>
              </div>
            ))
          )}
        </Card>
      ) : (
        <Card className="p-4 border-dashed border-slate-200 bg-slate-50">
          <h3 className="text-sm font-semibold text-slate-700 mb-1">Funções bloqueadas</h3>
          <p className="text-xs text-slate-600">
            Complete o nível que introduz o bloco "Função" para desbloquear este painel e criar blocos
            reutilizáveis.
          </p>
        </Card>
      )}

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

      {/* Seleção de função para o bloco */}
      <Dialog
        open={functionDialogOpen}
        onOpenChange={open => {
          setFunctionDialogOpen(open);
          if (!open) {
            setFunctionTarget(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolha uma função para executar</DialogTitle>
            <DialogDescription>
              O bloco "Função" executará todos os comandos definidos no bloco escolhido.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {functions.map(fn => (
              <Button
                key={fn.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleFunctionSelected(fn.id)}
              >
                {fn.name}
              </Button>
            ))}
          </div>
          {functions.length === 0 && (
            <p className="text-sm text-slate-500">Crie uma função primeiro.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
