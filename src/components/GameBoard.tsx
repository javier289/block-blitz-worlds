import { GameState, World } from '@/types/game';

interface GameBoardProps {
  gameState: GameState;
  world: World;
}

export const GameBoard = ({ gameState, world }: GameBoardProps) => {
  const { board, currentPiece } = gameState;
  
  // Create display board with current piece
  const displayBoard = board.map((row, y) =>
    row.map((cell, x) => {
      // Check if current piece occupies this position
      if (currentPiece) {
        for (let py = 0; py < currentPiece.shape.length; py++) {
          for (let px = 0; px < currentPiece.shape[py].length; px++) {
            if (
              currentPiece.shape[py][px] &&
              currentPiece.x + px === x &&
              currentPiece.y + py === y
            ) {
              return {
                x,
                y,
                color: currentPiece.color,
                type: currentPiece.type
              };
            }
          }
        }
      }
      return cell;
    })
  );

  const getBoardThemeClasses = () => {
    switch (world.theme) {
      case 'wood':
        return 'bg-wood-bg border-wood-secondary';
      case 'brick':
        return 'bg-brick-bg border-brick-secondary';
      case 'water':
        return 'bg-water-bg border-water-secondary';
      case 'fire':
        return 'bg-fire-bg border-fire-secondary';
      case 'ice':
        return 'bg-ice-bg border-ice-secondary';
      case 'space':
        return 'bg-space-bg border-space-secondary';
      case 'tropical':
        return 'bg-tropical-bg border-tropical-secondary';
      default:
        return 'bg-muted border-border';
    }
  };

  const getBlockThemeClasses = (hasBlock: boolean, blockType?: string) => {
    if (!hasBlock) return 'bg-transparent border-border/20';
    
    switch (world.theme) {
      case 'wood':
        return 'border-wood-accent shadow-lg bg-gradient-to-br from-wood-light to-wood-primary';
      case 'brick':
        return 'border-brick-accent shadow-md';
      case 'water':
        return 'border-water-accent shadow-md';
      case 'fire':
        return 'border-fire-accent shadow-lg bg-gradient-to-br from-fire-hot to-fire-primary animate-pulse';
      case 'ice':
        return 'border-ice-accent shadow-lg bg-gradient-to-br from-ice-crystal to-ice-primary backdrop-blur-sm bg-opacity-80';
      case 'space':
        return 'border-space-accent shadow-lg bg-gradient-to-br from-space-neon to-space-primary shadow-space-glow animate-pulse';
      case 'tropical':
        return 'border-tropical-accent shadow-lg bg-gradient-to-br from-tropical-primary to-tropical-tertiary';
      default:
        return 'border-border shadow-md';
    }
  };

  return (
    <div className={`
      grid grid-cols-10 gap-0.5 p-4 rounded-xl border-2 
      ${getBoardThemeClasses()}
      shadow-lg
    `}>
      {displayBoard.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`
              w-6 h-6 border rounded-sm transition-all duration-150
              ${getBlockThemeClasses(!!cell, cell?.type)}
            `}
            style={{
              backgroundColor: world.theme === 'wood' && cell ? 
                `hsl(${25 + Math.random() * 10} ${45 + Math.random() * 15}% ${35 + Math.random() * 20}%)` :
                world.theme === 'fire' && cell ?
                `hsl(${Math.random() * 30} ${85 + Math.random() * 10}% ${45 + Math.random() * 20}%)` :
                world.theme === 'ice' && cell ?
                `hsla(${190 + Math.random() * 20} ${60 + Math.random() * 20}% ${75 + Math.random() * 15}%, 0.8)` :
                world.theme === 'space' && cell ?
                `hsl(${240 + Math.random() * 60} ${70 + Math.random() * 30}% ${50 + Math.random() * 30}%)` :
                world.theme === 'tropical' && cell ?
                `hsl(${30 + Math.random() * 60} ${80 + Math.random() * 20}% ${50 + Math.random() * 25}%)` :
                (cell?.color || 'transparent'),
            }}
          />
        ))
      )}
    </div>
  );
};