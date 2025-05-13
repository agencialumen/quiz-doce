"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface QuizProgressProps {
  currentStep: number
  totalSteps: number
}

export default function QuizProgress({ currentStep, totalSteps }: QuizProgressProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full mb-2 sm:mb-3">
      <Progress value={progress} className="h-2 sm:h-3 bg-pink-100" />

      <div className="flex justify-between mt-1">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <motion.div
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] sm:text-xs font-bold ${
                index + 1 <= currentStep ? "bg-pink-500 text-white" : "bg-pink-200 text-pink-600"
              }`}
              animate={index + 1 === currentStep ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            >
              {index + 1}
            </motion.div>
            <span className="text-[7px] sm:text-[9px] text-pink-600 mt-0.5 hidden xs:inline">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
