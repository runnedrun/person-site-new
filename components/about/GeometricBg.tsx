"use client"
import { cn } from "@/lib/utils"
import type React from "react"
import colors from "tailwindcss/colors"
import { useAboutMode } from "./AboutModeContext"

const blurAmount = 0.3
export const GeometricBg: React.FC = () => {
  const { aspirationalMode } = useAboutMode()
  return (
    <div className="relative h-full overflow-hidden">
      <div
        className={cn(
          "absolute h-full w-[200%] transition-transform duration-1000 ease-in-out",
          aspirationalMode ? "translate-x-[-50%]" : "translate-x-0"
        )}
      >
        <div className="h-full w-full bg-gradient-to-r from-blue-50 via-blue-100/75 to-blue-200" />
      </div>
      {/* Abstract sun drawing */}
      <div
        className={`absolute -top-4 h-16 w-16 scale-100 transition-all duration-1000 ease-in-out md:-top-20 md:block md:h-80 md:w-80 ${
          aspirationalMode
            ? "-right-2 md:-right-20"
            : "right-[calc(100%-2.2rem)] md:right-[calc(100%-12rem)]"
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full transform transition-all duration-1000 ease-in-out"
          style={{
            transformOrigin: "center center",
            transform: `rotate(${aspirationalMode ? 0 : -180}deg)`,
          }}
        >
          <defs>
            <filter id="blur">
              <feGaussianBlur stdDeviation={blurAmount} />
            </filter>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="20"
            stroke={aspirationalMode ? colors.orange[600] : colors.orange[400]}
            strokeWidth="1"
            fill="none"
            filter="url(#blur)"
          />
          {/* Sun rays */}
          <g transform="rotate(0 50 50)" filter="url(#blur)">
            {[...Array(12)].map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="25"
                x2="50"
                y2="15"
                stroke={
                  aspirationalMode ? colors.orange[600] : colors.orange[400]
                }
                strokeWidth="1"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
