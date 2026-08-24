import prompts from "./prompts1.js"

function getPrompt() {
  const selected = elementOf(prompts)

  if(!Array.isArray(selected) || selected.length < 1)
    return `Error: Invalid prompt format. Array expected, got ${typeof selected}.`

  const [line, ...def] = selected

  let prompt = line

  while(prompt.match(/\{\d+\}/)) {
    const {number} = /\{(?<number>\d+)\}/.exec(prompt)?.groups ?? {}
    const match = `{${number}}`
    const arrNumber = parseInt(number, 10) - 1

    if(!Array.isArray(def))
      return `Error: Invalid definition for prompt ${line}`

    if(!def || def.length < arrNumber + 1)
      return `Error: Insufficient number of options for prompt ${line}, chosen: ${arrNumber + 1}`

    const options = def[arrNumber]
    const option = elementOf(options)

    prompt = prompt.replaceAll(match, option)
  }

  return `${capitalise(prompt)}...`
}

function generatePrompt() {
  const div = document.getElementById("prompt")
  div.innerText = getPrompt()
}

function elementOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function capitalise(str) {
  return `${str.at(0).toUpperCase()}${str.slice(1)}`
}

document.addEventListener("DOMContentLoaded", generatePrompt)
