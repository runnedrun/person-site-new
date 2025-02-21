import {
  URLReaderTool,
  URLReaderConfig,
  URLReaderResponse,
  URLReaderError,
} from "@/types/URLReader"
import fetch from "node-fetch"
import { JSDOM } from "jsdom"

export type URLReaderInput = {
  url: string
  timeout?: number
  stripHtml?: boolean
}

export class URLReaderImpl implements URLReaderTool {
  name = "read_url"
  description = "Fetches and reads content from specified URLs"

  input_schema = {
    type: "object" as const,
    properties: {
      url: {
        type: "string" as const,
        description:
          "The URL to fetch content from. Must be a valid HTTP/HTTPS URL.",
      },
      timeout: {
        type: "number" as const,
        description: "Optional timeout in milliseconds (default: 5000)",
      },
      stripHtml: {
        type: "boolean" as const,
        description: "Whether to strip HTML tags from response (default: true)",
      },
    },
    required: ["url"] as string[],
  } as const

  private defaultTimeout = 5000
  private defaultMaxContentSize = 5 * 1024 * 1024 // 5MB
  private config: Required<URLReaderConfig>

  constructor(config: URLReaderConfig = {}) {
    this.config = {
      allowedDomains: config.allowedDomains || [],
      maxContentSize: config.maxContentSize || this.defaultMaxContentSize,
      allowRedirects: config.allowRedirects ?? true,
    }
  }

  private validateURL(url: string): boolean {
    try {
      const parsedUrl = new URL(url)
      if (!parsedUrl.protocol.startsWith("http")) {
        throw new Error(URLReaderError.INVALID_URL)
      }

      if (
        this.config.allowedDomains.length > 0 &&
        !this.config.allowedDomains.includes(parsedUrl.hostname)
      ) {
        throw new Error(URLReaderError.FORBIDDEN_DOMAIN)
      }

      return true
    } catch (error) {
      throw new Error(URLReaderError.INVALID_URL)
    }
  }

  private stripHtmlTags(html: string): string {
    const dom = new JSDOM(html)
    return dom.window.document.body.textContent || ""
  }

  async execute(params: URLReaderInput): Promise<URLReaderResponse> {
    try {
      this.validateURL(params.url)

      const controller = new AbortController()
      const timeoutId = setTimeout(
        () => controller.abort(),
        params.timeout || this.defaultTimeout
      )

      const response = await fetch(params.url, {
        redirect: this.config.allowRedirects ? "follow" : "error",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const contentLength = parseInt(
        response.headers.get("content-length") || "0"
      )
      if (contentLength > this.config.maxContentSize) {
        throw new Error(URLReaderError.CONTENT_TOO_LARGE)
      }

      let content = await response.text()
      if (params.stripHtml ?? true) {
        content = this.stripHtmlTags(content)
      }

      return {
        content,
        statusCode: response.status,
        contentType: response.headers.get("content-type") || "",
        timestamp: new Date(),
      }
    } catch (error: any) {
      return {
        content: "",
        statusCode: 0,
        contentType: "",
        timestamp: new Date(),
        error: error.message,
      }
    }
  }
}
