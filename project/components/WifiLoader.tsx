'use client'

import { motion } from 'framer-motion';

interface WifiLoaderProps {
  text?: string;
}

export function WifiLoader({ text = "" }: WifiLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer Circle */}
        <motion.svg 
          className="absolute w-[86px] h-[86px]" 
          viewBox="0 0 86 86"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.circle
            cx={43}
            cy={43}
            r={40}
            fill="none"
            stroke="#c3c8de"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="62.75 188.25"
            transform="rotate(-100 43 43)"
            initial={{ strokeDashoffset: 25 }}
            animate={{
              strokeDashoffset: [25, 0, 301, 276, 276]
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0.3
            }}
          />
          <motion.circle
            cx={43}
            cy={43}
            r={40}
            fill="none"
            stroke="#0077FF"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="62.75 188.25"
            transform="rotate(-100 43 43)"
            initial={{ strokeDashoffset: 25 }}
            animate={{
              strokeDashoffset: [25, 0, 301, 276, 276]
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0.15
            }}
          />
        </motion.svg>

        {/* Middle Circle */}
        <motion.svg 
          className="absolute w-[60px] h-[60px]" 
          viewBox="0 0 60 60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <motion.circle
            cx={30}
            cy={30}
            r={27}
            fill="none"
            stroke="#c3c8de"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="42.5 127.5"
            transform="rotate(-100 30 30)"
            initial={{ strokeDashoffset: 17 }}
            animate={{
              strokeDashoffset: [17, 0, 204, 187, 187]
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0.25
            }}
          />
          <motion.circle
            cx={30}
            cy={30}
            r={27}
            fill="none"
            stroke="#0077FF"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="42.5 127.5"
            transform="rotate(-100 30 30)"
            initial={{ strokeDashoffset: 17 }}
            animate={{
              strokeDashoffset: [17, 0, 204, 187, 187]
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0.1
            }}
          />
        </motion.svg>

        {/* Inner Circle */}
        <motion.svg 
          className="absolute w-[34px] h-[34px]" 
          viewBox="0 0 34 34"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.circle
            cx={17}
            cy={17}
            r={14}
            fill="none"
            stroke="#c3c8de"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="22 66"
            transform="rotate(-100 17 17)"
            initial={{ strokeDashoffset: 9 }}
            animate={{
              strokeDashoffset: [9, 0, 106, 97, 97]
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0.2
            }}
          />
          <motion.circle
            cx={17}
            cy={17}
            r={14}
            fill="none"
            stroke="#0077FF"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="22 66"
            transform="rotate(-100 17 17)"
            initial={{ strokeDashoffset: 9 }}
            animate={{
              strokeDashoffset: [9, 0, 106, 97, 97]
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0.05
            }}
          />
        </motion.svg>
      </div>

      {/* Text */}
      <motion.div 
        className="mt-6 text-center relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.span 
          className="text-gray-600 text-sm font-medium"
          style={{
            clipPath: "inset(0 100% 0 0)"
          }}
          animate={{
            clipPath: [
              "inset(0 100% 0 0)",
              "inset(0 0 0 0)",
              "inset(0 0 0 100%)"
            ]
          }}
          transition={{
            duration: 3.6,
            ease: "easeInOut",
            repeat: Infinity
          }}
        >
          {text}
        </motion.span>
        <span className="absolute left-0 top-0 text-gray-600 text-sm font-medium">
          {text}
        </span>
      </motion.div>
    </div>
  );
}