import { Button } from "@/components/ui/button";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  if (!isOpen) return null;

  const tutorialSteps = [
    {
      icon: '🧩',
      title: '1. Arraste os blocos',
      description: 'Pegue os blocos coloridos da esquerda e arraste para o centro',
      color: 'kid-blue'
    },
    {
      icon: '🔗',
      title: '2. Conecte os blocos',
      description: 'Una os blocos como um quebra-cabeças para criar seu programa',
      color: 'kid-orange'
    },
    {
      icon: '💻',
      title: '3. Veja o código',
      description: 'Olhe na direita e veja o código Arduino sendo criado magicamente!',
      color: 'kid-green'
    },
    {
      icon: '🚀',
      title: '4. Envie pro Arduino',
      description: 'Clique em "Enviar pro Arduino" e veja sua criação funcionando!',
      color: 'kid-purple'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-kid-purple to-kid-pink p-6 text-white">
          <h2 className="text-3xl font-black mb-2">🌟 Bem-vindo ao Arduino Blocks Kids!</h2>
          <p className="text-lg opacity-90">Vamos aprender a criar programas incríveis!</p>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorialSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className={`bg-${step.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white text-2xl">{step.icon}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-kid-purple to-kid-pink text-white font-bold py-4 px-8 rounded-xl shadow-playful transform hover:scale-105 transition-all duration-200"
            >
              🚀 Começar a Criar!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
