"use client"
import { buildDataContext } from "@/data/context/buildDataContext"
import { surveysDataFunctions } from "./surveysDataFunctions"
import { ServerDataReceiverComponent } from "@/data/ServerDataReceiverComponent"
import { useContext } from "react"
import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createDoc } from "@/data/writer"

export const [SurveysContext, ProvideSurveysContext] = buildDataContext(
  surveysDataFunctions.surveysData
)

const SurveyForm = () => {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      questions: [
        {
          id: "1",
          type: "text" as "text" | "select" | "multiselect" | "radio",
          question: "",
          required: false,
          options: [],
        },
      ],
    },
    onSubmit: async ({ value }) => {
      try {
        await createDoc("surveys", {
          title: value.title,
          description: value.description,
          questions: value.questions.map((q, index) => ({
            ...q,
            id: String(index + 1),
          })),
        })
        form.reset()
      } catch (error) {
        console.error("Error submitting survey:", error)
      }
    },
  })

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Create New Survey</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <Label htmlFor="title">Survey Title</Label>
          <form.Field
            name="title"
            children={(field) => (
              <Input
                id="title"
                placeholder="Enter survey title"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="description">Survey Description</Label>
          <form.Field
            name="description"
            children={(field) => (
              <Input
                id="description"
                placeholder="Enter survey description"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Questions</h2>
          <form.Field
            name="questions"
            mode="array"
            children={(questionsField) => (
              <>
                {questionsField.state.value.map((_, index) => (
                  <div key={index} className="space-y-4 rounded-lg border p-4">
                    <form.Field
                      name={`questions[${index}].question`}
                      children={(field) => (
                        <div className="space-y-2">
                          <Label>Question {index + 1}</Label>
                          <Input
                            placeholder="Enter your question"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      )}
                    />

                    <form.Field
                      name={`questions[${index}].type`}
                      children={(field) => (
                        <div className="space-y-2">
                          <Label>Question Type</Label>
                          <Select
                            value={field.state.value}
                            onValueChange={(
                              value: "text" | "select" | "multiselect" | "radio"
                            ) => field.handleChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select question type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="select">
                                Single Select
                              </SelectItem>
                              <SelectItem value="multiselect">
                                Multi Select
                              </SelectItem>
                              <SelectItem value="radio">Radio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />

                    <form.Field
                      name={`questions[${index}].required`}
                      children={(field) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`required-${index}`}
                            checked={field.state.value}
                            onCheckedChange={(checked) =>
                              field.handleChange(!!checked)
                            }
                          />
                          <Label htmlFor={`required-${index}`}>Required</Label>
                        </div>
                      )}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    questionsField.pushValue({
                      id: String(questionsField.state.value.length + 1),
                      type: "text" as
                        | "text"
                        | "select"
                        | "multiselect"
                        | "radio",
                      question: "",
                      required: false,
                      options: [],
                    })
                  }}
                >
                  Add Question
                </Button>
              </>
            )}
          />
        </div>

        <Button type="submit">Create Survey</Button>
      </form>
    </div>
  )
}

const SurveyList = () => {
  const { surveys } = useContext(SurveysContext)

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="mb-4 text-xl font-semibold">Existing Surveys</h2>
      <div className="space-y-4">
        {surveys?.map((survey) => (
          <div key={survey.uid} className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">{survey.title}</h3>
            <p className="text-gray-600">{survey.description}</p>
            <p className="mt-2 text-sm text-gray-500">
              Created: {survey.createdAt.toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export const SurveysClientDataProviders: ServerDataReceiverComponent<
  typeof surveysDataFunctions
> = ({ params, _initialValues }) => {
  return (
    <ProvideSurveysContext
      params={params}
      _initialValues={_initialValues?.surveysData}
    >
      <div className="container mx-auto py-8">
        <SurveyForm />
        <SurveyList />
      </div>
    </ProvideSurveysContext>
  )
}
