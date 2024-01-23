import marked from "marked";
import { readFile } from "fs/promises";
import { fetch } from "undici";

const customLanguageMap: { [key: string]: string } = {
  typescript: "javascript",
  yml: "yaml",
  ts: "javascript",
  tsx: "javascript",
};

const renderer = {
  code(code: string, language: string | undefined, isEscaped: boolean) {
    const trimmedLanguage = language?.split(" ")[0] || "";

    return `
    <li-code lang="${customLanguageMap[trimmedLanguage] || trimmedLanguage}">${code.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</li-code>
    `;
  },
};

async function run(path: string) {
  let md: string;
  if (path.startsWith("https")) {
    const response = await fetch(path);
    md = await response.text();
  } else {
    md = await readFile(path, "utf8");
  }
  marked.use({ renderer });
  const html = marked.parse(md);
  console.log(html);
}

run(process.argv[2]);
