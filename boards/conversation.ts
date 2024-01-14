/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { recipe } from "@google-labs/breadboard";
import { core } from "@google-labs/core-kit";
import { starter } from "@google-labs/llm-starter";

const agent =
  "https://raw.githubusercontent.com/breadboard-ai/breadboard/2ab8da8cce71612b9b6c7e12c25b83129be54cb6/packages/breadboard-web/public/graphs/agent.json";

const gemini =
  "https://raw.githubusercontent.com/breadboard-ai/breadboard/2ab8da8cce71612b9b6c7e12c25b83129be54cb6/packages/breadboard-web/public/graphs/gemini-generator.json";

export default await recipe(({ topic, generator }) => {
  topic.title("Topic").examples("the universe within us");
  generator.title("Generator").examples(gemini);

  const poetTemplate = starter.promptTemplate({
    $id: "poetTemplate",
    template: `You are a brilliant poet who specializes in two-line rhyming poems. Given any topic, you can quickly whip up a two-line rhyming poem about it.
    
    Ready? 
    
    The topic is {{topic}}`,
    topic,
  });

  const poet = core.invoke({
    $id: "poet",
    text: poetTemplate.prompt,
    context: [],
    path: agent,
    generator,
  });

  const critic = core.invoke({
    $id: "critic",
    text: `Look at the poem you just produced and critique it as if you you are an experienced jingle writer and critic who can rapidly evaluate a poem.

    Provide a comprehensive bulleted-list critique of it, including a rating from 1 to 10, and recommendations for improvement.`,
    context: poet.context,
    path: agent,
    generator,
  });

  const improver = core.invoke({
    $id: "improver",
    text: `You are now the two-line rhyming poet again. You look at the provided critique and eagerly incorporate the recommendations for improvement, producing a new poem.`,
    context: critic.context,
    path: agent,
    generator,
  });

  return { context: improver.context };
}).serialize({
  title: "Conversation",
  description: "A prototype of a conversation between two agents",
  version: "0.0.1",
});
