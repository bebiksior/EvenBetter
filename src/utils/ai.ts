import { getSetting } from "../settings";
import log from "./Logger";
import { getCaidoAPI } from "./caidoapi";

export const askAI = async (systemPrompt: string, prompt: string) => {
  const openaiApiKey = getSetting("openaiApiKey");
  if (!openaiApiKey) {
    log.info("Asking AI without OpenAI API key with prompt: " + prompt);
    const sessionID = await createAssistantSession(systemPrompt);
    if (!sessionID) {
      throw new Error("Failed to create assistant session");
    }

    await sendAssistantMessage(sessionID, prompt);

    const response = await waitForResponse(sessionID);
    return response;
  } else {
    log.info("Asking AI with OpenAI API key with prompt: " + prompt);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }
};

const createAssistantSession = async (systemPrompt: string) => {
  const data = await getCaidoAPI().graphql.createAssistantSession({
    input: {
      modelId: "gpt-3.5-turbo",
      systemMessage: systemPrompt,
    },
  });
  return data?.createAssistantSession?.session?.id;
};

const sendAssistantMessage = async (sessionID: string, message: string) => {
  await getCaidoAPI().graphql.sendAssistantMessage({
    sessionId: sessionID,
    message: message,
  });
};

const waitForResponse = async (sessionID: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const data = await getCaidoAPI().graphql.assistantSession({ id: sessionID });

        const assistantSession = data.assistantSession;
        if (!assistantSession) {
          return;
        }

        if (assistantSession.messages.length >= 3) {
          const response = assistantSession.messages[2]?.content;
          if (response) {
            clearInterval(interval);
            await getCaidoAPI().graphql.deleteAssistantSession({ id: sessionID });
  
            resolve(response);
          } else {
            reject("Failed to get response from AI");
          }
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, 1000);
  });
};
