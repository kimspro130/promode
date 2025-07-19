import { NextResponse } from "next/server"

const H_AND_M_API_URL = "https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list"
const RAPIDAPI_KEY = "b127ea59b0msh0f67fd6b2b5df05p120229jsn7f4c7d1302e4"
const RAPIDAPI_HOST = "apidojo-hm-hennes-mauritz-v1.p.rapidapi.com"

// Fallback to Gemini if H&M API fails
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
const GEMINI_API_KEY = "AIzaSyDDlI9SFxFmqo3KiC9OiTcmDKL3Yv7EUQI"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    console.log("Fashion AI received message:", message)

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ response: "Invalid input received. Please enter a valid fashion-related query." })
    }

    const userQuery = message.toLowerCase().trim()

    // Try to get fashion recommendations from H&M API
    try {
      const categoryMapping: { [key: string]: string } = {
        shirt: "men_all_tops",
        top: "men_all_tops",
        tee: "men_all_tops",
        jeans: "men_jeans",
        pants: "men_jeans",
        trousers: "men_jeans",
        jacket: "men_jacketscoats",
        coat: "men_jacketscoats",
        dress: "ladies_dresses",
        shoes: "men_shoes",
        footwear: "men_shoes",
      }

      let category = "all"
      let searchQuery = "fashion"

      for (const [key, value] of Object.entries(categoryMapping)) {
        if (userQuery.includes(key)) {
          category = value
          searchQuery = key
          break
        }
      }

      console.log("Category Selected:", category)

      const productResponse = await fetch(
        `${H_AND_M_API_URL}?country=us&lang=en&currentpage=0&pagesize=5&categories=${category}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": RAPIDAPI_HOST,
            "x-rapidapi-key": RAPIDAPI_KEY,
          },
        },
      )

      if (productResponse.ok) {
        const productData = await productResponse.json()

        if (productData.results && productData.results.length > 0) {
          let response = `Here are some recommendations for ${searchQuery}:\n\n`

          productData.results.slice(0, 3).forEach((product: any, index: number) => {
            response += `${index + 1}. **${product.name}**\n`
            response += `   Price: $${product.price.value}\n`
            if (product.description) {
              response += `   Description: ${product.description}\n`
            }
            response += "\n"
          })

          response += `Would you like more details on any of these items?`

          // Clean up markdown formatting that might appear as plain text
          response = response.replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
          response = response.replace(/\*(.*?)\*/g, "$1") // Remove italic markdown

          return NextResponse.json({ response })
        }
      }

      // If H&M API fails or returns no results, fall back to Gemini
      throw new Error("H&M API failed or returned no results")
    } catch (error) {
      console.error("Error with H&M API, falling back to Gemini:", error)

      // Fall back to Gemini for fashion advice
      const fashionPrompt = `
        You are a fashion expert assistant for a thrift clothing store called "The Akaal Thrifts".
        Provide helpful, detailed fashion advice based on the following query.
        Focus on sustainable fashion, vintage styling, and practical outfit recommendations.
        
        User query: ${message}
      `

      const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fashionPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      })

      if (!geminiResponse.ok) {
        throw new Error(`Gemini API request failed with status ${geminiResponse.status}`)
      }

      const geminiData = await geminiResponse.json()
      const aiResponse =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I could not generate fashion advice at the moment."

      return NextResponse.json({ response: aiResponse })
    }
  } catch (error) {
    console.error("Error in fashion AI API:", error)
    return NextResponse.json(
      { response: "I'm having trouble accessing fashion information right now. Please try again in a moment." },
      { status: 200 },
    )
  }
}
