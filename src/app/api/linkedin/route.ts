import { TEST } from "@/engine";
import { NextResponse } from "next/server";

// import { Client } from "./api/google";
// import { Engine } from "./engine";

async function generateLinkedInPost(engine: Engine) {
  // Should this use `const`s or `let`s

  let numberOfAutomations = engine.LinkedInPostTypes.count();
  let x = randomChoice(numberOfAutomations);
  let postSpecification = engine.LinkedInPostTypes[x];

  const googleGenAIClient = Client.get();
  const post = googleGenAIClient.generatePost({
    input: postSpecification,
  });

  return post;
}

export async function GET() {
  /*
  // TODO: have this create the engine, randomly choosing 1/10, where in 1/10
  // is with the funnel, 9/10 is without the funnel
  const engine = engine("LinkedIn");
  // TODO: check if day is Sunday
  // check if posts have been made today
  let data: String;
  for (let i = 0; engine.count(); i++) {
    data += generateLinkedInPost(engine);
  }
  */

  /*
  return NextResponse.json(
    post,
    {
      "status": 200
    }
  );
  */

  return NextResponse.json({
    text: globalThis.testText,
    status: 200,
  });

}
