import { Volume2, VolumeX, Music, Speaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AudioSettings } from "@/hooks/useAudio";

interface AudioControlsProps {
  settings: AudioSettings;
  onUpdateSettings: (settings: Partial<AudioSettings>) => void;
  isPlaying: boolean;
  className?: string;
}

export const AudioControls = ({ 
  settings, 
  onUpdateSettings, 
  isPlaying,
  className = "" 
}: AudioControlsProps) => {
  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Music className="w-5 h-5" />
          Configuración de Audio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Control de Música */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="music-enabled" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Música de Fondo
            </Label>
            <Switch
              id="music-enabled"
              checked={settings.musicEnabled}
              onCheckedChange={(checked) => 
                onUpdateSettings({ musicEnabled: checked })
              }
            />
          </div>
          
          {settings.musicEnabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Volumen</span>
                <span>{Math.round(settings.musicVolume * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={[settings.musicVolume]}
                  onValueChange={(value) => 
                    onUpdateSettings({ musicVolume: value[0] })
                  }
                  max={1}
                  min={0}
                  step={0.1}
                  className="flex-1"
                />
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </div>
              {isPlaying && (
                <div className="text-xs text-muted-foreground text-center">
                  ♪ Reproduciendo música temática ♪
                </div>
              )}
            </div>
          )}
        </div>

        {/* Control de Efectos de Sonido */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="sfx-enabled" className="flex items-center gap-2">
              <Speaker className="w-4 h-4" />
              Efectos de Sonido
            </Label>
            <Switch
              id="sfx-enabled"
              checked={settings.sfxEnabled}
              onCheckedChange={(checked) => 
                onUpdateSettings({ sfxEnabled: checked })
              }
            />
          </div>
          
          {settings.sfxEnabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Volumen</span>
                <span>{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={[settings.sfxVolume]}
                  onValueChange={(value) => 
                    onUpdateSettings({ sfxVolume: value[0] })
                  }
                  max={1}
                  min={0}
                  step={0.1}
                  className="flex-1"
                />
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Botón de prueba de efectos */}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            // Aquí podrías agregar un callback para probar efectos
          }}
        >
          Probar Efectos de Sonido
        </Button>
      </CardContent>
    </Card>
  );
};