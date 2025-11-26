import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Code, ArrowRight } from "lucide-react";

interface TutorialsPageProps {
  onBack: () => void;
}

export function TutorialsPage({ onBack }: TutorialsPageProps) {
  const tutorials = [
    {
      id: "sequencia",
      title: "Sequência de Comandos",
      icon: "📝",
      description: "Aprenda como executar comandos em ordem sequencial",
      content: [
        "A programação é como dar instruções passo a passo para um robô.",
        "Cada comando é executado na ordem em que você escreve.",
        "Por exemplo: mover para frente, depois virar à direita, depois mover novamente.",
        "A ordem importa! Se você virar antes de mover, o resultado será diferente."
      ],
      example: "mover()\nvirarDireita()\nmover()"
    },
    {
      id: "condicionais",
      title: "Condicionais (Se/Então)",
      icon: "❓",
      description: "Use condições para tomar decisões no seu código",
      content: [
        "Condicionais permitem que o robô tome decisões baseadas em situações.",
        "Se algo for verdadeiro, execute uma ação. Caso contrário, execute outra.",
        "Exemplo: 'Se houver um obstáculo à frente, vire à direita. Caso contrário, continue em frente.'",
        "Isso torna o código mais inteligente e adaptável."
      ],
      example: "se (obstaculoAhead()) {\n  virarDireita()\n} senao {\n  mover()\n}"
    },
    {
      id: "lacos",
      title: "Laços de Repetição",
      icon: "🔁",
      description: "Repita ações múltiplas vezes sem repetir código",
      content: [
        "Laços permitem repetir uma ação várias vezes sem escrever o mesmo código repetidamente.",
        "Use 'para' quando souber quantas vezes repetir.",
        "Use 'enquanto' quando quiser repetir até uma condição ser verdadeira.",
        "Exemplo: 'Repita 5 vezes: mover para frente' é mais eficiente que escrever mover() cinco vezes."
      ],
      example: "para (i = 0; i < 5; i++) {\n  mover()\n}"
    },
    {
      id: "funcoes",
      title: "Funções",
      icon: "📦",
      description: "Organize seu código em blocos reutilizáveis",
      content: [
        "Funções são blocos de código que você pode reutilizar.",
        "Elas ajudam a organizar e simplificar seu programa.",
        "Em vez de repetir o mesmo código várias vezes, você cria uma função e a chama quando necessário.",
        "Exemplo: Crie uma função 'virar180()' que vira o robô completamente, e use-a sempre que precisar."
      ],
      example: "funcao virar180() {\n  virarDireita()\n  virarDireita()\n}\n\nvirar180()"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className=" absolute top-0 right-0 w-96 h-96 
  bg-blue-200 dark:bg-blue-900 
  rounded-full mix-blend-multiply filter blur-3xl opacity-20
"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative min-h-screen p-6">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar ao Menu
          </Button>

          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-5xl font-bold text-slate-100 mb-2">Tutoriais</h1>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto">
              Aprenda os conceitos fundamentais de programação de forma prática e divertida
            </p>
          </div>
        </div>

        {/* Lista de Tutoriais */}
        <div className="max-w-6xl mx-auto space-y-6">
          {tutorials.map((tutorial, index) => (
            <Card key={tutorial.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Ícone e Título */}
                <div className="flex-shrink-0">
                  <div className="text-6xl mb-4 text-center md:text-left">{tutorial.icon}</div>
                  <h2 className="text-2xl font-bold text-slate-100 mb-2">{tutorial.title}</h2>
                  <p className="text-slate-200 mb-4">{tutorial.description}</p>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    {tutorial.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-slate-200 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Exemplo de Código */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Exemplo:
                    </h3>
                    <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre className="whitespace-pre-wrap">{tutorial.example}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="max-w-6xl mx-auto mt-12 text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <h3 className="text-2xl font-bold mb-4">Pronto para praticar?</h3>
            <p className="text-blue-100 mb-6">
              Agora que você conhece os conceitos básicos, teste seus conhecimentos no jogo!
            </p>
            <Button
              onClick={onBack}
              className="bg-white text-blue-600 hover:bg-blue-50 gap-2"
            >
              Voltar ao Menu
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

