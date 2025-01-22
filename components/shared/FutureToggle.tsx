import { Switch } from "@/components/ui/switch"
import { useAboutMode } from "@/components/shared/AboutModeContext"

export function FutureToggle() {
  const { aspirationalMode, setAspirationalMode } = useAboutMode()

  const toggleText = aspirationalMode ? "Aspirational David" : "Now David"

  return (
    <div className="flex flex-col items-center gap-2">
      <span className={`text-sm font-bold`}>{toggleText}</span>
      <Switch
        className="w-24 data-[state=checked]:bg-orange-400 data-[state=unchecked]:bg-input"
        checked={aspirationalMode}
        onCheckedChange={setAspirationalMode}
      />
    </div>
  )
}
