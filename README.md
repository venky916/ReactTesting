// ============================================
// SUMMARY OF ERROR HANDLING STRATEGY:
// ============================================

/*
1. ERROR BOUNDARIES (for React component errors):
   - App level: Catches catastrophic errors
   - Page level: Isolates page errors
   - Component level: Graceful degradation

2. API ERRORS (manual handling):
   - Try-catch in async functions
   - Custom ApiError class
   - Toast notifications
   - useApiCall hook for consistency

3. ERROR DISPLAY:
   - 4XX errors → Toast + inline message
   - 5XX errors → Toast + "Try again" button
   - Component errors → Error boundary fallback
   - Loading states → Skeleton/spinner

4. ERROR TRACKING:
   - Development: console.error
   - Production: Sentry/LogRocket
   - Analytics: Track error rates

5. USER EXPERIENCE:
   - Clear error messages
   - Recovery options (retry, go back)
   - Don't break entire app
   - Maintain navigation
*/

// ============================================
// SUMMARY: AXIOS ERROR HANDLING
// ============================================
/*
1. INTERCEPTORS:
   - Request: Add auth token, headers
   - Response: Handle errors globally

2. ERROR TYPES:
   - error.response → Server responded with error (4XX, 5XX)
   - error.request → No response received (network error)
   - error.message → Something else (config error)

3. STATUS CODES:
   - 400: Bad Request
   - 401: Unauthorized → Redirect to login
   - 403: Forbidden
   - 404: Not Found
   - 422: Validation Error → Show field errors
   - 429: Rate Limited
   - 500: Server Error

4. DISPLAY:
   - Global errors → Toast (in interceptor)
   - Validation errors → Inline (in component)
   - Network errors → Toast + retry button

5. TESTING:
   - Mock axios instance
   - Mock specific methods (get, post, etc.)
   - Test success and error cases
*/

✅ Component render errors
✅ null/undefined access
✅ Library crashes
✅ JavaScript errors in components

✅ 400 Bad Request → Toast: "Invalid data"
✅ 401 Unauthorized → Redirect to login
✅ 403 Forbidden → Toast: "No permission"
✅ 404 Not Found → Toast: "Resource not found"
✅ 500 Server Error → Toast: "Server error, try again"

Error           TypeDisplay                     MethodExample
API4XX              Toast + Inline               "Email already exists"
API5XX              Toast + Retry button         "Server error. Try again?"
Component crash     Error Boundary                "This section unavailable"
Form validation     Inline below field             "Password too short"
Network error       Toast + Offline indicator      "No internet connection"


// 1. App.tsx
<ErrorBoundary level="app">  {/* Catches catastrophic errors */}
  <ToastContainer />  {/* For API errors */}
  <Layout>
    <ErrorBoundary level="page">  {/* Per-page isolation */}
      <Outlet />  {/* Your routes */}
    </ErrorBoundary>
  </Layout>
</ErrorBoundary>

// 2. In each component with API calls
function UserList() {
  const { execute, loading, error } = useApiCall();
  
  const loadUsers = async () => {
    const response = await fetch('/api/users');
    if (!response.ok) {
      await handleApiError(response);  // Shows toast
    }
    return response.json();
  };
  
  // Error already shown in toast!
  // Component shows loading/error states
}

// 3. Wrap risky components
<ErrorBoundary level="component">
  <ComplexChart data={data} />  {/* If crashes, shows fallback */}
</ErrorBoundary>

// API calls → try/catch + toast
try {
  const data = await fetchData();
} catch (error) {
  toast.error(error.message);
}

// Component errors → Error Boundary
<ErrorBoundary>
  <Component />
</ErrorBoundary>

// Form validation → Inline errors
{errors.email && <span>{errors.email}</span>}

// Loading states → Skeleton/Spinner
{loading ? <Spinner /> : <Content />}


with axios error handling
1. User makes request
   ↓
2. Request Interceptor
   - Adds auth token
   - Adds headers
   ↓
3. Server Response
   ↓
4. Response Interceptor
   - If 2XX → Success ✅
   - If 4XX/5XX → Error ❌
   ↓
5. Error Handling
   - 401 → Logout + redirect
   - 403 → Show "No permission"
   - 404 → Show "Not found"
   - 422 → Show validation errors
   - 500 → Show "Server error"
   ↓
6. Component handles result
   - Success → Update UI
   - Error → Show error state