import { useContext } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserContext } from "@/data/context/UserContext"
import { ArrowRight, Bot, MessageSquare, User } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, loading } = useContext(UserContext)

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full">
        <div className="container mx-auto flex flex-col items-center py-20 text-center">
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
            Create Your Personal AI Bot
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-muted-foreground">
            Build a personalized AI bot that knows all about you and can answer
            questions from your friends, family, and colleagues.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {!loading &&
              (isAuthenticated ? (
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link href="/sign_in">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg">
                    <Link href="/example">See Demo</Link>
                  </Button>
                </>
              ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-muted py-20">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            Why Create Your Personal Bot?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Personalized Responses</h3>
              <p className="text-muted-foreground">
                Your bot learns about you and provides accurate information to
                anyone who asks.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Answer Questions</h3>
              <p className="text-muted-foreground">
                Let your bot handle common questions about your background,
                skills, or interests.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Save Time</h3>
              <p className="text-muted-foreground">
                Free yourself from answering the same questions repeatedly by
                letting your bot do it for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20">
        <div className="container mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            Ready to Create Your Personal Bot?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Join now and start building your personalized AI bot in minutes.
            It's easy, fun, and incredibly useful!
          </p>
          {!loading && !isAuthenticated && (
            <Button asChild size="lg">
              <Link href="/sign_in">
                Create Your Bot Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
