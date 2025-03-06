import { defineArrayMember, defineField, defineType } from "@sanity-typed/types"
export const aboutSchema = defineType({
  name: "about" as const,
  type: "document",
  title: "About",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "secretAboutContent",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      title: "About content",
    }),
  ],
})
