import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Volume2, VolumeX, Monitor, Moon, Sun, Brain } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAudioSettings } from "@/contexts/AudioContext";

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { theme, setTheme } = useTheme();
  const {
    soundEnabled,
    musicEnabled,
    soundVolume,
    musicVolume,
    setSoundEnabled,
    setMusicEnabled,
    setSoundVolume,
    setMusicVolume,
  } = useAudioSettings();

  const [localSoundVolume, setLocalSoundVolume] = useState([soundVolume]);
  const [localMusicVolume, setLocalMusicVolume] = useState([musicVolume]);
  const [difficulty, setDifficulty] = useState("medio");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Mantém sliders sincronizados com contexto se mudarem fora da página
  useEffect(() => {
    setLocalSoundVolume([soundVolume]);
  }, [soundVolume]);

  useEffect(() => {
    setLocalMusicVolume([musicVolume]);
  }, [musicVolume]);

  const handleReset = () => {
    setSoundEnabled(true);
    setMusicEnabled(true);
    setSoundVolume(70);
    setMusicVolume(50);
    setLocalSoundVolume([70]);
    setLocalMusicVolume([50]);
    setDifficulty("medio");
    setAnimationsEnabled(true);
    setTheme("light");
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:text-slate-100 p-6">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none p-6">
        <div className=" absolute top-0 right-0 w-96 h-96 
  bg-blue-200 dark:bg-blue-900 
  rounded-full mix-blend-multiply filter blur-3xl opacity-20
"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 
  bg-purple-200 dark:bg-purple-900 
  rounded-full mix-blend-multiply filter blur-3xl opacity-20
"></div>
      </div>

      <div className="relative min-h-screen">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 gap-2 dark:text-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar ao Menu
          </Button>

          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⚙️</div>
            <h1 className="text-5xl font-bold text-foreground dark:text-slate-100 mb-2">Configurações</h1>
            <p className="text-xl text-muted-foreground dark:text-slate-200 max-w-2xl mx-auto">
              Personalize sua experiência de jogo
            </p>
          </div>
        </div>

        {/* Configurações */}
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Áudio */}
          <Card className="p-6 dark:bg-slate-900/50 dark:border-slate-600/50">
            <h2 className="text-2xl font-bold text-foreground dark:text-slate-100 mb-6 flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              Áudio
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 dark:text-slate-100">
                  <Label htmlFor="sound" className="text-base dark:text-slate-100">Efeitos Sonoros</Label>
                  <p className="text-sm text-muted-foreground dark:text-slate-200">Ativar sons de ações e eventos</p>
                </div>
                <Switch
                  id="sound"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>

              {soundEnabled && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound-volume" className="text-base dark:text-slate-100">Volume dos Efeitos</Label>
                    <span className="text-sm text-muted-foreground dark:text-slate-200">{localSoundVolume[0]}%</span>
                  </div>
                  <Slider
                    id="sound-volume"
                    value={localSoundVolume}
                    onValueChange={value => setLocalSoundVolume(value)}
                    onValueCommit={value => setSoundVolume(value[0] ?? 0)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 dark:text-slate-100">
                  <Label htmlFor="music" className="text-base">Música de Fundo</Label>
                  <p className="text-sm text-muted-foreground dark:text-slate-200">Ativar música ambiente</p>
                </div>
                <Switch
                  id="music"
                  checked={musicEnabled}
                  onCheckedChange={setMusicEnabled}
                />
              </div>

              {musicEnabled && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="music-volume" className="text-base dark:text-slate-100">Volume da Música</Label>
                    <span className="text-sm text-muted-foreground dark:text-slate-200">{localMusicVolume[0]}%</span>
                  </div>
                  <Slider
                    id="music-volume"
                    value={localMusicVolume}
                    onValueChange={value => setLocalMusicVolume(value)}
                    onValueCommit={value => setMusicVolume(value[0] ?? 0)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Aparência */}
          <Card className="p-6 dark:bg-slate-900/50 dark:border-slate-600/50">
            <h2 className="text-2xl font-bold text-foreground dark:text-slate-100 mb-6 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Aparência
            </h2>
            <div className="space-y-6">
              <div className="space-y-2 dark:text-slate-100">
                <Label htmlFor="theme" className="text-base dark:text-slate-100">Tema</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme" className="w-full dark:bg-slate-900/50 dark:border-slate-600/50">
                    <SelectValue placeholder="Selecione um tema" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-900/50 dark:border-slate-600/50">
                    <SelectItem value="light">
                      <div className="flex items-center gap-2 dark:text-slate-100">
                        <Sun className="w-4 h-4" />
                        Claro
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2 dark:text-slate-100">
                        <Moon className="w-4 h-4" />
                        Escuro
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 dark:text-slate-100">
                  <Label htmlFor="animations" className="text-base dark:text-slate-100 dark:text-slate-200">Animações</Label>
                  <p className="text-sm text-muted-foreground dark:text-slate-200">Ativar animações e transições</p>
                </div>
                <Switch
                  id="animations"
                  checked={animationsEnabled}
                  onCheckedChange={setAnimationsEnabled}
                />
              </div>
            </div>
          </Card>

          {/* Jogo */}
          <Card className="p-6 dark:bg-slate-900/50 dark:border-slate-600/50">
            <h2 className="text-2xl font-bold text-foreground dark:text-slate-100 mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Jogo
            </h2>
            <div className="space-y-2 dark:text-slate-100">
              <Label htmlFor="difficulty" className="text-base dark:text-slate-100 dark:text-slate-200">Dificuldade</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty" className="w-full dark:bg-slate-900/50 dark:border-slate-600/50">
                  <SelectValue placeholder="Selecione a dificuldade" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-900/50 dark:border-slate-600/50">
                  <SelectItem value="facil">
                    <div className="flex items-center gap-2 dark:text-slate-100">
                      <Sun className="w-4 h-4" />
                      Fácil - Ideal para iniciantes
                    </div>
                  </SelectItem>
                  <SelectItem value="medio">
                    <div className="flex items-center gap-2 dark:text-slate-100">
                      <Moon className="w-4 h-4" />
                      Médio - Desafio equilibrado
                    </div>
                  </SelectItem>
                  <SelectItem value="dificil">
                    <div className="flex items-center gap-2 dark:text-slate-100">
                      <Sun className="w-4 h-4" />
                      Difícil - Para programadores experientes
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground dark:text-slate-200 mt-2">
                A dificuldade afeta a complexidade dos níveis e a quantidade de dicas disponíveis
              </p>
            </div>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-end dark:text-slate-100">
            <Button variant="outline" onClick={handleReset}>
              Restaurar Padrões
            </Button>
            <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600/90 dark:hover:bg-blue-700/90 dark:text-slate-100">
              Salvar e Voltar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

