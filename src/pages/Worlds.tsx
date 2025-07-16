import { useNavigate } from 'react-router-dom';
import { WorldMap } from '@/components/WorldMap';
import { WORLDS } from '@/data/worlds';
import { World, Level } from '@/types/game';

export const Worlds = () => {
  const navigate = useNavigate();

  const handleSelectLevel = (world: World, level: Level) => {
    navigate(`/game/${world.id}/${level.id}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <WorldMap
      worlds={WORLDS}
      onSelectLevel={handleSelectLevel}
      onBack={handleBack}
    />
  );
};