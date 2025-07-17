import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameBoard } from '@/components/GameBoard';
import { GameUI } from '@/components/GameUI';
import { useGameLogic } from '@/hooks/useGameLogic';
import { WORLDS } from '@/data/worlds';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const Game = () => {
  const { worldId, levelId } = useParams();
  const navigate = useNavigate();
  
  const world = WORLDS.find(w => w.id === parseInt(worldId || '1'));
  const level = world?.levels.find(l => l.id === parseInt(levelId || '1'));
  
  const gameLogic = useGameLogic(world!);
  const { gameState, movePiece, rotatePieceInGame, dropPiece, startGame, pauseGame, resetGame } = gameLogic;
  
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const dropTimeRef = useRef<number>(0);

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.isGameOver || gameState.isPaused) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePieceInGame();
          break;
        case ' ':
          e.preventDefault();
          dropPiece();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          pauseGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isGameOver, gameState.isPaused, movePiece, rotatePieceInGame, dropPiece, pauseGame]);

  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      if (!gameState.isPaused && !gameState.isGameOver) {
        const deltaTime = currentTime - lastTimeRef.current;
        dropTimeRef.current += deltaTime;
        
        const dropInterval = Math.max(100, 1000 - (gameState.level - 1) * 50);
        
        if (dropTimeRef.current >= dropInterval) {
          movePiece('down');
          dropTimeRef.current = 0;
        }
      }
      
      lastTimeRef.current = currentTime;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPaused, gameState.isGameOver, gameState.level, movePiece]);

  if (!world || !level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Nivel no encontrado</h1>
          <Button onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const getBackgroundClasses = () => {
    switch (world.theme) {
      case 'wood':
        return 'bg-gradient-to-b from-wood-bg to-wood-secondary/30';
      case 'brick':
        return 'bg-gradient-to-b from-brick-bg to-brick-secondary/30';
      case 'water':
        return 'bg-gradient-to-b from-water-bg to-water-secondary/30';
      case 'fire':
        return 'bg-gradient-to-b from-fire-bg to-fire-secondary/30';
      case 'ice':
        return 'bg-gradient-to-b from-ice-bg to-ice-secondary/30';
      case 'space':
        return 'bg-gradient-to-b from-space-bg to-space-secondary/30';
      default:
        return 'bg-gradient-to-b from-background to-muted';
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} p-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/worlds')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{world.name}</h1>
              <p className="text-sm text-muted-foreground">
                Nivel {level.number} • Objetivo: {level.targetLines} líneas
                {level.timeLimit && ` • Tiempo: ${Math.floor(level.timeLimit / 60)}:${(level.timeLimit % 60).toString().padStart(2, '0')}`}
              </p>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
          {/* Game Board */}
          <div className="flex justify-center">
            <GameBoard gameState={gameState} world={world} />
          </div>

          {/* UI Panel */}
          <div>
            <GameUI
              gameState={gameState}
              world={world}
              onMovePiece={movePiece}
              onRotatePiece={rotatePieceInGame}
              onDropPiece={dropPiece}
              onPauseGame={pauseGame}
              onResetGame={resetGame}
            />
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4">
          <div className="bg-card/90 backdrop-blur-sm rounded-lg p-4 border">
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => movePiece('left')}
                disabled={gameState.isPaused || gameState.isGameOver}
              >
                ←
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => movePiece('down')}
                disabled={gameState.isPaused || gameState.isGameOver}
              >
                ↓
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => movePiece('right')}
                disabled={gameState.isPaused || gameState.isGameOver}
              >
                →
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={rotatePieceInGame}
                disabled={gameState.isPaused || gameState.isGameOver}
              >
                ↻
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};