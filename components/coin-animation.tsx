"use client"

import { motion } from "framer-motion"
import { Coins } from "lucide-react"

interface CoinAnimationProps {
  value: number
  isSpending: boolean
}

export default function CoinAnimation({ value, isSpending }: CoinAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: isSpending ? -30 : 30, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: isSpending ? 30 : -30, scale: 0.5 }}
      className={`fixed bottom-1/3 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg ${
        isSpending ? "bg-red-100" : "bg-amber-100"
      }`}
    >
      <Coins size={20} className={isSpending ? "text-red-500" : "text-amber-500"} />
      <span className={`font-bold text-base sm:text-lg ${isSpending ? "text-red-600" : "text-amber-600"}`}>
        {isSpending ? "-" : "+"}
        {value}
      </span>
    </motion.div>
  )
}
