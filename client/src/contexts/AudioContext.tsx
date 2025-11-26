import React, { createContext, useContext, useEffect, useState } from "react";

type AudioSettings = {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number; // 0-100
  musicVolume: number; // 0-100
  setSoundEnabled: (value: boolean) => void;
  setMusicEnabled: (value: boolean) => void;
  setSoundVolume: (value: number) => void;
  setMusicVolume: (value: number) => void;
};

const AudioContext = createContext<AudioSettings | undefined>(undefined);

const STORAGE_KEY = "code-crafter-audio";

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(70);
  const [musicVolume, setMusicVolume] = useState(50);

  // Carregar preferências salvas
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.soundEnabled === "boolean") {
          setSoundEnabled(parsed.soundEnabled);
        }
        if (typeof parsed.musicEnabled === "boolean") {
          setMusicEnabled(parsed.musicEnabled);
        }
        if (typeof parsed.soundVolume === "number") {
          setSoundVolume(parsed.soundVolume);
        }
        if (typeof parsed.musicVolume === "number") {
          setMusicVolume(parsed.musicVolume);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Salvar preferências
  useEffect(() => {
    const data = {
      soundEnabled,
      musicEnabled,
      soundVolume,
      musicVolume,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [soundEnabled, musicEnabled, soundVolume, musicVolume]);

  return (
    <AudioContext.Provider
      value={{
        soundEnabled,
        musicEnabled,
        soundVolume,
        musicVolume,
        setSoundEnabled,
        setMusicEnabled,
        setSoundVolume,
        setMusicVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioSettings() {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error("useAudioSettings must be used within AudioProvider");
  }
  return ctx;
}


