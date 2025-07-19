export interface AddressData {
  pincode: string
  city: string
  state: string
  country: string
}

// Mock data for Indian pincodes - in a real app, you'd use an API like India Post or Google Places
const pincodeData: Record<string, AddressData> = {
  "110001": { pincode: "110001", city: "New Delhi", state: "Delhi", country: "India" },
  "400001": { pincode: "400001", city: "Mumbai", state: "Maharashtra", country: "India" },
  "560001": { pincode: "560001", city: "Bangalore", state: "Karnataka", country: "India" },
  "600001": { pincode: "600001", city: "Chennai", state: "Tamil Nadu", country: "India" },
  "700001": { pincode: "700001", city: "Kolkata", state: "West Bengal", country: "India" },
  "500001": { pincode: "500001", city: "Hyderabad", state: "Telangana", country: "India" },
  "411001": { pincode: "411001", city: "Pune", state: "Maharashtra", country: "India" },
  "380001": { pincode: "380001", city: "Ahmedabad", state: "Gujarat", country: "India" },
  "302001": { pincode: "302001", city: "Jaipur", state: "Rajasthan", country: "India" },
  "226001": { pincode: "226001", city: "Lucknow", state: "Uttar Pradesh", country: "India" },
}

export async function getAddressFromPincode(pincode: string): Promise<AddressData | null> {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const cleanPincode = pincode.replace(/\D/g, "")

    if (cleanPincode.length !== 6) {
      return null
    }

    return pincodeData[cleanPincode] || null
  } catch (error) {
    console.error("Error fetching address from pincode:", error)
    return null
  }
}

export const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
]

export const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]
