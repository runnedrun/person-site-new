import type { MDXComponents } from "mdx/types"
import { PlaceTimeline } from "./components/about/PlaceTimeline"
import { AboutPopupTrigger } from "./components/about/AboutPopupTrigger"
import { MyTimeline } from "./components/about/MyTimeline"
import { AboutPopupDetails } from "./components/about/AboutPopupDetails"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Headings
    h1: (props) => <div className="mb-6 text-4xl font-bold" {...props} />,
    h2: (props) => <div className="mb-5 text-3xl font-bold" {...props} />,
    h3: (props) => <div className="mb-4 text-2xl font-bold" {...props} />,
    h4: (props) => <div className="mb-3 text-xl font-bold" {...props} />,
    h5: (props) => <div className="mb-2 text-lg font-bold" {...props} />,
    h6: (props) => <div className="mb-2 text-base font-bold" {...props} />,

    // Text elements
    p: (props) => <div className="mb-4 leading-relaxed" {...props} />,
    strong: (props) => <span className="font-bold" {...props} />,
    em: (props) => <span className="italic" {...props} />,

    // Lists
    ul: (props) => (
      <div className="mb-4 list-inside list-disc space-y-2" {...props} />
    ),
    ol: (props) => (
      <div className="mb-4 list-inside list-decimal space-y-2" {...props} />
    ),
    li: (props) => <div className="ml-4" {...props} />,

    // Blockquote
    blockquote: (props) => (
      <div className="my-4 border-l-4 border-gray-300 pl-4 italic" {...props} />
    ),

    // Code
    code: (props) => (
      <div
        className="rounded bg-gray-100 px-2 py-1 font-mono text-sm"
        {...props}
      />
    ),
    pre: (props) => (
      <div
        className="my-4 overflow-x-auto rounded bg-gray-100 p-4"
        {...props}
      />
    ),

    // Links
    a: (props) => (
      <a className="text-blue-600 underline hover:text-blue-800" {...props} />
    ),

    // Horizontal rule
    hr: () => <div className="my-8 border-t border-gray-300" />,
    PlaceTimeline: PlaceTimeline,
    AboutPopupDetails: AboutPopupDetails,
    MyTimeline: MyTimeline,
  }
}
