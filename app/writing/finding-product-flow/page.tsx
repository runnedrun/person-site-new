import WritingLayout from "../WritingLayout"
import ProductFlow from "./product_flow.mdx"
import dayjs from "dayjs"

export default function FindingProductFlow() {
  return (
    <WritingLayout
      header="Finding Product Flow"
      forewords={[
        {
          date: dayjs("2025-02-23").toDate(),
          text: (
            <div className="flex flex-col gap-4">
              I wrote this in 2019, during a time when I was trying to stop
              coding myself, and instead get things done by directing the
              efforts of other software engineers, as a Head of Product, then a
              product consultant. I was doing this for two reasons:
              <div>
                1) I was afraid that technical jobs would go away due to AI, and
                a general deprofesionalization of the software industry. To be
                clear, a lot of my past companies were trying to make this
                happen faster, so, while I feared this, I also kind of welcomed
                it.
              </div>
              <div>
                2) I believed that I might actually enjoy PMing more than
                coding, because I could have more impact on a product.
              </div>
              <div>
                After 2 years of this, I realized that, while my fear of coding
                jobs going away may be valid, it shouldn't play a part in my
                decision making today. I love software engineering, and I'm
                fortunate enough that I can be paid to do it. As long as that's
                the case, I'm going to write code.
              </div>
              <div>
                I also realized that PMing means different things in different
                contexts, but most of them time, when I was paid to manage a
                product, it meant doing tasks that were closer to project
                managent. This kind of work is important, but I'm not very good
                at it, nor do I enjoy it. The kind of product exploration I
                enjoyed was easiest to do when I had my own projects— which
                meant I had to get back to coding myself.
              </div>
            </div>
          ),
        },
      ]}
    >
      <ProductFlow />
    </WritingLayout>
  )
}
