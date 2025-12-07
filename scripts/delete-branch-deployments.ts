import { execSync } from "child_process"

const run = async () => {
  console.log("Fetching all projects...")

  const projectsOutput = execSync("vercel project ls", { encoding: "utf-8" })
  const projectLines = projectsOutput.split("\n")

  const projects: string[] = []
  let foundHeader = false

  for (const line of projectLines) {
    if (line.includes("Project Name")) {
      foundHeader = true
      continue
    }

    if (foundHeader) {
      const trimmed = line.trim()
      if (trimmed) {
        const projectName = trimmed.split(/\s+/)[0]
        if (projectName) {
          projects.push(projectName)
        }
      }
    }
  }

  console.log(`Found ${projects.length} projects: ${projects.join(", ")}`)

  let totalDeleted = 0

  for (const project of projects) {
    console.log(`\n========== Processing project: ${project} ==========`)

    while (true) {
      console.log("\nFetching deployments...")

      let allDeployments: { url: string }[] = []
      let nextToken: string | null = null

      while (true) {
        const cmd = nextToken
          ? `vercel list ${project} --next ${nextToken}`
          : `vercel list ${project}`
        let listOutput: string
        try {
          listOutput = execSync(cmd, { encoding: "utf-8" })
        } catch {
          console.log(`Could not list deployments for ${project}, skipping...`)
          break
        }

        const lines = listOutput.split("\n")

        for (const line of lines) {
          if (line.includes(".vercel.app") && line.includes("Preview")) {
            const match = line.match(/https:\/\/[^\s]+/)
            if (match) {
              allDeployments.push({ url: match[0] })
            }
          }
        }

        const nextMatch = listOutput.match(/vercel ls --next (\d+)/)
        if (nextMatch) {
          nextToken = nextMatch[1]
        } else {
          break
        }
      }

      console.log(
        `Found ${allDeployments.length} branch deployments to delete in ${project}`
      )

      if (allDeployments.length === 0) {
        console.log(`No more branch deployments to delete in ${project}!`)
        break
      }

      for (const deployment of allDeployments) {
        console.log(`Deleting deployment ${deployment.url}...`)
        execSync(`vercel rm ${deployment.url} --yes`, { stdio: "inherit" })
        totalDeleted++
      }
    }
  }

  console.log(`\nDone! Deleted ${totalDeleted} total branch deployments.`)
}

run().catch(console.error)
