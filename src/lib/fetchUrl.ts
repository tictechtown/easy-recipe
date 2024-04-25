"use server";

export default async function fetchUrl(url: string): Promise<string> {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error("WRONG_URL");
  }

  const htmlString = await res.text();
  return htmlString;
}
