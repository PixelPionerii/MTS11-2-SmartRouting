const generativeModel = require("../config/vertexAi");
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

const getIssueType = async (requestTypePrompt) => {
    requestTypePrompt += "\nPlease respond ONLY with a JSON object in the following format:\n{\"requestType\": \"The selected request type\"}"
    const chat = generativeModel.startChat();
    const result = await chat.sendMessage(requestTypePrompt)

    const content = result.response?.candidates?.[0]?.content;
    let textReply = "";
    if (content) {
        if (Array.isArray(content)) {
            textReply = content.map((c) => (c.parts ? c.parts.map((p) => p.text).join(" ") : c.text)).join(" ");
        } else if (content.parts) {
            textReply = content.parts.map((p) => p.text).join(" ");
        }
    }

    const jsonMatch = textReply.match(/```json[\s\S]*?```/);

    if (jsonMatch) {
        textReply = textReply.replace(/```json|```/g, '').trim();
    }

    try {
        const parsed = JSON.parse(textReply);
        return parsed.requestType || "Other";
    } catch (err) {
        console.error("Failed to parse JSON:", err);
        return "Other";
    }
}

const createAgentMappingPrompt = async (agentMappingPromptTemplate, description, priority, requestType, customer) => {
    const agents = await prisma.agent.findMany({
        where: {
            isAdmin: false,
            availability: true
        }
    });

    agentRowTemplate = agentMappingPromptTemplate.match(/\[([\s\S]*?)\]/)[1]
    agentRowPrompt = agents.map(agent =>
        agentRowTemplate
            .replace('{agent.id}', agent.id)
            .replace('{agent.name}', agent.name)
            .replace('{agent.email}', agent.email)
            .replace('{agent.languagesKnown}', agent.languagesKnown)
            .replace('{agent.availability}', agent.availability ? 'yes' : 'no')
            .replace('{agent.skills}', agent.skills)
            .replace('{agent.currentWorkload}', agent.currentWorkload)
            .replace('{agent.rating}', (agent.totalRating / agent.issueResolvedCount).toFixed(2))
    ).join('\n')

    agentMappingPrompt = agentMappingPromptTemplate
        .replace('[' + agentRowTemplate + ']', agentRowPrompt)
        .replace('{request.description}', description)
        .replace('{request.type}', requestType)
        .replace('{request.priority}', priority)
        .replace('{customer.name}', customer.name)
        .replace('{customer.email}', customer.email)
        .replace('{customer.language}', customer.language)
        .replace('{customer.tier}', customer.tier)

    agentMappingPrompt = agentMappingPrompt + "\nPlease respond ONLY with a JSON object in the following format:\n{\"assignedAgentId\": <agent_id>,\"reason\": \"Brief explanation for the choice\"}"

    return agentMappingPrompt
}

const getSuitableAgent = async (agentMappingPrompt) => {
    const chat = generativeModel.startChat();
    const result = await chat.sendMessage(agentMappingPrompt)

    const content = result.response?.candidates?.[0]?.content;
    let textReply = "";
    if (content) {
        if (Array.isArray(content)) {
            textReply = content.map((c) => (c.parts ? c.parts.map((p) => p.text).join(" ") : c.text)).join(" ");
        } else if (content.parts) {
            textReply = content.parts.map((p) => p.text).join(" ");
        }
    }

    const jsonMatch = textReply.match(/```json[\s\S]*?```/);

    if (jsonMatch) {
        textReply = textReply.replace(/```json|```/g, '').trim();
    }

    try {
        const parsed = JSON.parse(textReply);
        return parsed;
    } catch (err) {
        console.error("Failed to parse JSON:", err);
        return null;
    }
} 

module.exports = { getIssueType, createAgentMappingPrompt, getSuitableAgent }
