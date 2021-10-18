import marked, { MarkedExtension } from "marked";
import { readFile } from "fs/promises";

const customLanguageMap: { [key: string]: string } = {
  typescript: "javascript",
  yml: "yaml",
};

const renderer = {
  code(code: string, language: string | undefined, isEscaped: boolean) {
    const trimmedLanguage = language?.split(" ")[0] || "";

    return `
    <li-code lang="${customLanguageMap[trimmedLanguage] || trimmedLanguage}">
${code.replace("<", "&lt;").replace(">", "&gt;")}
    </li-code>
    `;
  },
};

async function run(path: string) {
  const md = await readFile(path, "utf8");
  marked.use({ renderer });
  const html = marked.parse(md);
  console.log(html);
}

run(process.argv[2]);
