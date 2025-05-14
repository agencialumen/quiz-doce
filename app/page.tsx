"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Gift, Award, Coins, ArrowRight, Clock, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import NotificationToast from "@/components/notification-toast"
import {
  trackFacebookEvent,
  FB_STANDARD_EVENTS,
  trackQuizCompletion,
  trackViewOffer,
  trackInitiateCheckout,
} from "@/lib/facebook-pixel"
import { QUIZ_CONFIG } from "@/config/quiz-config"
import { playSound } from "@/lib/sound-effects"
import CoinAnimation from "@/components/coin-animation"
import QuizProgress from "@/components/quiz-progress"
import BonusItem from "@/components/bonus-item"
import PhoneCaptureForm from "@/components/phone-capture-form"

// Tipos
type QuizStep = "quiz" | "offer"
type NotificationType = {
  id: number
  name: string
  message: string
  time: string
  avatar: string
}

// Configuração dos bônus
const BONUS_ITEMS = [
  {
    id: 1,
    title: "Brigadeiros Gourmet Sem Fogo",
    imageSrc: "https://iili.io/3UBxWUg.md.png",
    description: "Aprenda a fazer brigadeiros gourmet sem precisar ir ao fogo!",
  },
  {
    id: 2,
    title: "Donuts Magníficos",
    imageSrc: "https://iili.io/3UBzTIR.md.png",
    description: "Receitas exclusivas de donuts que derretem na boca!",
  },
  {
    id: 3,
    title: "Planilha de Custos e Preços",
    imageSrc: "https://iili.io/3UBIKuf.md.png",
    description: "Calcule seus custos e preços de venda para maximizar seus lucros!",
  },
]

// URL do checkout
const CHECKOUT_URL = "https://pay.kirvano.com/7416ffba-79c5-49e7-84d8-6358d582b7cd"

