import "./components/theme-toggle.js"
import {paintPromptList} from "./prompt-list.js"

async function boot() {
  const list = document.querySelector("[data-weekly-prompts]")
  const date = document.querySelector("[data-generated-date]")

  if(!list)
    return

  try {
    const response = await fetch("data/weekly-prompts.json", {cache: "no-cache"})

    if(!response.ok)
      throw new Error(`Weekly prompts could not be loaded (${response.status}).`)

    const weekly = await response.json()

    if(!Array.isArray(weekly.prompts) || weekly.prompts.length < 1)
      throw new Error("The weekly prompt file does not contain any prompts.")

    paintPromptList(list, weekly.prompts)

    const generated = new Date(weekly.generatedAt)

    if(date && !Number.isNaN(generated.getTime()))
      date.textContent = `Selected ${generated.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      })}`
  } catch(error) {
    list.innerHTML = `<li class="prompt-list__message prompt-list__message--error"></li>`
    list.firstElementChild.textContent = error.message
  }
}

boot()
