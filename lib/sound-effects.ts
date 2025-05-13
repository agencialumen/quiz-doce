// Tipos de sons disponíveis
type SoundType = "click" | "coins" | "spend" | "success" | "notification" | "urgency"

// Mapeamento de sons para URLs
const SOUND_URLS: Record<SoundType, string> = {
  click: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3", // Som de clique suave
  coins: "https://assets.mixkit.co/active_storage/sfx/888/888-preview.mp3", // Som de moedas
  spend: "https://assets.mixkit.co/active_storage/sfx/2575/2575-preview.mp3", // Som de gastar moedas
  success: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3", // Som de sucesso
  notification: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3", // Som de notificação
  urgency: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3", // Som de urgência
}

// Cache de áudios para melhor performance
const audioCache: Record<string, HTMLAudioElement> = {}

/**
 * Pré-carrega todos os efeitos sonoros para uso posterior
 */
export function preloadSounds(): void {
  if (typeof window === "undefined") return

  Object.keys(SOUND_URLS).forEach((sound) => {
    try {
      const audio = new Audio(SOUND_URLS[sound as SoundType])
      audio.preload = "auto"
      audio.volume = 0.5 // Volume padrão
      audioCache[sound] = audio

      // Tenta carregar o áudio
      audio.load()

      console.log(`Som pré-carregado: ${sound}`)
    } catch (error) {
      console.error(`Erro ao pré-carregar som ${sound}:`, error)
    }
  })
}

/**
 * Toca um efeito sonoro
 * @param sound Tipo de som a ser tocado
 * @param volume Volume do som (0 a 1, padrão 0.5)
 */
export function playSound(sound: SoundType, volume = 0.5): void {
  try {
    if (typeof window === "undefined") return

    // Verificar se o áudio já está em cache
    if (!audioCache[sound]) {
      // Criar novo áudio se não estiver em cache
      audioCache[sound] = new Audio(SOUND_URLS[sound])
      audioCache[sound].preload = "auto"
    }

    // Criar uma nova instância para permitir sobreposição de sons
    const audioInstance = new Audio(SOUND_URLS[sound])

    // Configurar volume e tocar
    audioInstance.volume = volume

    // Reproduzir o som
    const playPromise = audioInstance.play()

    // Lidar com a promessa para evitar erros no console
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Erro ao reproduzir som (provavelmente interação do usuário necessária):", error)
      })
    }
  } catch (error) {
    console.error("Erro ao tocar efeito sonoro:", error)
  }
}

/**
 * Verifica se o navegador permite reprodução de áudio
 * @returns Promise que resolve para true se o áudio for permitido
 */
export async function checkAudioPermission(): Promise<boolean> {
  try {
    if (typeof window === "undefined") return false

    const audio = new Audio()
    audio.volume = 0.01
    const playPromise = audio.play()

    if (playPromise !== undefined) {
      try {
        await playPromise
        audio.pause()
        return true
      } catch (error) {
        return false
      }
    }

    return false
  } catch (error) {
    return false
  }
}

/**
 * Inicializa o sistema de áudio com interação do usuário
 * Deve ser chamado em resposta a uma interação do usuário
 */
export function initAudio(): void {
  if (typeof window === "undefined") return

  // Tenta reproduzir um som silencioso para desbloquear o áudio
  const audio = new Audio()
  audio.volume = 0.01

  const playPromise = audio.play()
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        audio.pause()
        console.log("Áudio inicializado com sucesso")
        // Pré-carregar sons após inicialização bem-sucedida
        preloadSounds()
      })
      .catch((error) => {
        console.log("Erro ao inicializar áudio:", error)
      })
  }
}
