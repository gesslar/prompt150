import "./components/theme-toggle.js"
import {getFreshPrompt} from "./generator.js"
import {promptListItem} from "./prompt-list.js"

const INITIAL_COUNT = 5
const MAX_UNIQUE_ATTEMPTS = 16
const list = document.querySelector("[data-generated-prompts]")
const addButton = document.querySelector("[data-action='add']")
const regenerateButton = document.querySelector("[data-action='regenerate']")
const previous = new Set()
const generated = new Set()

function appendPrompt(entering = true) {
  let prompt = getFreshPrompt(previous)

  for(let attempts = 0; attempts < MAX_UNIQUE_ATTEMPTS && generated.has(prompt.text); attempts++)
    prompt = getFreshPrompt(previous)

  generated.add(prompt.text)
  previous.add(prompt.familyId)

  list.insertAdjacentHTML("beforeend", promptListItem(prompt.text, entering))

  if(entering)
    list.lastElementChild.scrollIntoView({behavior: "smooth", block: "nearest"})
}

function regeneratePrompts() {
  list.innerHTML = ""
  previous.clear()
  generated.clear()

  for(let index = 0; index < INITIAL_COUNT; index++)
    appendPrompt(false)
}

function addFromKeyboard(event) {
  if(event.metaKey || event.ctrlKey || event.altKey || event.key !== " ")
    return

  if(event.target?.closest?.("button, a, input, textarea") || event.target?.isContentEditable)
    return

  event.preventDefault()
  appendPrompt()
}

regeneratePrompts()
addButton.addEventListener("click", () => appendPrompt())
regenerateButton.addEventListener("click", regeneratePrompts)
document.addEventListener("keydown", addFromKeyboard)
