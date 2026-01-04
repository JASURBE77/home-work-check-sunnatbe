export async function generateSmartReply(message) {
  try {
    const res = await fetch("http://localhost:3001/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    return data.text;
  } catch (err) {
    console.error("Frontend Error:", err);
    return "Uzr, xatolik yuz berdi 🤖";
  }
}
