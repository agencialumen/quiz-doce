// Configuração do quiz
export const QUIZ_CONFIG = {
  // Perguntas do quiz
  questions: [
    {
      question: "Qual dessas opções te define melhor?",
      options: [
        "Quero começar a vender doces pra ganhar dinheiro",
        "Já vendo, mas quero melhorar",
        "Amo confeitaria como hobby",
      ],
      coins: 10,
    },
    {
      question: "Quanto você gostaria de ganhar por mês com confeitaria?",
      options: ["R$500 a R$1.000", "R$1.000 a R$3.000", "Mais de R$3.000"],
      coins: 10,
    },
    {
      question: "Quanto tempo por dia você tem pra se dedicar à produção?",
      options: ["Menos de 2h", "2h a 4h", "Tempo integral"],
      coins: 10,
    },
    {
      question: "O que mais te atrai na confeitaria?",
      options: ["Criar doces lindos", "Vender e ganhar dinheiro", "Fazer tudo com praticidade"],
      coins: 20,
      specialMessage: "Essa resposta vale moedas em dobro!",
    },
    {
      question: "Você estaria disposta a investir pouco e começar ainda hoje?",
      options: ["Sim, quero começar já!", "Quero saber mais primeiro", "Talvez depois"],
      coins: 10,
    },
  ],

  // Mensagens motivacionais
  motivationalMessages: [
    "Você está indo muito bem!",
    "Continue assim, está quase lá!",
    "Você tem potencial para ser uma confeiteira de sucesso!",
    "Seus doces vão fazer sucesso!",
    "Você está pronta para transformar sua paixão em lucro!",
  ],

  // Perfis de confeiteira
  profiles: [
    "🍫 Confeiteira Estratégica: Você pensa como empreendedora e está pronta para lucrar com receitas simples!",
    "🧁 Confeiteira Criativa: Você tem um olhar artístico e pode criar doces que encantam à primeira vista!",
    "🍰 Confeiteira Prática: Você valoriza a eficiência e pode criar um negócio lucrativo com processos otimizados!",
  ],

  // Depoimentos para notificações
  testimonials: [
    {
      id: 1,
      name: "Mariana Silva",
      message: "Comecei a vender brigadeiros e já estou faturando R$1.200 por mês!",
      time: "agora",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Juliana Costa",
      message: "As receitas sem fogo são perfeitas para mim que trabalho o dia todo!",
      time: "2 min",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Fernanda Oliveira",
      message: "Vendi 30 potes de mousse no primeiro fim de semana!",
      time: "5 min",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Camila Santos",
      message: "Meus bolos no pote fazem o maior sucesso nas festas!",
      time: "10 min",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Patrícia Mendes",
      message: "Já paguei meu investimento em apenas 2 semanas!",
      time: "15 min",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "Renata Almeida",
      message: "Consegui montar meu home office com o lucro dos doces!",
      time: "20 min",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      name: "Tatiana Rocha",
      message: "Meus vizinhos fazem fila para comprar meus brigadeiros gourmet!",
      time: "25 min",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 8,
      name: "Vanessa Lima",
      message: "Comecei vendendo para amigos e hoje tenho uma clientela fiel!",
      time: "30 min",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 9,
      name: "Aline Ferreira",
      message: "Nunca imaginei que ganharia tanto com receitas tão simples!",
      time: "35 min",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 10,
      name: "Bianca Martins",
      message: "Estou expandindo para delivery e já tenho pedidos para a semana toda!",
      time: "40 min",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
}
