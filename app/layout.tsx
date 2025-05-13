import type React from "react"
import type { Metadata } from "next"
import { Quicksand } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Descubra seu Perfil de Confeiteira Lucrativa 🍰💰",
  description:
    "Responda 5 perguntas rápidas, acumule moedas e descubra seu perfil de confeiteira. Bônus liberado no final!",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Facebook Pixel Code */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1347315153239318');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1347315153239318&ev=PageView&noscript=1"
            alt="Facebook Pixel"
          />
        </noscript>

        {/* Inicialização de áudio */}
        <Script id="audio-init" strategy="afterInteractive">
          {`
            // Função para inicializar áudio com interação do usuário
            function initAudioOnInteraction() {
              // Criar um elemento de áudio silencioso
              const silentAudio = new Audio();
              silentAudio.volume = 0.01;
              
              // Função para inicializar áudio
              const initAudio = () => {
                silentAudio.play().then(() => {
                  silentAudio.pause();
                  console.log("Áudio inicializado com sucesso");
                  
                  // Pré-carregar sons
                  if (typeof window.preloadSounds === 'function') {
                    window.preloadSounds();
                  }
                  
                  // Remover event listeners após inicialização
                  document.removeEventListener('click', initAudio);
                  document.removeEventListener('touchstart', initAudio);
                }).catch(error => {
                  console.log("Erro ao inicializar áudio:", error);
                });
              };
              
              // Adicionar event listeners para interação do usuário
              document.addEventListener('click', initAudio);
              document.addEventListener('touchstart', initAudio);
            }
            
            // Inicializar quando o DOM estiver pronto
            document.addEventListener('DOMContentLoaded', initAudioOnInteraction);
          `}
        </Script>

        {/* Preload sound effects */}
        <Script id="preload-sounds" strategy="afterInteractive">
          {`
            // Preload sounds when the page loads
            document.addEventListener('DOMContentLoaded', function() {
              if (typeof window !== 'undefined' && window.preloadSounds) {
                window.preloadSounds();
              }
            });
          `}
        </Script>
      </head>
      <body className={quicksand.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
