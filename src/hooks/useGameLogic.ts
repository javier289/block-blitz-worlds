import { useState, useCallback, useEffect } from 'react';
import { GameState, Tetromino, Block, TetrominoType, World, Level } from '@/types/game';
import { useToast } from '@/hooks/use-toast';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const TETROMINO_SHAPES: Record<TetrominoType, number[][]> = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]]
};

const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00f5ff',
  O: '#ffff00',
  T: '#800080',
  S: '#00ff00',
  Z: '#ff0000',
  J: '#0000ff',
  L: '#ff8c00'
};

export const useGameLogic = (world: World, currentLevel?: Level, onLevelComplete?: (nextLevelId?: number) => void) => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)),
    currentPiece: null,
    nextPiece: null,
    score: 0,
    lines: 0,
    level: 1,
    isGameOver: false,
    isPaused: false
  });

  // Reiniciar el juego cuando cambie el nivel
  useEffect(() => {
    if (currentLevel) {
      console.log('Level changed, resetting game state for level:', currentLevel.number);
      setGameState({
        board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)),
        currentPiece: createRandomTetromino(),
        nextPiece: createRandomTetromino(),
        score: 0,
        lines: 0,
        level: currentLevel.number,
        isGameOver: false,
        isPaused: false
      });
    }
  }, [currentLevel?.id]);

  // Verificar si se cumplió el objetivo del nivel
  const checkLevelComplete = useCallback((lines: number) => {
    console.log('Checking level complete:', { lines, targetLines: currentLevel?.targetLines, currentLevel });
    if (currentLevel && lines >= currentLevel.targetLines) {
      console.log('Level completed! Stars calculation...');
      // Nivel completado
      const stars = lines >= currentLevel.targetLines * 1.5 ? 3 : 
                    lines >= currentLevel.targetLines * 1.2 ? 2 : 1;
      
      // Guardar progreso en localStorage
      const progress = JSON.parse(localStorage.getItem('tetris-progress') || '{"completedLevels": [], "unlockedWorlds": [1]}');
      
      // Marcar nivel como completado
      const existingLevel = progress.completedLevels.find((l: any) => l.worldId === world.id && l.levelId === currentLevel.id);
      if (!existingLevel) {
        progress.completedLevels.push({
          worldId: world.id,
          levelId: currentLevel.id,
          stars: stars
        });
      } else {
        existingLevel.stars = Math.max(existingLevel.stars, stars);
      }

      // Desbloquear siguiente nivel/mundo
      const nextLevel = world.levels.find(l => l.number === currentLevel.number + 1);
      if (nextLevel) {
        // Desbloquear siguiente nivel del mismo mundo
        const nextLevelProgress = progress.completedLevels.find((l: any) => l.worldId === world.id && l.levelId === nextLevel.id);
        if (!nextLevelProgress) {
          progress.completedLevels.push({
            worldId: world.id,
            levelId: nextLevel.id,
            stars: 0
          });
        }
      } else {
        // Es el último nivel del mundo, desbloquear siguiente mundo
        const nextWorldId = world.id + 1;
        if (nextWorldId <= 6 && !progress.unlockedWorlds.includes(nextWorldId)) {
          progress.unlockedWorlds.push(nextWorldId);
        }
      }

      localStorage.setItem('tetris-progress', JSON.stringify(progress));
      
      // Usar setTimeout para evitar problemas de render
      setTimeout(() => {
        toast({
          title: "¡Nivel Completado!",
          description: `${stars} estrella${stars > 1 ? 's' : ''} obtenida${stars > 1 ? 's' : ''}`,
        });
      }, 100);

      // Navegar automáticamente al siguiente nivel después de un breve retraso
      setTimeout(() => {
        console.log('Navigating to next level...');
        const currentLevelIndex = world.levels.findIndex(l => l.id === currentLevel?.id);
        console.log('Current level index:', currentLevelIndex, 'Total levels:', world.levels.length);
        if (currentLevelIndex !== -1 && currentLevelIndex < world.levels.length - 1) {
          const nextLevel = world.levels[currentLevelIndex + 1];
          console.log('Next level:', nextLevel);
          onLevelComplete?.(nextLevel.id);
        } else {
          // Es el último nivel del mundo, volver al mapa de mundos
          console.log('Last level completed, going to world map');
          onLevelComplete?.();
        }
      }, 2000); // Esperar 2 segundos para que el usuario vea la notificación

      return true;
    }
    return false;
  }, [currentLevel, world, toast, onLevelComplete]);

  const createRandomTetromino = useCallback((): Tetromino => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      shape: TETROMINO_SHAPES[type],
      color: TETROMINO_COLORS[type],
      type,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0
    };
  }, []);

  const isValidPosition = useCallback((piece: Tetromino, board: (Block | null)[][]) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x;
          const newY = piece.y + y;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const rotatePiece = useCallback((piece: Tetromino): Tetromino => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    
    return { ...piece, shape: rotated };
  }, []);

  const clearLines = useCallback((board: (Block | null)[][]) => {
    const newBoard = [...board];
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== null)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(null));
        linesCleared++;
        y++; // Check the same line again
      }
    }
    
    return { newBoard, linesCleared };
  }, []);

  const placePiece = useCallback((piece: Tetromino, board: (Block | null)[][]) => {
    const newBoard = board.map(row => [...row]);
    
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = {
              x: boardX,
              y: boardY,
              color: piece.color,
              type: piece.type
            };
          }
        }
      });
    });
    
    return newBoard;
  }, []);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down') => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      
      const newPiece = { ...prev.currentPiece };
      
      switch (direction) {
        case 'left':
          newPiece.x -= 1;
          break;
        case 'right':
          newPiece.x += 1;
          break;
        case 'down':
          newPiece.y += 1;
          break;
      }
      
      if (isValidPosition(newPiece, prev.board)) {
        return { ...prev, currentPiece: newPiece };
      } else if (direction === 'down') {
        // Piece has landed
        const boardWithPiece = placePiece(prev.currentPiece, prev.board);
        const { newBoard, linesCleared } = clearLines(boardWithPiece);
        
        const newScore = prev.score + (linesCleared * 100 * prev.level);
        const newLines = prev.lines + linesCleared;
        const newLevel = Math.floor(newLines / 10) + 1;
        
        // Verificar si se completó el nivel
        checkLevelComplete(newLines);
        
        const nextPiece = createRandomTetromino();
        const isGameOver = !isValidPosition(nextPiece, newBoard);
        
        return {
          ...prev,
          board: newBoard,
          currentPiece: nextPiece,
          nextPiece: createRandomTetromino(),
          score: newScore,
          lines: newLines,
          level: newLevel,
          isGameOver
        };
      }
      
      return prev;
    });
  }, [isValidPosition, placePiece, clearLines, createRandomTetromino, checkLevelComplete]);

  const rotatePieceInGame = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      
      const rotatedPiece = rotatePiece(prev.currentPiece);
      
      if (isValidPosition(rotatedPiece, prev.board)) {
        return { ...prev, currentPiece: rotatedPiece };
      }
      
      return prev;
    });
  }, [rotatePiece, isValidPosition]);

  const dropPiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      
      let newPiece = { ...prev.currentPiece };
      
      while (isValidPosition({ ...newPiece, y: newPiece.y + 1 }, prev.board)) {
        newPiece.y += 1;
      }
      
      return { ...prev, currentPiece: newPiece };
    });
  }, [isValidPosition]);

  const startGame = useCallback(() => {
    const firstPiece = createRandomTetromino();
    setGameState({
      board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)),
      currentPiece: firstPiece,
      nextPiece: createRandomTetromino(),
      score: 0,
      lines: 0,
      level: 1,
      isGameOver: false,
      isPaused: false
    });
  }, [createRandomTetromino]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const resetGame = useCallback(() => {
    startGame();
  }, [startGame]);

  return {
    gameState,
    movePiece,
    rotatePieceInGame,
    dropPiece,
    startGame,
    pauseGame,
    resetGame
  };
};