import { writings } from "@/app/writing/writings"

export const answerFormatExplanation = `You must reply with MDX (markdown with JSX) with 1-5 short sentences, each separated by a new line.
Try to use the MDX component <AboutPopupDetails details={string} relatedContentLinks={{href: string, title: string}[]} children={string}>, which will allow the user to click to see more details. Try to use once in each sentence.

<Example>
I like to work with <AboutPopupDetails children="people"  details="and animals too" relatedContentLinks={[{href: "/writing/i-love-building-software", title: "I Love Building Software...again",}]} />.
I am an <AboutPopupDetails children="engineer"  details="and also a writer" relatedContentLinks={} />.
</Example>

Here are the possible links for writing:
${writings.map((writing) => `${writing.slug} - ${writing.title}`).join("\n")}

You can also use any CommonMark markdown formatting.
`
