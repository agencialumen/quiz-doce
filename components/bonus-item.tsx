"use client"

import { Check } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

interface BonusItemProps {
  title: string
  imageSrc: string
  delay: number
}

export default function BonusItem({ title, imageSrc, delay }: BonusItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5 }}
      className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-pink-200"
    >
      <div className="relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden">
        <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-pink-800 truncate pr-1">{title}</p>
        <div className="flex items-center mt-1 flex-wrap">
          <span className="text-xs text-green-600 font-semibold mr-2">R$ 0,00</span>
          <span className="mt-1 px-1.5 py-0.5 bg-green-100 rounded text-[10px] text-green-700 flex items-center">
            <Check size={10} className="mr-0.5" />
            Desbloqueado
          </span>
        </div>
      </div>
    </motion.div>
  )
}
