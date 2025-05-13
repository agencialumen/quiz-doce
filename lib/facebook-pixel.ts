// Tipos para o Facebook Pixel
interface FacebookEventParams {
  [key: string]: any
}

interface FacebookPixel {
  push: (args: any[]) => void
  callMethod: (method: string, ...args: any[]) => void
  queue: any[]
  loaded: boolean
  version: string
  init: (pixelId: string) => void
  track: (event: string, params?: FacebookEventParams) => void
  trackCustom: (event: string, params?: FacebookEventParams) => void
}

declare global {
  interface Window {
    fbq?: FacebookPixel
  }
}

/**
 * Rastreia um evento padrão do Facebook Pixel
 * @param event Nome do evento a ser rastreado
 * @param params Parâmetros adicionais do evento (opcional)
 */
export function trackFacebookEvent(event: string, params?: FacebookEventParams): void {
  try {
    if (typeof window !== "undefined" && window.fbq) {
      if (params) {
        window.fbq("track", event, params)
      } else {
        window.fbq("track", event)
      }
      console.log(`Facebook Pixel: Evento "${event}" rastreado`, params || "")
    }
  } catch (error) {
    console.error("Erro ao rastrear evento do Facebook Pixel:", error)
  }
}

/**
 * Lista de eventos padrão do Facebook
 * Referência: https://developers.facebook.com/docs/meta-pixel/reference
 */
export const FB_STANDARD_EVENTS = {
  // Eventos de conversão principais
  PURCHASE: "Purchase",
  LEAD: "Lead",
  COMPLETE_REGISTRATION: "CompleteRegistration",

  // Eventos de descoberta
  SEARCH: "Search",
  VIEW_CONTENT: "ViewContent",

  // Eventos de intenção
  ADD_TO_CART: "AddToCart",
  ADD_TO_WISHLIST: "AddToWishlist",
  INITIATE_CHECKOUT: "InitiateCheckout",

  // Eventos de aplicativo
  CONTACT: "Contact",
  CUSTOMIZE_PRODUCT: "CustomizeProduct",
  DONATE: "Donate",
  FIND_LOCATION: "FindLocation",
  SCHEDULE: "Schedule",
  START_TRIAL: "StartTrial",
  SUBMIT_APPLICATION: "SubmitApplication",
  SUBSCRIBE: "Subscribe",
}

/**
 * Valores de parâmetros comuns para eventos do Facebook
 */
export const FB_CONTENT_CATEGORIES = {
  QUIZ: "quiz",
  PRODUCT: "product",
  OFFER: "offer",
  BONUS: "bonus",
  CHECKOUT: "checkout",
}

/**
 * Função para rastrear visualização de página
 */
export function trackPageView(): void {
  trackFacebookEvent("PageView")
}

/**
 * Função para rastrear conclusão de quiz
 */
export function trackQuizCompletion(params?: FacebookEventParams): void {
  trackFacebookEvent(FB_STANDARD_EVENTS.LEAD, {
    content_name: "Conclusão de Quiz",
    content_category: FB_CONTENT_CATEGORIES.QUIZ,
    ...params,
  })
}

/**
 * Função para rastrear visualização de oferta
 */
export function trackViewOffer(params?: FacebookEventParams): void {
  trackFacebookEvent(FB_STANDARD_EVENTS.VIEW_CONTENT, {
    content_name: "Oferta de Receitas",
    content_category: FB_CONTENT_CATEGORIES.OFFER,
    content_type: "product",
    ...params,
  })
}

/**
 * Função para rastrear início de checkout
 */
export function trackInitiateCheckout(value: number, currency = "BRL", params?: FacebookEventParams): void {
  trackFacebookEvent(FB_STANDARD_EVENTS.INITIATE_CHECKOUT, {
    value,
    currency,
    ...params,
  })
}
