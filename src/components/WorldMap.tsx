import { useState, useEffect } from 'react';
import { World, Level } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Lock, Play } from 'lucide-react';

interface WorldMapProps {
  worlds: World[];
  onSelectLevel: (world: World, level: Level) => void;
  onBack: () => void;
}

export const WorldMap = ({ worlds, onSelectLevel, onBack }: WorldMapProps) => {
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [updatedWorlds, setUpdatedWorlds] = useState<World[]>(worlds);

  useEffect(() => {
    // Cargar progreso del localStorage
    const progress = JSON.parse(localStorage.getItem('tetris-progress') || '{"completedLevels": [], "unlockedWorlds": [1]}');
    
    const worldsWithProgress = worlds.map(world => {
      // Determinar si el mundo está desbloqueado
      const isUnlocked = progress.unlockedWorlds.includes(world.id);
      
      // Actualizar niveles con progreso
      const levelsWithProgress = world.levels.map((level, index) => {
        const levelProgress = progress.completedLevels.find((l: any) => l.worldId === world.id && l.levelId === level.id);
        const isCompleted = !!levelProgress && levelProgress.stars > 0;
        
        // El primer nivel siempre está desbloqueado si el mundo está desbloqueado
        // Los siguientes niveles se desbloquean cuando el nivel anterior está completado
        const isLevelUnlocked = isUnlocked && (
          index === 0 || 
          world.levels[index - 1] && 
          progress.completedLevels.some((l: any) => 
            l.worldId === world.id && 
            l.levelId === world.levels[index - 1].id && 
            l.stars > 0
          )
        );
        
        return {
          ...level,
          unlocked: isLevelUnlocked,
          completed: isCompleted,
          stars: levelProgress?.stars || 0
        };
      });

      // Determinar si el mundo está completado
      const isCompleted = levelsWithProgress.every(level => level.completed);

      return {
        ...world,
        unlocked: isUnlocked,
        completed: isCompleted,
        levels: levelsWithProgress
      };
    });

    setUpdatedWorlds(worldsWithProgress);
  }, [worlds]);

  if (selectedWorld) {
    return (
      <LevelMap
        world={selectedWorld}
        onSelectLevel={(level) => onSelectLevel(selectedWorld, level)}
        onBack={() => setSelectedWorld(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold">Block Blitz Worlds</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {updatedWorlds.map((world) => (
            <WorldCard
              key={world.id}
              world={world}
              onSelect={() => world.unlocked && setSelectedWorld(world)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface WorldCardProps {
  world: World;
  onSelect: () => void;
}

const WorldCard = ({ world, onSelect }: WorldCardProps) => {
  const getThemeClasses = () => {
    switch (world.theme) {
      case 'wood':
        return 'border-wood-primary hover:shadow-wood-primary/20';
      case 'brick':
        return 'border-brick-primary hover:shadow-brick-primary/20';
      case 'water':
        return 'border-water-primary hover:shadow-water-primary/20';
      case 'fire':
        return 'border-fire-primary hover:shadow-fire-primary/20';
      case 'ice':
        return 'border-ice-primary hover:shadow-ice-primary/20';
      case 'space':
        return 'border-space-primary hover:shadow-space-primary/20';
      default:
        return 'border-primary hover:shadow-primary/20';
    }
  };

  const completedLevels = world.levels.filter(level => level.completed).length;
  const totalLevels = world.levels.length;

  return (
    <Card
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-300
        hover:scale-105 hover:shadow-xl
        ${getThemeClasses()}
        ${!world.unlocked ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={onSelect}
    >
      <div
        className="h-40 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${world.image})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        
        {!world.unlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-12 h-12 text-white" />
          </div>
        )}

        {world.completed && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-yellow-500 text-yellow-900">
              <Star className="w-4 h-4 mr-1" />
              Completado
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{world.name}</h3>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            {completedLevels}/{totalLevels} niveles
          </span>
          
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor((completedLevels / totalLevels) * 5)
                    ? 'text-yellow-500 fill-current'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>

        {world.unlocked && (
          <Button className="w-full" variant="default">
            <Play className="w-4 h-4 mr-2" />
            Jugar
          </Button>
        )}
      </div>
    </Card>
  );
};

interface LevelMapProps {
  world: World;
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

const LevelMap = ({ world, onSelectLevel, onBack }: LevelMapProps) => {
  const getThemeClasses = () => {
    switch (world.theme) {
      case 'wood':
        return 'from-wood-bg to-wood-secondary';
      case 'brick':
        return 'from-brick-bg to-brick-secondary';
      case 'water':
        return 'from-water-bg to-water-secondary';
      case 'fire':
        return 'from-fire-bg to-fire-secondary';
      case 'ice':
        return 'from-ice-bg to-ice-secondary';
      case 'space':
        return 'from-space-bg to-space-secondary';
      default:
        return 'from-background to-muted';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getThemeClasses()} p-4`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{world.name}</h1>
        </div>

        <div className="grid gap-4 grid-cols-3 md:grid-cols-5">
          {world.levels.map((level) => (
            <LevelButton
              key={level.id}
              level={level}
              world={world}
              onSelect={() => level.unlocked && onSelectLevel(level)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface LevelButtonProps {
  level: Level;
  world: World;
  onSelect: () => void;
}

const LevelButton = ({ level, world, onSelect }: LevelButtonProps) => {
  const getButtonClasses = () => {
    if (!level.unlocked) {
      return 'bg-muted text-muted-foreground cursor-not-allowed';
    }
    
    if (level.completed) {
      switch (world.theme) {
        case 'wood':
          return 'bg-wood-primary hover:bg-wood-secondary text-wood-accent';
        case 'brick':
          return 'bg-brick-primary hover:bg-brick-secondary text-brick-accent';
        case 'water':
          return 'bg-water-primary hover:bg-water-secondary text-water-accent';
        case 'fire':
          return 'bg-fire-primary hover:bg-fire-secondary text-fire-accent';
        case 'ice':
          return 'bg-ice-primary hover:bg-ice-secondary text-ice-accent';
        case 'space':
          return 'bg-space-primary hover:bg-space-secondary text-space-accent';
        default:
          return 'bg-primary hover:bg-primary/80 text-primary-foreground';
      }
    }
    
    return 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border-2 border-dashed border-primary';
  };

  return (
    <Button
      variant="ghost"
      size="lg"
      className={`
        aspect-square relative flex flex-col items-center justify-center
        ${getButtonClasses()}
        transition-all duration-200 hover:scale-105
      `}
      onClick={onSelect}
      disabled={!level.unlocked}
    >
      {!level.unlocked ? (
        <Lock className="w-6 h-6" />
      ) : (
        <>
          <span className="text-xl font-bold">{level.number}</span>
          
          {level.completed && (
            <div className="flex absolute -top-1 -right-1">
              {[...Array(level.stars)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 text-yellow-400 fill-current"
                />
              ))}
            </div>
          )}
          
          {level.timeLimit && (
            <span className="text-xs opacity-70">
              {Math.floor(level.timeLimit / 60)}:{(level.timeLimit % 60).toString().padStart(2, '0')}
            </span>
          )}
        </>
      )}
    </Button>
  );
};