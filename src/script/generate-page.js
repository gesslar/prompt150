import "./components/theme-toggle.js"
import {getFreshPrompt} from "./generator.js"
import {promptListItem} from "./prompt-list.js"

const INITIAL_COUNT = 5
const list = document.querySelector("[data-generated-prompts]")
const addButton = document.querySelector("[data-action='add']")
const regenerateButton = document.querySelector("[data-action='regenerate']")
let previous = ""
const generated = new Set()

function appendPrompt(entering = true) {
  let text = getFreshPrompt(previous)

  for(let attempts = 0; attempts < 16 && generated.has(text); attempts++)
    text = getFreshPrompt(previous)

  previous = text
  generated.add(text)
  list.insertAdjacentHTML("beforeend", promptListItem(text, entering))

  if(entering)
    list.lastElementChild.scrollIntoView({behavior: "smooth", block: "nearest"})
}

function regeneratePrompts() {
  list.innerHTML = ""
  previous = ""
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
