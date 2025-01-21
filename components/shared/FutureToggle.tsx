import { Switch } from "@/components/ui/switch"
import { useAboutMode } from "@/components/shared/AboutModeContext"

export function FutureToggle() {
  const { aspirationalMode, setAspirationalMode } = useAboutMode()

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm ${!aspirationalMode ? 'font-bold' : ''}`}>Now</span>
      <Switch
        className="w-24 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
        checked={aspirationalMode}
        onCheckedChange={setAspirationalMode}
      />
      <span className={`text-sm ${aspirationalMode ? 'font-bold' : ''}`}>Future</span>
    </div>
  )
}