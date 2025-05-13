"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { X } from "lucide-react"

type NotificationType = {
  id: number
  name: string
  message: string
  time: string
  avatar: string
}

interface NotificationToastProps {
  notification: NotificationType
  onClose: () => void
}

export default function NotificationToast({ notification, onClose }: NotificationToastProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 left-4 right-4 z-50 max-w-[90%] w-[90%] mx-auto bg-white rounded-lg shadow-lg border border-pink-200 overflow-hidden"
    >
      <div className="p-3 flex items-start gap-3">
        <div className="flex-shrink-0">
          <Image
            src={notification.avatar || "/placeholder.svg?height=40&width=40"}
            width={40}
            height={40}
            alt={notification.name}
            className="rounded-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-sm text-pink-800 truncate pr-1">{notification.name}</p>
            <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1 break-words pr-2">{notification.message}</p>
        </div>
        <button onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600 ml-1 p-1">
          <X size={16} />
        </button>
      </div>
      <div className="h-1 bg-pink-500 animate-[shrink_5s_linear]"></div>
    </motion.div>
  )
}
