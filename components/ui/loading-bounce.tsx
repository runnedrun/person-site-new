export const LoadingBounce = () => {
  return (
    <div className="flex items-center gap-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></span>
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></span>
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>
    </div>
  )
}
