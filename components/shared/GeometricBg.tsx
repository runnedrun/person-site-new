import type React from "react"
import colors, { blue } from "tailwindcss/colors"
import { useAboutMode } from "./AboutModeContext"
import { cn } from "@/lib/utils"

const blurAmount = 0.3
export const GeometricBg: React.FC = () => {
  const { aspirationalMode } = useAboutMode()
  return (
    <div
      className={cn(
        "relative h-full overflow-hidden bg-blue-50 transition-colors duration-1000 ease-in-out",
        {
          "bg-blue-50": !aspirationalMode,
          "bg-blue-100/75": aspirationalMode,
        }
      )}
    >
      {/* Abstract sun drawing */}
      <div
        className={`absolute h-80 w-80 transition-all duration-1000 ease-in-out ${
          aspirationalMode
            ? "-right-20 -top-20 scale-100"
            : "-top-20 right-[calc(100%-12rem)] scale-100"
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
      {/* Geometric background elements */}
      {/* <div className="absolute -right-20 -top-20 h-80 w-80 -rotate-12 scale-110 transform rounded-3xl bg-blue-300 opacity-70 mix-blend-multiply blur-xl filter"></div> */}
      {/* <div className="absolute -bottom-20 -left-20 h-80 w-80 rotate-45 rounded-3xl bg-blue-100 opacity-70 mix-blend-multiply blur-xl filter"></div> */}
      <div
        className={cn(
          "absolute -bottom-20 -right-20 h-56 w-56 -rotate-45 scale-110 transform rounded-full bg-blue-300 opacity-70 mix-blend-multiply blur-xl filter"
        )}
      ></div>
    </div>
  )
}
