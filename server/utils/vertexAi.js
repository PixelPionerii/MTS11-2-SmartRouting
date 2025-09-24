const { VertexAI, HarmCategory, HarmBlockThreshold } = require("@google-cloud/vertexai");

const project = process.env.GOOGLE_CLOUD_PROJECT || "smart-routing-ai-system";
const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
const model = "gemini-2.5-pro";

const vertexAI = new VertexAI({ project, location });
const generativeModel = vertexAI.getGenerativeModel({
    model,
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ],
    generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.2,
    },
});

const chat = generativeModel.startChat();

chat.sendMessage("nan than da leo").then((result) => {
    
    const content = result.response?.candidates?.[0]?.content;
    let textReply = "";
    if (content) {
        if (Array.isArray(content)) {
            textReply = content.map((c) => (c.parts ? c.parts.map((p) => p.text).join(" ") : c.text)).join(" ");
        } else if (content.parts) {
            textReply = content.parts.map((p) => p.text).join(" ");
        }
    }
    console.log(textReply)
});
    