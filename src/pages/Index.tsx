import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Star, Trophy, Gamepad2 } from 'lucide-react';
import worldWoodImage from '@/assets/world-wood.jpg';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${worldWoodImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-primary/10 rounded-full">
                <Gamepad2 className="w-16 h-16 text-primary" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Block Blitz
            </h1>
            <h2 className="text-4xl font-bold text-foreground">
              Worlds
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Combina la mecánica clásica de Tetris con la aventura de explorar 5 mundos únicos. 
              ¡Cada mundo trae nuevos desafíos y estilos visuales increíbles!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/worlds')}
              >
                <Play className="w-6 h-6 mr-2" />
                Jugar Ahora
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => navigate('/worlds')}
              >
                <Star className="w-6 h-6 mr-2" />
                Ver Mundos
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">5 Mundos Épicos</h3>
          <p className="text-muted-foreground text-lg">
            Cada mundo con su propio estilo visual y mecánicas únicas
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon="🌳"
            title="Bosque Místico"
            description="Bloques de madera en un bosque encantado"
            color="wood"
          />
          <FeatureCard
            icon="🧱"
            title="Ciudad de Ladrillos"
            description="Construye con bloques de ladrillo rojo"
            color="brick"
          />
          <FeatureCard
            icon="🌊"
            title="Océano Profundo"
            description="Bloques cristalinos bajo el agua"
            color="water"
          />
          <FeatureCard
            icon="🔥"
            title="Volcán Ardiente"
            description="Lava fundida y bloques de fuego"
            color="fire"
          />
          <FeatureCard
            icon="❄️"
            title="Picos Helados"
            description="Bloques de hielo en montañas glaciales"
            color="ice"
          />
          <Card className="p-6 border-2 border-dashed border-primary/30 flex items-center justify-center">
            <div className="text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h4 className="text-lg font-semibold mb-2">¡Y más por venir!</h4>
              <p className="text-sm text-muted-foreground">
                Nuevos mundos en futuras actualizaciones
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Game Features */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Características del Juego</h3>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="text-xl font-semibold">🎮 Mecánica Clásica</h4>
              <p className="text-muted-foreground">
                Tetris tradicional con controles intuitivos y mecánica perfeccionada
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xl font-semibold">🗺️ Progresión por Mundos</h4>
              <p className="text-muted-foreground">
                Desbloquea nuevos mundos y niveles al completar desafíos
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xl font-semibold">⭐ Sistema de Estrellas</h4>
              <p className="text-muted-foreground">
                Obtén hasta 3 estrellas por nivel según tu rendimiento
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xl font-semibold">📱 Optimizado para Móvil</h4>
              <p className="text-muted-foreground">
                Controles táctiles perfectos para dispositivos móviles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-4">¿Listo para la Aventura?</h3>
          <p className="text-muted-foreground text-lg mb-8">
            Únete a miles de jugadores y comienza tu viaje a través de los mundos de Block Blitz
          </p>
          
          <Button 
            size="lg" 
            className="text-lg px-12 py-6"
            onClick={() => navigate('/worlds')}
          >
            <Play className="w-6 h-6 mr-2" />
            Comenzar Aventura
          </Button>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  color: 'wood' | 'brick' | 'water' | 'fire' | 'ice';
}

const FeatureCard = ({ icon, title, description, color }: FeatureCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case 'wood':
        return 'hover:border-wood-primary hover:shadow-wood-primary/20';
      case 'brick':
        return 'hover:border-brick-primary hover:shadow-brick-primary/20';
      case 'water':
        return 'hover:border-water-primary hover:shadow-water-primary/20';
      case 'fire':
        return 'hover:border-fire-primary hover:shadow-fire-primary/20';
      case 'ice':
        return 'hover:border-ice-primary hover:shadow-ice-primary/20';
      default:
        return 'hover:border-primary hover:shadow-primary/20';
    }
  };

  return (
    <Card className={`p-6 transition-all duration-300 hover:scale-105 ${getColorClasses()}`}>
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
};

export default Index;
