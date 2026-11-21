const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

async function requestApi(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options)
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Backend-এর সাথে যোগাযোগ করা যাচ্ছে না। Backend চালু আছে কি না দেখুন।')
  }

  const result = await response.json().catch(() => null)

  if (!response.ok || result?.success === false) {
    const error = new Error(result?.message || `Request failed (${response.status})`)
    error.status = response.status
    error.code = result?.code
    throw error
  }

  return result
}

export default requestApi
