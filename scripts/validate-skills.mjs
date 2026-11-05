import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsDirectory = path.join(root, "skills");
const readmePath = path.join(root, "README.md");
const catalogLink = /\[([^\]]+)\]\(skills\/([^/]+)\/SKILL\.md\)/g;
const errors = [];

function parseFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") {
    throw new Error("missing opening YAML frontmatter delimiter");
  }

  const closing = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (closing === -1) {
    throw new Error("missing closing YAML frontmatter delimiter");
  }

  const metadata = new Map();
  for (const line of lines.slice(1, closing)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const separator = line.indexOf(":");
    if (separator === -1) throw new Error(`invalid frontmatter field: ${line}`);

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2");
    if (metadata.has(key)) throw new Error(`duplicate frontmatter field: ${key}`);
    metadata.set(key, value);
  }
  return metadata;
}

let skillDirectories;
try {
  skillDirectories = (await readdir(skillsDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
} catch (error) {
  console.error(`Cannot read skills/: ${error.message}`);
  process.exit(1);
}

if (skillDirectories.length === 0) errors.push("skills/: no skill directories found");

const names = new Set();
for (const directory of skillDirectories) {
  const relativePath = `skills/${directory}/SKILL.md`;
  try {
    const content = await readFile(path.join(skillsDirectory, directory, "SKILL.md"), "utf8");
    const metadata = parseFrontmatter(content);
    const name = metadata.get("name") ?? "";
    const description = metadata.get("description") ?? "";

    if (!name) errors.push(`${relativePath}: missing name`);
    else if (name !== directory) errors.push(`${relativePath}: name ${JSON.stringify(name)} must match folder ${JSON.stringify(directory)}`);
    else if (names.has(name)) errors.push(`${relativePath}: duplicate skill name ${JSON.stringify(name)}`);
    else names.add(name);

    if (!description) errors.push(`${relativePath}: missing description`);
  } catch (error) {
    const message = error.code === "ENOENT" ? "missing SKILL.md" : error.message;
    errors.push(`${relativePath}: ${message}`);
  }
}

let readme;
try {
  readme = await readFile(readmePath, "utf8");
} catch (error) {
  errors.push(`README.md: cannot read file (${error.message})`);
  readme = "";
}

const catalog = new Map();
for (const match of readme.matchAll(catalogLink)) {
  const [, label, skillName] = match;
  if (catalog.has(skillName)) errors.push(`README.md: duplicate catalog link for ${JSON.stringify(skillName)}`);
  catalog.set(skillName, label);
}

for (const directory of skillDirectories) {
  if (!catalog.has(directory)) errors.push(`README.md: missing catalog link for ${JSON.stringify(directory)}`);
  else if (catalog.get(directory) !== directory) errors.push(`README.md: catalog label for ${JSON.stringify(directory)} must match its folder name`);
}
for (const skillName of catalog.keys()) {
  if (!skillDirectories.includes(skillName)) errors.push(`README.md: catalog link points to unknown skill ${JSON.stringify(skillName)}`);
}

if (errors.length > 0) {
  console.error("Skill validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${skillDirectories.length} skill(s) and README catalog.`);
