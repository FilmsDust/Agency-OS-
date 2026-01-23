
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Invoice, ProposalSection } from "../types";

export const getFinancialInsights = async (
  transactions: Transaction[],
  invoices: Invoice[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Act as a Senior Financial Auditor for AdvertsGen Agency. 
    Analyze this PKR transactional data:
    Transactions: ${JSON.stringify(transactions)}
    Invoices: ${JSON.stringify(invoices)}
    
    Provide a professional Audit Report in plain language.
    Include operating efficiency, cash leaks, and actionable growth tips for Pakistan.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Unable to generate audit findings.";
  } catch (error) {
    console.error("Audit Error:", error);
    return "System offline.";
  }
};

export const chatWithAssistant = async (
  query: string,
  transactions: Transaction[],
  invoices: Invoice[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are the AdvertsGen Finance Assistant. 
    Current Data:
    Transactions: ${JSON.stringify(transactions)}
    Invoices: ${JSON.stringify(invoices)}

    User Query: "${query}"

    Rules:
    - Answer in plain, helpful language.
    - Be concise (max 3-4 sentences).
    - If asked about specific numbers, calculate them accurately from the data provided.
    - Always use PKR (Rs.) for money.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "I'm sorry, I couldn't process that. Try asking about your profit or expenses.";
  } catch (error) {
    return "Error connecting to AI. Please try again later.";
  }
};

export const generateTemplateProposal = async (
  clientName: string,
  industry: string,
  projectTitle: string,
  scope: string
): Promise<ProposalSection[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate an ultra-minimal project proposal for AdvertsGen. Client: ${clientName}, Industry: ${industry}, Project: ${projectTitle}, Scope: ${scope}. Exactly 3 short sections: SUMMARY, TIMELINE, TERMS.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              type: { type: Type.STRING }
            },
            required: ["title", "content", "type"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
};