export default function Home() {
  // Add a new state for the phone capture form at the top of the component
  const [showPhoneForm, setShowPhoneForm] = useState(true)

  // Estados
  const [step, setStep] = useState<QuizStep>("quiz")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [coins, setCoins] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showBonus, setShowBonus] = useState(false)
  const [bonusClaimed, setBonusClaimed] = useState(false)
  const [profile, setProfile] = useState("")
  const [progress, setProgress] = useState(0)
  const [showMotivation, setShowMotivation] = useState(false)
  const [motivationMessage, setMotivationMessage] = useState("")
  const [offerTimeLeft, setOfferTimeLeft] = useState(15 * 60) // 15 minutos em segundos
  const [timerActive, setTimerActive] = useState(false)
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [showNotification, setShowNotification] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<NotificationType | null>(null)
  const [showCoinAnimation, setShowCoinAnimation] = useState(false)
  const [coinValue, setCoinValue] = useState(0)
  const [isSpendingCoins, setIsSpendingCoins] = useState(false)
  const [bonusAnimationComplete, setBonusAnimationComplete] = useState(false)
  const [showProfileToast, setShowProfileToast] = useState(false)

  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null)
  const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const profileToastTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Perguntas do quiz
  const { questions, motivationalMessages, profiles, testimonials } = QUIZ_CONFIG

  // Efeito para inicializar notificações e rastrear evento de início
  useEffect(() => {
    // Inicializar notificações do quiz
    setNotifications(testimonials)

    // Rastrear evento de início do quiz
    trackFacebookEvent(FB_STANDARD_EVENTS.VIEW_CONTENT, {
      content_name: "Quiz de Confeitaria",
      content_category: "quiz",
    })

    // Inicializar áudio
    if (typeof window !== "undefined") {
      const audio = new Audio()
      audio.volume = 0.01
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audio.pause()
            console.log("Áudio inicializado com sucesso")
          })
          .catch((error) => {
            console.log("Erro ao inicializar áudio:", error)
          })
      }
    }

    // Mostrar primeira notificação após 3 segundos
    const timer = setTimeout(() => {
      showNextNotification()
    }, 3000)

    // Configurar intervalo para mostrar notificações periodicamente
    notificationIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.5) {
        // 50% de chance de mostrar uma notificação
        showNextNotification()
      }
    }, 20000) // A cada 20 segundos

    return () => {
      clearTimeout(timer)
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current)
      }
      if (profileToastTimerRef.current) {
        clearTimeout(profileToastTimerRef.current)
      }
    }
  }, [])

  // Função para mostrar próxima notificação
  const showNextNotification = () => {
    if (notifications.length > 0) {
      // Pegar uma notificação aleatória
      const randomIndex = Math.floor(Math.random() * notifications.length)
      const notification = notifications[randomIndex]

      // Remover da lista para não repetir
      const newNotifications = [...notifications]
      newNotifications.splice(randomIndex, 1)
      setNotifications(newNotifications)

      // Mostrar notificação
      setCurrentNotification(notification)
      setShowNotification(true)

      // Tocar som de notificação
      playSound("notification", 0.4)

      // Esconder após 5 segundos
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current)
      }

      notificationTimerRef.current = setTimeout(() => {
        setShowNotification(false)

        // Recarregar notificações quando estiver acabando
        if (newNotifications.length < 3) {
          // Embaralhar os depoimentos para evitar repetições sequenciais
          const shuffledTestimonials = [...testimonials].sort(() => Math.random() - 0.5)
          setNotifications([...newNotifications, ...shuffledTestimonials.slice(0, 5)])
        }
      }, 5000)
    }
  }

  // Efeito para atualizar o progresso
  useEffect(() => {
    if (step === "quiz") {
      const newProgress = ((currentQuestion + 1) / questions.length) * 100
      setProgress(newProgress)

      // Mostrar mensagem motivacional a cada etapa
      if (currentQuestion > 0 && currentQuestion < questions.length) {
        setMotivationMessage(motivationalMessages[currentQuestion % motivationalMessages.length])
        setShowMotivation(true)
        setTimeout(() => setShowMotivation(false), 3000)
      }
    }
  }, [currentQuestion, step, questions.length, motivationalMessages])

  // Efeito para o timer da oferta
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (timerActive && offerTimeLeft > 0) {
      interval = setInterval(() => {
        setOfferTimeLeft((prev) => {
          // Tocar som de urgência quando faltar 1 minuto
          if (prev === 60) {
            playSound("urgency")
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [timerActive, offerTimeLeft])

  // Efeito para animar os bônus quando o modal é aberto
  useEffect(() => {
    if (showBonus) {
      // Iniciar a animação dos bônus
      setTimeout(() => {
        setBonusAnimationComplete(true)
        // Tocar som de sucesso quando todos os bônus forem revelados
        playSound("success", 0.5)
      }, 1500) // Tempo suficiente para todas as animações terminarem
    } else {
      setBonusAnimationComplete(false)
    }
  }, [showBonus])

  // Função para formatar o tempo restante
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Função para adicionar moedas com animação
  const addCoinsWithAnimation = (amount: number) => {
    setCoinValue(amount)
    setShowCoinAnimation(true)
    setIsSpendingCoins(false)

    // Tocar som de moedas
    playSound("coins")

    setTimeout(() => {
      setCoins((prev) => prev + amount)
      setShowCoinAnimation(false)
    }, 1000)
  }

  // Função para gastar moedas com animação
  const spendCoinsWithAnimation = (amount: number) => {
    setCoinValue(amount)
    setShowCoinAnimation(true)
    setIsSpendingCoins(true)

    // Tocar som de gastar moedas
    playSound("spend")

    setTimeout(() => {
      setCoins((prev) => prev - amount)
      setShowCoinAnimation(false)
    }, 1000)
  }

  // Função para mostrar o toast do perfil
  const showProfileToastNotification = (profileText: string) => {
    // Criar uma notificação personalizada para o perfil
    const profileNotification: NotificationType = {
      id: 999,
      name: "Seu Perfil de Confeiteira",
      message: profileText,
      time: "agora",
      avatar: "https://iili.io/3UBTBRa.jpg",
    }

    setCurrentNotification(profileNotification)
    setShowNotification(true)

    // Esconder após 7 segundos (mais tempo que as notificações normais)
    if (profileToastTimerRef.current) {
      clearTimeout(profileToastTimerRef.current)
    }

    profileToastTimerRef.current = setTimeout(() => {
      setShowNotification(false)
    }, 7000)
  }

  // Função para responder uma pergunta
  const answerQuestion = (optionIndex: number) => {
    // Tocar som de clique
    playSound("click")

    // Adicionar moedas com animação
    addCoinsWithAnimation(questions[currentQuestion].coins)

    // Salvar resposta
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)

    // Rastrear evento
    trackFacebookEvent(FB_STANDARD_EVENTS.SUBMIT_APPLICATION, {
      question_number: currentQuestion + 1,
      content_name: "Resposta de Quiz",
      question: questions[currentQuestion].question,
    })

    // Verificar se deve mostrar o bônus após a terceira pergunta
    if (currentQuestion === 2 && !bonusClaimed) {
      setShowBonus(true)
      return
    }

    // Avançar para a próxima pergunta ou para o resultado/oferta
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1)
        // Tocar som de sucesso ao avançar para a próxima pergunta
        playSound("success", 0.3)
      }, 1000)
    } else {
      setTimeout(() => {
        // Determinar o perfil com base nas respostas
        const profileIndex = Math.floor(Math.random() * profiles.length)
        const selectedProfile = profiles[profileIndex]
        setProfile(selectedProfile)

        // Mostrar o perfil como uma notificação toast
        showProfileToastNotification(selectedProfile)

        // Ir diretamente para a oferta
        setStep("offer")
        setTimerActive(true)

        // Rastrear evento de conclusão do quiz
        trackQuizCompletion()

        // Rastrear evento de visualização da oferta
        trackViewOffer()

        // Tocar som de sucesso ao completar o quiz
        playSound("success")
      }, 1000)
    }
  }

  // Função para resgatar o bônus
  const claimBonus = () => {
    if (coins >= 20) {
      playSound("click")
      spendCoinsWithAnimation(20)
      setBonusClaimed(true)

      setTimeout(() => {
        setShowBonus(false)
        // Avançar para a próxima pergunta
        setCurrentQuestion((prev) => prev + 1)
      }, 1200)

      trackFacebookEvent(FB_STANDARD_EVENTS.SUBSCRIBE, {
        content_name: "Bônus de Receitas",
        content_category: "bonus",
      })
    }
  }

  // Função para continuar após o bônus
  const continueAfterBonus = () => {
    playSound("click")
    setShowBonus(false)
    setCurrentQuestion((prev) => prev + 1)
  }

  // Função para comprar com desconto
  const buyWithDiscount = () => {
    playSound("click")

    // Rastrear evento de checkout
    trackInitiateCheckout(9.9)

    // Redirecionar para o checkout
    window.location.href = CHECKOUT_URL
  }

  // Add this function to handle form completion
  const handlePhoneFormComplete = () => {
    setShowPhoneForm(false)
  }

  // Modify the main return statement to conditionally show the phone form or quiz
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-amber-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Notificações */}
      <AnimatePresence>
        {showNotification && currentNotification && (
          <NotificationToast notification={currentNotification} onClose={() => setShowNotification(false)} />
        )}
      </AnimatePresence>

      {/* Animação de moedas */}
      <AnimatePresence>
        {showCoinAnimation && <CoinAnimation value={coinValue} isSpending={isSpendingCoins} />}
      </AnimatePresence>

      {/* Barra de progresso e contador de moedas */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-2 z-10">
        <div className="container mx-auto flex items-center justify-between">
          {step === "quiz" && !showPhoneForm && (
            <div className="w-full max-w-md">
              <QuizProgress currentStep={currentQuestion + 1} totalSteps={questions.length} />
              <AnimatePresence>
                {showMotivation && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-pink-600 mt-1"
                  >
                    {motivationMessage}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )}
          {!showPhoneForm && (
            <motion.div
              className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full ml-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Coins size={16} className="text-amber-600" />
              <span className="font-bold text-amber-800">{coins}</span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16 z-10">
        <AnimatePresence mode="wait">
          {/* Phone Capture Form */}
          {showPhoneForm ? (
            <motion.div
              key="phone-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <PhoneCaptureForm onComplete={handlePhoneFormComplete} />
            </motion.div>
          ) : (
            /* Quiz */
            step === "quiz" && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-md md:max-w-2xl mx-auto"
              >
                <Card className="p-4 sm:p-5 md:p-8 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border-pink-200">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-pink-800 mb-3 sm:mb-4 md:mb-6">
                    {questions[currentQuestion].question}
                  </h2>
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => answerQuestion(index)}
                          variant="outline"
                          className="w-full justify-start text-left p-3 md:p-4 border-2 border-pink-100 hover:border-pink-300 hover:bg-pink-50 text-pink-800 font-medium rounded-xl transition-all text-sm md:text-base min-h-[60px]"
                        >
                          <span className="line-clamp-3">{option}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  {questions[currentQuestion].specialMessage && (
                    <p className="mt-2 sm:mt-3 md:mt-4 text-xs md:text-sm text-amber-600 flex items-center">
                      <Award size={16} className="mr-1 flex-shrink-0" />
                      {questions[currentQuestion].specialMessage}
                    </p>
                  )}
                </Card>
              </motion.div>
            )
          )}

          {/* Oferta */}
          {step === "offer" && (
            <motion.div
              key="offer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md md:max-w-3xl mx-auto px-2"
            >
              <div className="bg-gradient-to-b from-pink-100 to-amber-50 p-3 sm:p-5 md:p-8 rounded-2xl shadow-lg border-2 border-pink-200">
                <div className="text-center mb-4 sm:mb-6">
                  <motion.h2
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-800 mb-2 px-2"
                  >
                    🎉 Parabéns! Oferta Exclusiva Desbloqueada!
                  </motion.h2>
                  <div className="bg-amber-50 p-2 rounded-lg inline-block mb-3">
                    <p className="text-amber-800 font-medium text-sm md:text-base">
                      Você acumulou <span className="font-bold">{coins} moedas</span>!
                    </p>
                  </div>
                  <p className="text-sm sm:text-base text-pink-600 px-2">
                    Aprenda mais de 150 receitas que não vão ao fogo, com apostilas passo a passo.
                  </p>
                  <p className="text-xs sm:text-sm text-pink-600 mb-3 px-2">
                    Um guia completo para começar sua renda extra hoje mesmo.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-center">
                  <div className="md:w-1/2">
                    <motion.div
                      whileHover={{
                        rotate: [-1, 1, -1],
                        transition: { duration: 0.5, repeat: Number.POSITIVE_INFINITY },
                      }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 to-amber-200 rounded-lg transform rotate-2 scale-105 -z-10"></div>
                      <Image
                        src="https://iili.io/3UBn71e.md.png"
                        width={300}
                        height={400}
                        alt="150 Recheios & Receitas - Renda Extra"
                        className="rounded-lg shadow-lg mx-auto w-full max-w-[180px] sm:max-w-[220px] md:max-w-[300px]"
                      />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="absolute -top-3 -right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                      >
                        <Sparkles size={12} className="inline mr-1" />
                        Bestseller
                      </motion.div>
                    </motion.div>
                  </div>

                  <div className="md:w-1/2 space-y-3 sm:space-y-4 w-full px-2">
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl">
                      <h3 className="font-bold text-pink-800 text-base sm:text-lg mb-2">O que você vai receber:</h3>
                      <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                        <li className="flex items-start">
                          <span className="text-pink-600 mr-2 flex-shrink-0">✓</span>
                          <span>150+ receitas que não vão ao fogo</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-pink-600 mr-2 flex-shrink-0">✓</span>
                          <span>Guia de precificação para lucrar desde o início</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-pink-600 mr-2 flex-shrink-0">✓</span>
                          <span>Dicas para vender nas redes sociais</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-pink-600 mr-2 flex-shrink-0">✓</span>
                          <span>Suporte por 30 dias no grupo VIP</span>
                        </li>
                      </ul>
                    </div>

                    <div className="text-center">
                      <div className="mb-3">
                        <p className="text-gray-500 line-through text-xs sm:text-sm">De R$19,90</p>
                        <p className="text-lg sm:text-xl font-bold text-pink-800">Por apenas R$9,90</p>
                        <p className="text-xs text-green-600 font-medium mt-1">
                          <Check size={12} className="inline mr-1" />
                          Pagamento único, sem mensalidades
                        </p>
                      </div>

                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative">
                        <motion.div
                          className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                        >
                          <Clock size={12} />
                          {formatTime(offerTimeLeft)}
                        </motion.div>
                        <Button
                          onClick={buyWithDiscount}
                          size="lg"
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
                        >
                          QUERO APROVEITAR AGORA
                          <ArrowRight className="ml-2 flex-shrink-0" />
                        </Button>
                      </motion.div>

                      <p className="mt-3 text-xs text-pink-600 flex items-center justify-center">
                        <span>Oferta por tempo limitado!</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bônus incluídos */}
                <div className="mt-6">
                  <h3 className="text-center font-bold text-pink-800 text-base mb-3">
                    <Gift className="inline mr-2" />
                    Bônus Exclusivos Incluídos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-2">
                    {BONUS_ITEMS.map((bonus) => (
                      <div
                        key={bonus.id}
                        className="bg-white/70 backdrop-blur-sm p-2 rounded-lg border border-pink-200 flex flex-col items-center text-center"
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 relative mb-2">
                          <Image
                            src={bonus.imageSrc || "/placeholder.svg"}
                            alt={bonus.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <h4 className="text-xs sm:text-sm font-medium text-pink-800">{bonus.title}</h4>
                        <p className="text-[10px] sm:text-xs text-green-600 mt-1">
                          <Check size={10} className="inline mr-1" />
                          Incluído Grátis
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Popup de bônus */}
      <Dialog open={showBonus} onOpenChange={setShowBonus}>
        <DialogContent className="bg-gradient-to-b from-pink-50 to-amber-50 border-2 border-pink-300 sm:max-w-md mx-4 p-4 sm:p-6 max-w-[95vw] w-full">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg sm:text-xl text-pink-800 flex items-center">
              <Gift className="mr-2 text-pink-600 flex-shrink-0" />
              Parabéns! Bônus especial
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-pink-600">
              3 receitas secretas que não vão ao fogo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-4">
            {BONUS_ITEMS.map((bonus, index) => (
              <BonusItem key={bonus.id} title={bonus.title} imageSrc={bonus.imageSrc} delay={index * 0.3} />
            ))}
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2 mt-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
              <Button
                onClick={claimBonus}
                disabled={coins < 20}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 text-sm"
              >
                RESGATAR POR 20 MOEDAS
              </Button>
            </motion.div>
            <Button
              onClick={continueAfterBonus}
              variant="outline"
              className="w-full border-pink-300 text-pink-800 py-3 text-sm"
            >
              CONTINUAR SEM RESGATAR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
