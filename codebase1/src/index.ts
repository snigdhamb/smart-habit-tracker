/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import fetch from "node-fetch";
import * as functions from "firebase-functions";

setGlobalOptions({ maxInstances: 10 });

export const generateHabits = onRequest(async (req, res) => {
  logger.info("Generating habits...", { structuredData: true });

  const goal = req.body.goal;
  if (!goal) {
    res.status(400).json({ error: "Missing goal" });
    return;
  }

  const prompt = `Take this vague goal and suggest 10 clear, actionable daily habits that align with it:\n\nGoal: "${goal}"\n\nHabits:`;

  try {
    const chatResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${functions.config().openai.key}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant that generates useful daily habits based on vague goals." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });
    const data = (await chatResponse.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const habitsText = data.choices?.[0]?.message?.content || "";
    const habits = habitsText
      .split("\n")
      .map((line: string) => line.replace(/^\d+[\).\s]*/, "").trim())
      .filter(Boolean);

    res.json({ habits });
  } catch (error) {
    logger.error("Error generating habits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
