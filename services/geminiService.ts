
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
  
  const systemPrompt = `
    You are a Financial Intelligence Assistant for AdvertsGen Agency OS. 
    Your role is to explain numbers, trends, and summaries in clear, human-friendly sentence-case language.
    
    Current Data Provided:
    Transactions: ${JSON.stringify(transactions)}
    Invoices: ${JSON.stringify(invoices)}

    Rules:
    - Calm, analytical, and professional tone.
    - Approachable and empathetic.
    - Clear but not robotic.
    - Always sentence-case for explanations. Uppercase ONLY for small headers or emphasis.
    - Calculate only from provided data. Never assume numbers.
    - Highlight negative trends politely.
    - Always include this subtle disclaimer at the end of every response: "Insights are based on your provided data. Please verify before making financial decisions."
    - Be concise.
    - Respond to "clear history" by stating: "To maintain your records, I cannot clear previous financial data automatically. You can start a new session manually if you wish."
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: systemPrompt
      }
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
