/**
 * Interface for a tool that allows Claude to fetch and read URL contents
 */
export interface URLReaderTool {
  /**
   * Name of the tool for identification
   */
  name: string

  /**
   * Description of what the tool does
   */
  description: string

  /**
   * Schema for tool input following Claude's tool use specification
   */
  input_schema: {
    type: "object"
    properties: {
      url: {
        type: "string"
        description: string
      }
      timeout?: {
        type: "number"
        description: string
      }
      stripHtml?: {
        type: "boolean"
        description: string
      }
    }
    required: string[]
  }

  /**
   * Method to execute the URL reading operation
   */
  execute: (params: {
    url: string
    timeout?: number
    stripHtml?: boolean
  }) => Promise<URLReaderResponse>
}

/**
 * Response structure for the URL reading operation
 */
export interface URLReaderResponse {
  /**
   * The content retrieved from the URL
   */
  content: string

  /**
   * HTTP status code from the request
   */
  statusCode: number

  /**
   * Content type of the response
   */
  contentType: string

  /**
   * Timestamp when the URL was accessed
   */
  timestamp: Date

  /**
   * Any errors that occurred during the operation
   */
  error?: string
}

/**
 * Configuration for the URL reader
 */
export interface URLReaderConfig {
  /**
   * List of allowed domains
   * Empty array means all domains are allowed
   */
  allowedDomains?: string[]

  /**
   * Maximum content size in bytes that can be fetched
   * Default: 5MB
   */
  maxContentSize?: number

  /**
   * Whether to allow redirects
   * Default: true
   */
  allowRedirects?: boolean
}

/**
 * Error types specific to URL reading operations
 */
export enum URLReaderError {
  INVALID_URL = "INVALID_URL",
  TIMEOUT = "TIMEOUT",
  FORBIDDEN_DOMAIN = "FORBIDDEN_DOMAIN",
  CONTENT_TOO_LARGE = "CONTENT_TOO_LARGE",
  NETWORK_ERROR = "NETWORK_ERROR",
  PARSE_ERROR = "PARSE_ERROR",
}
