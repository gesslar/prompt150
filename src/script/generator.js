import prompts from "./prompts1.js"

/** Matches the first {n} slot left in a template. Deliberately un-global: a
 *  /g regex carries lastIndex between calls and would skip matches. */
const PLACEHOLDER = /\{(?<number>\d+)\}/

/** A template can only need as many passes as it has distinct slots. Anything
 *  beyond this means an option reintroduced a slot and we are looping. */
const MAX_PASSES = 32

/**
 * Picks a random element from an array.
 */
function elementOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function capitalise(str) {
  return str.length > 0 ? `${str.at(0).toUpperCase()}${str.slice(1)}` : str
}

/**
 * Builds a single prompt by filling the {n} slots of a randomly chosen
 * template with a random option from its nth definition list.
 *
 * Every failure is a malformed prompt table, so each one throws with the
 * offending template named rather than returning a half-substituted string.
 *
 * @returns {string} the finished prompt
 * @throws {Error} when a template and its definitions disagree
 */
export function getPrompt() {
  if(!Array.isArray(prompts) || prompts.length < 1)
    throw new Error(`Empty prompt table. Non-empty array expected, got ${typeof prompts}.`)

  const selected = elementOf(prompts)

  if(!Array.isArray(selected) || selected.length < 1)
    throw new Error(`Invalid prompt format. Array expected, got ${typeof selected}.`)

  const [line, ...def] = selected

  if(typeof line !== "string")
    throw new Error(`Invalid prompt template. String expected, got ${typeof line}.`)

  if(line.trim().length < 1)
    throw new Error(`Empty prompt template in entry ${prompts.indexOf(selected) + 1}.`)

  let prompt = line

  for(let pass = 0; PLACEHOLDER.test(prompt); pass++) {
    if(pass >= MAX_PASSES)
      throw new Error(`Prompt ${line} still has slots after ${MAX_PASSES} passes; an option is probably self-referential.`)

    const {number} = PLACEHOLDER.exec(prompt).groups
    const match = `{${number}}`
    const index = parseInt(number, 10) - 1

    // {0} underflows to -1, which indexes into nothing rather than out of range.
    if(index < 0 || index >= def.length)
      throw new Error(`Insufficient number of options for prompt ${line}, chosen: ${index + 1}`)

    const options = def[index]

    if(!Array.isArray(options) || options.length < 1)
      throw new Error(`Invalid definition ${index + 1} for prompt ${line}. Non-empty array expected.`)

    const option = elementOf(options)

    if(typeof option !== "string")
      throw new Error(`Invalid option in definition ${index + 1} for prompt ${line}. String expected, got ${typeof option}.`)

    prompt = prompt.replaceAll(match, option)
  }

  return `${capitalise(prompt)}...`
}

/**
 * Like getPrompt, but avoids repeating `previous` when it can.
 */
export function getFreshPrompt(previous, attempts = 8) {
  let prompt = getPrompt()

  for(let i = 0; i < attempts && prompt === previous; i++)
    prompt = getPrompt()

  return prompt
}
