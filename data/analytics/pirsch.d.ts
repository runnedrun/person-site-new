interface PirschEventData {
  duration?: number
  meta?: object
}

declare global {
  /**
   * Global Umami tracker instance
   * Available after the Umami script is loaded
   */
  const pirsch: (name: string, args: PirschEventData) => void
}

export {}
