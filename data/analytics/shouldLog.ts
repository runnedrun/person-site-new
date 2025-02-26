export const shouldLog = () => {
  return true
  return process.env.NODE_ENV !== "development"
}
