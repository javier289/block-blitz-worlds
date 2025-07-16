import { GameState, Tetromino, World } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pause, Play, RotateCw, ArrowDown } from 'lucide-react';

interface GameUIProps {
  gameState: GameState;
  world: World;
  onMovePiece: (direction: 'left' | 'right' | 'down') => void;
  onRotatePiece: () => void;
  onDropPiece: () => void;
  onPauseGame: () => void;
  onResetGame: () => void;
}

export const GameUI = ({
  gameState,
  world,
  onMovePiece,
  onRotatePiece,
  onDropPiece,
  onPauseGame,
  onResetGame
}: GameUIProps) => {
  const { score, lines, level, nextPiece, isPaused, isGameOver } = gameState;

  const getThemeClasses = () => {
    switch (world.theme) {
      case 'wood':
        return 'from-wood-primary to-wood-secondary text-wood-accent';
      case 'brick':
        return 'from-brick-primary to-brick-secondary text-brick-accent';
      case 'water':
        return 'from-water-primary to-water-secondary text-water-accent';
      case 'fire':
        return 'from-fire-primary to-fire-secondary text-fire-accent';
      case 'ice':
        return 'from-ice-primary to-ice-secondary text-ice-accent';
      default:
        return 'from-primary to-secondary text-accent';
    }
  };

  const NextPiecePreview = ({ piece }: { piece: Tetromino | null }) => {
    if (!piece) return null;

    return (
      <div className="grid gap-0.5 p-2 bg-card/50 rounded-lg">
        {piece.shape.map((row, y) => (
          <div key={y} className="flex gap-0.5">
            {row.map((cell, x) => (
              <div
                key={x}
                className="w-4 h-4 rounded-sm border"
                style={{
                  backgroundColor: cell ? piece.color : 'transparent',
                  borderColor: cell ? piece.color : 'transparent'
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Stats Panel */}
      <Card className={`p-4 bg-gradient-to-br ${getThemeClasses()}`}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{score.toLocaleString()}</div>
            <div className="text-sm opacity-80">Puntos</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{lines}</div>
            <div className="text-sm opacity-80">Líneas</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{level}</div>
            <div className="text-sm opacity-80">Nivel</div>
          </div>
        </div>
      </Card>

      {/* Next Piece */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-2">Siguiente</h3>
        <div className="flex justify-center">
          <NextPiecePreview piece={nextPiece} />
        </div>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="lg"
          onClick={onPauseGame}
          disabled={isGameOver}
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={onResetGame}
        >
          Reiniciar
        </Button>
      </div>

      {/* Game Controls */}
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onMovePiece('left')}
            disabled={isPaused || isGameOver}
          >
            ←
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={onRotatePiece}
            disabled={isPaused || isGameOver}
          >
            <RotateCw className="w-5 h-5" />
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onMovePiece('right')}
            disabled={isPaused || isGameOver}
          >
            →
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onMovePiece('down')}
            disabled={isPaused || isGameOver}
          >
            <ArrowDown className="w-5 h-5" />
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={onDropPiece}
            disabled={isPaused || isGameOver}
          >
            Drop
          </Button>
        </div>
      </div>

      {/* Game Over Message */}
      {isGameOver && (
        <Card className="p-4 border-destructive bg-destructive/10">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">¡Juego Terminado!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Puntuación final: {score.toLocaleString()}
            </p>
            <Button onClick={onResetGame} className="w-full">
              Jugar de Nuevo
            </Button>
          </div>
        </Card>
      )}

      {/* Pause Message */}
      {isPaused && !isGameOver && (
        <Card className="p-4 bg-muted/50">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">Juego Pausado</h3>
            <p className="text-sm text-muted-foreground">
              Presiona el botón de pausa para continuar
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};