"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Send } from "lucide-react"
import { playSound } from "@/lib/sound-effects"

interface PhoneCaptureFormProps {
  onComplete: () => void
}

export default function PhoneCaptureForm({ onComplete }: PhoneCaptureFormProps) {
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    let value = e.target.value.replace(/\D/g, "")

    // Limit to 11 digits (DDD + number)
    if (value.length > 11) {
      value = value.slice(0, 11)
    }

    // Format as (XX) XXXXX-XXXX
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`
      if (value.length > 10) {
        value = `${value.slice(0, 10)}-${value.slice(10)}`
      }
    }

    setPhone(value)
    setError("")
  }

  const validatePhone = (phone: string) => {
    // Remove non-numeric characters for validation
    const numericPhone = phone.replace(/\D/g, "")

    if (numericPhone.length < 10) {
      return "Número incompleto. Digite DDD + número"
    }

    if (numericPhone.length > 11) {
      return "Número muito longo"
    }

    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate phone
    const validationError = validatePhone(phone)
    if (validationError) {
      setError(validationError)
      return
    }

    // Play click sound
    playSound("click")

    setIsSubmitting(true)

    try {
      // Send to webhook
      const response = await fetch("https://eogopw1zdil9z22.m.pipedream.net", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phone.replace(/\D/g, "") }),
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar")
      }

      // Success
      setIsSubmitted(true)
      playSound("success", 0.5)

      // Wait a moment before proceeding to quiz
      setTimeout(() => {
        onComplete()
      }, 1500)
    } catch (error) {
      setError("Erro ao enviar. Tente novamente.")
      console.error("Error submitting phone:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-lg border-2 border-pink-200"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-pink-800 mb-4 text-center">
        Você quer começar a ganhar renda extra vendendo recheios, ainda hoje?
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Digite seu número com DDD"
            className="h-12 text-base border-2 border-pink-200 focus-visible:ring-pink-500"
            disabled={isSubmitting || isSubmitted}
            maxLength={16}
            required
          />

          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>

        <Button
          type="submit"
          className={`w-full h-12 text-base font-bold transition-all ${
            isSubmitted ? "bg-green-500 hover:bg-green-600" : "bg-pink-500 hover:bg-pink-600"
          }`}
          disabled={isSubmitting || isSubmitted}
        >
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Enviado!
              </motion.div>
            ) : isSubmitting ? (
              <motion.div
                key="submitting"
                animate={{ rotate: 360 }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
              >
                <Send className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.span key="default">Eu quero!</motion.span>
            )}
          </AnimatePresence>
        </Button>

        <p className="text-sm text-center text-gray-600">Vamos te mostrar o caminho direto no WhatsApp.</p>
      </form>
    </motion.div>
  )
}
