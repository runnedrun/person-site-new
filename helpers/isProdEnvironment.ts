export const isStaging = !!process.env.NEXT_PUBLIC_IS_STAGING

export const isProd = !isStaging
