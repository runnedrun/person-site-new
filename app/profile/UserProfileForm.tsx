"use client"

import { useState, useContext, useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { UserContext } from "@/data/auth/UserContext"
import { updateDoc } from "@/data/writer"
import { Check, Loader2 } from "lucide-react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Form schema for validation
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  displayName: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

// Status for the form saving indicator

export function UserProfileForm() {
  const { user, userProfile } = useContext(UserContext)
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | null>(null)

  // Set up the form with default values from the user profile
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: userProfile?.name?.first || "",
      lastName: userProfile?.name?.last || "",
      displayName: userProfile?.name?.displayName || "",
    },
  })

  const hideSaveIndicatorTimeout = useRef<NodeJS.Timeout | undefined>(undefined)
  const onFormChange = async (values: FormValues) => {
    if (!user?.uid) return

    setSaveStatus("saving")
    clearTimeout(hideSaveIndicatorTimeout.current)

    await updateDoc("userProfile", user.uid, {
      name: {
        first: values.firstName,
        last: values.lastName,
        displayName: values.displayName || undefined,
      },
    })

    hideSaveIndicatorTimeout.current = setTimeout(() => {
      setSaveStatus("saved")
      hideSaveIndicatorTimeout.current = setTimeout(() => {
        setSaveStatus(null)
      }, 2000)
    }, 1000)
  }

  // Handle individual field changes
  const handleFieldChange = (field: keyof FormValues) => {
    // Wait for validation to complete
    form.trigger(field).then((isValid) => {
      if (isValid) {
        onFormChange(form.getValues())
      }
    })
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    const first = form.watch("firstName") || ""
    const last = form.watch("lastName") || ""
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
  }

  // Skip rendering until we have user data
  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={userProfile?.profilePicture?.url || ""} />
          <AvatarFallback className="text-lg">
            {getInitials() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h2 className="text-2xl font-bold">Your Profile</h2>
          <p className="text-muted-foreground">
            Update your personal information
          </p>
        </div>

        {/* Status indicator */}
        {saveStatus && (
          <div className="ml-auto flex items-center space-x-2 text-sm">
            {saveStatus === "saving" && (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Saving...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Saved</span>
              </>
            )}
          </div>
        )}
      </div>

      <Form {...form}>
        <form onChange={() => {}} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onBlur={() => handleFieldChange("firstName")}
                      onChange={(e) => {
                        field.onChange(e)
                        // Trigger save on blur, not on every keystroke
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onBlur={() => handleFieldChange("lastName")}
                      onChange={(e) => {
                        field.onChange(e)
                        // Trigger save on blur, not on every keystroke
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display name (optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onBlur={() => handleFieldChange("displayName")}
                    onChange={(e) => {
                      field.onChange(e)
                    }}
                  />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed to other users. If
                  left empty, your full name will be used.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
