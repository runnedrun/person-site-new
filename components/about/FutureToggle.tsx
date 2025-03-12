import { Switch } from "@/components/ui/switch"
import { useAboutMode } from "@/components/shared/AboutModeContext"

export function FutureToggle() {
  const { aspirationalMode, setAspirationalMode } = useAboutMode()

  return (
    <div className="flex items-center gap-4">
      <div
        onClick={() => setAspirationalMode(false)}
        className={`cursor-pointer px-2 py-1 text-sm font-bold ${
          !aspirationalMode
            ? "rounded border-b-2 border-orange-400 bg-orange-100"
            : "opacity-50"
        }`}
      >
        now
      </div>
      <div className="flex items-center">
        <Switch
          className="w-12 data-[state=checked]:bg-orange-400 data-[state=unchecked]:bg-input"
          checked={aspirationalMode}
          onCheckedChange={setAspirationalMode}
        />
        <div className="text-sm text-gray-500">→</div>
      </div>
      <div
        onClick={() => setAspirationalMode(true)}
        className={`cursor-pointer px-2 py-1 text-sm font-bold ${
          aspirationalMode
            ? "rounded border-b-2 border-orange-400 bg-orange-100"
            : "opacity-50"
        }`}
      >
        future
      </div>
    </div>
  )
}
