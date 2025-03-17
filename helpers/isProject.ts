const projectMap = {
  staging: "personal-site-staging-a1f3",
  prod: "david-qa",
}

export const isProject = (projectName: keyof typeof projectMap) => {
  return (
    projectMap[projectName] ===
    process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_PROJECT_ID
  )
}
