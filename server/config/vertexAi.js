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

module.exports = generativeModel