import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Volume2, VolumeX, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { theme, setTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState([70]);
  const [musicVolume, setMusicVolume] = useState([50]);
  const [difficulty, setDifficulty] = useState("medio");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  const handleReset = () => {
    setSoundEnabled(true);
    setMusicEnabled(true);
    setSoundVolume([70]);
    setMusicVolume([50]);
    setDifficulty("medio");
    setAnimationsEnabled(true);
    setTheme("light");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative min-h-screen p-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar ao Menu
          </Button>

          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⚙️</div>
            <h1 className="text-5xl font-bold text-slate-800 mb-2">Configurações</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Personalize sua experiência de jogo
            </p>
          </div>
        </div>

        {/* Configurações */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Áudio */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              Áudio
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound" className="text-base">Efeitos Sonoros</Label>
                  <p className="text-sm text-slate-600">Ativar sons de ações e eventos</p>
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
                    <Label htmlFor="sound-volume" className="text-base">Volume dos Efeitos</Label>
                    <span className="text-sm text-slate-600">{soundVolume[0]}%</span>
                  </div>
                  <Slider
                    id="sound-volume"
                    value={soundVolume}
                    onValueChange={setSoundVolume}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="music" className="text-base">Música de Fundo</Label>
                  <p className="text-sm text-slate-600">Ativar música ambiente</p>
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
                    <Label htmlFor="music-volume" className="text-base">Volume da Música</Label>
                    <span className="text-sm text-slate-600">{musicVolume[0]}%</span>
                  </div>
                  <Slider
                    id="music-volume"
                    value={musicVolume}
                    onValueChange={setMusicVolume}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Aparência */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Aparência
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-base">Tema</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme" className="w-full">
                    <SelectValue placeholder="Selecione um tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Claro
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Escuro
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations" className="text-base">Animações</Label>
                  <p className="text-sm text-slate-600">Ativar animações e transições</p>
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
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Jogo</h2>
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-base">Dificuldade</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty" className="w-full">
                  <SelectValue placeholder="Selecione a dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facil">Fácil - Ideal para iniciantes</SelectItem>
                  <SelectItem value="medio">Médio - Desafio equilibrado</SelectItem>
                  <SelectItem value="dificil">Difícil - Para programadores experientes</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-slate-600 mt-2">
                A dificuldade afeta a complexidade dos níveis e a quantidade de dicas disponíveis
              </p>
            </div>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={handleReset}>
              Restaurar Padrões
            </Button>
            <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
              Salvar e Voltar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

