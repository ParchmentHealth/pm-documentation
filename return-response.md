# Standardized External API Response Structure

1. Success Response Format (RFC 7807 compliant)

```
  interface ExternalApiResponse<T = any> {
    success: true
    statusCode: number
    message: string
    data: T
    timestamp: string
    requestId: string
    pagination?: {
      count: number
      hasNext: boolean
      limit: number
      offset: number
      lastKey: string | null
    }
  }
```

2. Error Response Format (RFC 7807 Problem Details)

```
  interface ExternalApiErrorResponse {
    success: false
    statusCode: number
    error: {
      type: string           // URI that identifies the problem type
      title: string          // Human-readable summary
      detail: string         // Human-readable explanation
      instance?: string      // URI reference to specific occurrence
    }
    timestamp: string
    requestId: string
  }
```

3. HTTP Status Code Standards

## Success Codes:

- 200 OK - Successful GET, PUT, PATCH
- 201 Created - Successful POST (resource creation)
- 202 Accepted - Request accepted for processing (conflicts found)
- 204 No Content - Successful DELETE

## Error Codes:

- 400 Bad Request - Invalid request data/parameters
- 401 Unauthorized - Authentication required/failed
- 403 Forbidden - Authorization failed
- 404 Not Found - Resource not found
- 409 Conflict - Business logic conflict
- 422 Unprocessable Entity - Validation errors
- 429 Too Many Requests - Rate limiting
- 500 Internal Server Error - Unexpected server error
- 503 Service Unavailable - External service unavailable
