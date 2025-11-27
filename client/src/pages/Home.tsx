import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { GamePage } from './GamePage';
import { TutorialsPage } from './TutorialsPage';
import { SettingsPage } from './SettingsPage';
import { BookOpen, Settings, Play } from 'lucide-react';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'menu' | 'game' | 'tutorials' | 'settings'>('menu');

  if (currentPage === 'game') {
    return <GamePage onBack={() => setCurrentPage('menu')} />;
  }

  if (currentPage === 'tutorials') {
    return <TutorialsPage onBack={() => setCurrentPage('menu')} />;
  }

  if (currentPage === 'settings') {
    return <SettingsPage onBack={() => setCurrentPage('menu')} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/40 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
        {/* Logo e Título */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-5xl font-bold text-foreground mb-2">{APP_TITLE}</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Uma aventura de quebra-cabeças onde você programa um robô para superar obstáculos
          </p>
        </div>

        {/* Menu Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          {/* Botão Jogar */}
          <Card className="p-8 text-center hover:shadow-xl transition-all cursor-pointer hover:scale-105"
            onClick={() => setCurrentPage('game')}>
            <div className="text-5xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Jogar</h2>
            <p className="text-muted-foreground mb-1 text-sm">Comece sua jornada e aprenda programação de forma divertida</p>
            <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4" />
              Começar
            </Button>
          </Card>

          {/* Botão Tutoriais */}
          <Card className="p-8 text-center hover:shadow-xl transition-all cursor-pointer hover:scale-105"
            onClick={() => setCurrentPage('tutorials')}>
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Tutoriais</h2>
            <p className="text-muted-foreground mb-1 text-sm">Aprenda os conceitos básicos de programação</p>
            <Button variant="outline" className="w-full gap-2">
              <BookOpen className="w-4 h-4" />
              Ver Tutoriais
            </Button>
          </Card>

          {/* Botão Configurações */}
          <Card className="p-8 text-center hover:shadow-xl transition-all cursor-pointer hover:scale-105"
            onClick={() => setCurrentPage('settings')}>
            <div className="text-5xl mb-4">⚙️</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Configurações</h2>
            <p className="text-muted-foreground mb-1 text-sm">Ajuste o som, dificuldade e preferências</p>
            <Button variant="outline" className="w-full gap-2">
              <Settings className="w-4 h-4" />
              Configurar
            </Button>
          </Card>
        </div>

        {/* Informações sobre o jogo */}
        <div className="mt-16 max-w-2xl text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">O que você vai aprender</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '📝', label: 'Sequência' },
              { icon: '❓', label: 'Condicionais' },
              { icon: '🔁', label: 'Laços' },
              { icon: '📦', label: 'Funções' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm font-semibold text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
