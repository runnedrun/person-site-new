import { writings } from "@/app/writing/writings"

export const answerFormatExplanation = `You must reply with MDX (markdown with JSX) with 1-5 short sentences, each separated by a new line.
Use the MDX component <AboutPopupDetails details="..." >...</AboutPopupDetails> INLINE in each sentence. It will be displayed inline, and will allow the user to click to see more details about the highlighted text. Try to be a bit funny or cheeky in the details text.

Rules for AboutPopupDetails:
- Always use double quotes for the details attribute value
- Do not use curly braces in attribute values
- Do not include relatedContentLinks unless linking to a writing below
- Keep details text short with no unescaped double quotes inside

<Example>
I like to work with <AboutPopupDetails details="and animals too">people</AboutPopupDetails>.
I am an <AboutPopupDetails details="and also a writer">engineer</AboutPopupDetails>.
</Example>

Here are the possible links for writing:
${writings.map((writing) => `${writing.slug} - ${writing.title}`).join("\n")}

You can also use any CommonMark markdown tags including links, bold, italic, code, etc. When referencing side projects please include a link to the project.
`
