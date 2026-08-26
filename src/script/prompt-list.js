import {escapeHtml} from "./components/light-element.js"

export function promptListItem(text, entering = false) {
  return `
    <li class="prompt-list__item${entering ? " is-entering" : ""}" data-copy="${escapeHtml(text)}">
      <p class="prompt-list__prompt">${escapeHtml(text)}</p>
      <button class="button button--quiet prompt-list__copy" type="button"
        aria-label="Copy prompt: ${escapeHtml(text)}" aria-live="polite">
        Copy
      </button>
    </li>
  `
}

export function paintPromptList(list, prompts) {
  list.innerHTML = prompts.map(text => promptListItem(text)).join("")
}

export function enablePromptCopy(list) {
  list.addEventListener("click", async event => {
    const row = event.target.closest("[data-copy]")

    if(!row)
      return

    const button = row.querySelector(".prompt-list__copy")

    try {
      await navigator.clipboard.writeText(row.dataset.copy)
      button.textContent = "Copied"
      button.setAttribute("aria-label", `Copied prompt: ${row.dataset.copy}`)
      button.classList.add("is-done")
    } catch {
      button.textContent = "Copy failed"
      button.setAttribute("aria-label", `Could not copy prompt: ${row.dataset.copy}`)
    }

    setTimeout(() => {
      button.textContent = "Copy"
      button.setAttribute("aria-label", `Copy prompt: ${row.dataset.copy}`)
      button.classList.remove("is-done")
    }, 1600)
  })
}

document.querySelectorAll(".prompt-list").forEach(enablePromptCopy)
