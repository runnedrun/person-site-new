import Link from "next/link"
import { AboutPopupTrigger } from "./AboutPopupTrigger"

export const AboutPopupDetails = ({
  details,
  relatedContentLinks,
  children,
}: {
  details: string
  relatedContentLinks?: { href: string; title: string }[]
  children: React.ReactNode
}) => {
  return (
    <div className="inline-block">
      <AboutPopupTrigger
        popupContent={
          <div>
            <div>{details}</div>
            {relatedContentLinks?.length && (
              <div className="mt-2 text-sm text-muted-foreground">
                Related Essays:{" "}
                {relatedContentLinks.map((link) => (
                  <Link href={link.href} className="hover:underline">
                    {link.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        }
      >
        {children}
      </AboutPopupTrigger>
    </div>
  )
}
