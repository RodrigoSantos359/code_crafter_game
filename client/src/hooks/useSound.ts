import { useEffect, useRef } from "react";
import { useAudioSettings } from "@/contexts/AudioContext";

type SoundType = "music" | "sfx";

interface UseSoundOptions {
  loop?: boolean;
  type?: SoundType;
}

export function useSound(src: string, { loop = false, type = "sfx" }: UseSoundOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { soundEnabled, musicEnabled, soundVolume, musicVolume } = useAudioSettings();

  // Criar/atualizar o elemento de áudio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
    }
    const audio = audioRef.current;
    audio.loop = loop;
    return () => {
      audio.pause();
    };
  }, [src, loop]);

  // Atualizar volume e estado de mute conforme configurações
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const enabled = type === "music" ? musicEnabled : soundEnabled;
    const volumePercent = type === "music" ? musicVolume : soundVolume;

    audio.muted = !enabled;
    audio.volume = Math.max(0, Math.min(1, volumePercent / 100));
  }, [soundEnabled, musicEnabled, soundVolume, musicVolume, type]);

  const play = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const enabled = type === "music" ? musicEnabled : soundEnabled;
    if (!enabled) return;
    // Para SFX, reinicia do começo
    if (!loop) {
      audio.currentTime = 0;
    }
    void audio.play().catch(() => {
      // algumas vezes o navegador bloqueia autoplay; ignorar erro
    });
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    if (!loop) {
      audio.currentTime = 0;
    }
  };

  return { play, stop };
}


