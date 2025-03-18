"use client"

import { useContext } from "react"
import { UserContext } from "@/data/context/UserContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bot, Settings, MessageSquare, User } from "lucide-react"

export default function Dashboard() {
  const { user } = useContext(UserContext)

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome, {user?.displayName || user?.email?.split("@")[0] || "User"}
          </h1>
          <p className="text-muted-foreground">
            Manage your personal bot settings and information
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">
                <Bot className="mr-2 inline-block h-5 w-5" />
                My Bot
              </CardTitle>
              <CardDescription>
                Customize your personal bot's appearance and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="mt-2 w-full">
                <Link href="/bot-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Bot
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">
                <MessageSquare className="mr-2 inline-block h-5 w-5" />
                Knowledge Base
              </CardTitle>
              <CardDescription>
                Manage the information your bot knows about you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="mt-2 w-full">
                <Link href="/knowledge-base">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Edit Information
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">
                <User className="mr-2 inline-block h-5 w-5" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="mt-2 w-full">
                <Link href="/account-settings">
                  <User className="mr-2 h-4 w-4" />
                  Update Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
