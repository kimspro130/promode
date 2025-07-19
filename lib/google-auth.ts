// Define the Google credential response type
export interface GoogleCredentialResponse {
  credential: string
  select_by: string
}

// Define the Google user data type
export interface GoogleUserData {
  email: string
  name: string
  given_name?: string
  family_name?: string
  picture?: string
  sub: string
}

// Google Client ID
export const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"

// Load the Google Sign-In script
export const loadGoogleScript = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the script is already loaded
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = (error) => reject(error)
    document.head.appendChild(script)
  })
}

// Initialize Google One Tap
export const initializeGoogleOneTap = (
  callback: (response: GoogleCredentialResponse) => void,
  autoSelect = false,
  cancelOnTapOutside = true,
): void => {
  if (!window.google) return

  const clientId = GOOGLE_CLIENT_ID // Replace with your actual client ID

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback,
    auto_select: autoSelect,
    cancel_on_tap_outside: cancelOnTapOutside,
    use_fedcm_for_prompt: true, // Enable FedCM for One Tap
  })
}

// Parse JWT token
export const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error parsing JWT:", error)
    return null
  }
}
