import { AboutPopupTrigger } from "./AboutPopupTrigger"
import { PlaceTimeline } from "./PlaceTimeline"

export const DavidSummary = () => {
  return (
    <div className="">
      I&apos;ve lived in{" "}
      <AboutPopupTrigger
        popupContent={
          <div>
            <PlaceTimeline
              items={[
                { time: "1991-2009", place: "Gaithersburg, MD, USA" },
                { time: "2009-2013", place: "Needham, MA, USA" },
                { time: "Jan 2012-June 2012", place: "Leeds, UK" },
                { time: "2013-2016", place: "San Francisco, CA, USA" },
                { time: "Jan 2017-Aug 2017", place: "Hong Kong" },
                { time: "Aug 2017-Jan 2018", place: "Shanghai, China" },
                { time: "Jan 2018 - Jan 2018", place: "Okland, CA, USA" },
                { time: "Jan 2019-March 2020", place: "Nairobi, Kenya" },
                { time: "March 2020-November 2020", place: "Tokyo, Japan" },
                {
                  time: "November 2020-September 2021",
                  place: "Back in Nairobi",
                },
                {
                  time: "September 2021-May 2024",
                  place: "Geneva, Switzerland",
                },
                {
                  time: "August 2024-Present",
                  place: "Gothenburg, Sweden",
                },
              ]}
            />
            <div className="mt-4 text-sm text-muted-foreground">
              *Notable mention for New York City and London, where I lived, on
              and off, for 1 month at a time, when I was figuring out where to
              go next.
            </div>
          </div>
        }
      >
        11 cities on 4 continents.
      </AboutPopupTrigger>
      . I worked at Twitter through its IPO. I spent a lot of my 20&apos;s
      launching startups, including one which was acquired. I&apos;ve enjoyed
      some success and grown a lot through failure.{" "}
    </div>
  )
}
