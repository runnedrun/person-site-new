interface TimelineItem {
  time: string
  place: string
}

interface PlaceTimelineProps {
  items: TimelineItem[]
}

export const PlaceTimeline = ({ items }: PlaceTimelineProps) => {
  return (
    <div className="relative pl-4">
      {/* Vertical line */}
      <div className="absolute bottom-2 left-[0.35rem] top-2 w-[2px] bg-muted-foreground/20" />

      {/* Timeline items */}
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            {/* Bullet point */}
            <div className="mt-[0.4rem] h-2 w-2 shrink-0 rounded-full bg-muted-foreground" />

            {/* Content */}
            <div>
              <div className="font-medium">{item.place}</div>
              <div className="text-sm text-muted-foreground">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
