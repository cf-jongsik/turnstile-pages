export const runtime = "edge";

import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export async function POST(request: Request) {
  const data = await request.formData();
  console.log(data);

  const username = data.get("username");
  const password = data.get("password");
  const token = data.get("cf-turnstile-response");
  const ip = request.headers.get("cf-connecting-ip");
  console.log(ip);

  if (!username || !password || !token || !ip) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const SECRET_KEY = getRequestContext().env.TURNSTILE_SECRET_KEY;

  let formData = new FormData();
  formData.append("secret", SECRET_KEY);
  formData.append("response", token);
  formData.append("remoteip", ip);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  const result = await fetch(url, {
    body: formData,
    method: "POST",
  });

  let validation: boolean;
  let error: string;

  const outcome = await result.json<VALIDATION>();
  console.log(outcome);
  if (outcome.success) {
    validation = true;
    error = "none";
  } else {
    validation = false;
    error = outcome["error-codes"].toString();
    console.log(outcome["error-codes"].toString());
  }

  return NextResponse.json(
    {
      username: username,
      password: password,
      token: token,
      validation: validation,
      errors: error,
    },
    { status: 200 }
  );
}
