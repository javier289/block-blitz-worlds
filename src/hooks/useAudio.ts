import { useState, useCallback, useRef, useEffect } from 'react';

// Mapeo de temas a archivos de música
const MUSIC_TRACKS = {
  wood: 'https://www.soundjay.com/misc/sounds/magic-wand-1.mp3', // Placeholder - puedes reemplazar con música real
  brick: 'https://www.soundjay.com/misc/sounds/magic-wand-1.mp3',
  water: 'https://www.soundjay.com/misc/sounds/magic-wand-1.mp3',
  fire: 'https://www.soundjay.com/misc/sounds/magic-wand-1.mp3',
  ice: 'https://www.soundjay.com/misc/sounds/magic-wand-1.mp3',
  space: 'https://www.soundjay.com/misc/sounds/magic-wand-1.mp3',
  tropical: 'https://www.soundjay.com/misc/sounds/magic-wand-1.mp3',
  menu: 'https://www.soundjay.com/misc/sounds/magic-wand-1.mp3'
} as const;

// URLs de efectos de sonido (usando Web Audio API sintética por ahora)
const SOUND_EFFECTS = {
  move: { frequency: 200, duration: 100 },
  rotate: { frequency: 300, duration: 150 },
  drop: { frequency: 150, duration: 200 },
  lineClear: { frequency: 400, duration: 500 },
  gameOver: { frequency: 100, duration: 1000 },
  levelComplete: { frequency: 500, duration: 800 },
  pause: { frequency: 250, duration: 200 }
} as const;

interface AudioSettings {
  musicVolume: number;
  sfxVolume: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

export const useAudio = () => {
  const [settings, setSettings] = useState<AudioSettings>({
    musicVolume: 0.6,
    sfxVolume: 0.8,
    musicEnabled: true,
    sfxEnabled: true
  });

  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Inicializar AudioContext para efectos de sonido
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API no soportada:', error);
    }
  }, []);

  // Crear efecto de sonido sintético
  const createSoundEffect = useCallback((frequency: number, duration: number) => {
    if (!audioContextRef.current || !settings.sfxEnabled) return;

    try {
      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(settings.sfxVolume * 0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration / 1000);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Error creando efecto de sonido:', error);
    }
  }, [settings.sfxEnabled, settings.sfxVolume]);

  // Reproducir música de fondo
  const playMusic = useCallback((theme: keyof typeof MUSIC_TRACKS) => {
    if (!settings.musicEnabled) return;

    const trackUrl = MUSIC_TRACKS[theme];
    
    if (currentTrack === trackUrl && isPlaying) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      const audio = new Audio(trackUrl);
      audio.loop = true;
      audio.volume = settings.musicVolume;
      
      audio.addEventListener('canplaythrough', () => {
        audio.play().catch(error => {
          console.warn('Error reproduciendo música:', error);
        });
      });

      audio.addEventListener('error', () => {
        console.warn('Error cargando música para tema:', theme);
      });

      audioRef.current = audio;
      setCurrentTrack(trackUrl);
      setIsPlaying(true);
    } catch (error) {
      console.warn('Error configurando música:', error);
    }
  }, [settings.musicEnabled, settings.musicVolume, currentTrack, isPlaying]);

  // Pausar música
  const pauseMusic = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  // Reanudar música
  const resumeMusic = useCallback(() => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch(error => {
        console.warn('Error reanudando música:', error);
      });
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Detener música
  const stopMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  }, []);

  // Reproducir efectos de sonido
  const playSFX = useCallback((effect: keyof typeof SOUND_EFFECTS) => {
    const soundConfig = SOUND_EFFECTS[effect];
    createSoundEffect(soundConfig.frequency, soundConfig.duration);
  }, [createSoundEffect]);

  // Actualizar configuración
  const updateSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Actualizar volumen de música si está reproduciéndose
      if (audioRef.current && 'musicVolume' in newSettings) {
        audioRef.current.volume = updated.musicVolume;
      }
      
      // Detener música si se deshabilitó
      if ('musicEnabled' in newSettings && !updated.musicEnabled) {
        stopMusic();
      }
      
      return updated;
    });
  }, [stopMusic]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      stopMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopMusic]);

  return {
    settings,
    updateSettings,
    playMusic,
    pauseMusic,
    resumeMusic,
    stopMusic,
    playSFX,
    isPlaying,
    currentTrack
  };
};

export type { AudioSettings };