import {access, mkdir, writeFile} from "node:fs/promises"
import {fileURLToPath, pathToFileURL} from "node:url"
import {dirname, resolve} from "node:path"

const PROMPT_COUNT = 5
const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryGenerator = resolve(scriptDirectory, "../src/script/generator.js")
const deployedGenerator = resolve(scriptDirectory, "../script/generator.js")

async function exists(path) {
  try {
    await access(path)

    return true
  } catch {
    return false
  }
}

const runsFromRepository = await exists(repositoryGenerator)
const generatorFile = runsFromRepository ? repositoryGenerator : deployedGenerator
const outputDirectory = runsFromRepository
  ? resolve(scriptDirectory, "../src/data")
  : resolve(scriptDirectory, "../data")
const outputFile = resolve(outputDirectory, "weekly-prompts.json")
const {getFreshPrompt} = await import(pathToFileURL(generatorFile))
const prompts = []

while(prompts.length < PROMPT_COUNT) {
  const prompt = getFreshPrompt(prompts.at(-1))

  if(!prompts.includes(prompt))
    prompts.push(prompt)
}

const weekly = {
  generatedAt: new Date().toISOString(),
  prompts
}

await mkdir(outputDirectory, {recursive: true})
await writeFile(outputFile, `${JSON.stringify(weekly, null, 2)}\n`, "utf8")

console.log(`Wrote ${PROMPT_COUNT} prompts to ${outputFile}`)
