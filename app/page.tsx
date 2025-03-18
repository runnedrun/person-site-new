import HomePage from "@/components/home/HomePage"

export default function Home() {
  return <HomePage />
}

export async function generateMetadata() {
  return {
    title: "Writtin",
    description: "You + Bot",
  }
}
