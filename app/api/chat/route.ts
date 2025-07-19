import { NextResponse } from "next/server"

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
const API_KEY = "AIzaSyDDlI9SFxFmqo3KiC9OiTcmDKL3Yv7EUQI"

export async function POST(request: Request) {
  try {
    const { messages, isFashionQuery } = await request.json()

    // Get the last user message
    const userMessage = messages.filter((msg: any) => msg.role === "user").pop()?.content || ""

    // If it's a fashion query, use the fashion API
    if (isFashionQuery) {
      try {
        const fashionPrompt = `
  You are a fashion expert assistant for a thrift clothing store called "PROMODE".
  Provide helpful, detailed fashion advice based on the following query.
  Focus on sustainable fashion, vintage styling, and practical outfit recommendations.
  
  User query: ${userMessage}
`
        const fashionResponse = await fetch("/api/fashion-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: fashionPrompt }),
        })

        if (fashionResponse.ok) {
          const fashionData = await fashionResponse.json()
          return NextResponse.json({ response: fashionData.response })
        }
      } catch (error) {
        console.error("Fashion API error:", error)
        // Fall back to Gemini if fashion API fails
      }
    }

    // Format conversation history for Gemini
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

    // Prepare the request body for Gemini
    const requestBody = {
      contents: formattedMessages,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    }

    console.log("Sending to Gemini:", JSON.stringify(requestBody))

    // Call the Gemini API
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      console.error("Gemini API error status:", response.status)
      const errorText = await response.text()
      console.error("Gemini API error:", errorText)

      // Try a simpler approach if the conversation format fails
      const simpleRequestBody = {
        contents: [{ parts: [{ text: userMessage }] }],
      }

      const simpleResponse = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(simpleRequestBody),
      })

      if (!simpleResponse.ok) {
        throw new Error(`Gemini API request failed with status ${simpleResponse.status}`)
      }

      const simpleData = await simpleResponse.json()
      const aiResponse =
        simpleData?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not generate a response."

      return NextResponse.json({ response: aiResponse })
    }

    const data = await response.json()
    let aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not generate a response."

    // Clean up markdown formatting that might appear as plain text
    aiResponse = aiResponse.replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
    aiResponse = aiResponse.replace(/\*(.*?)\*/g, "$1") // Remove italic markdown

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { response: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment." },
      { status: 200 }, // Return 200 to show a friendly message to the user
    )
  }
}
