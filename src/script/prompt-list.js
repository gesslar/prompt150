import {escapeHtml} from "./components/light-element.js"

const withoutEllipsis = text => text.replace(/\.\.\.$/, "")

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
    const copyText = withoutEllipsis(row.dataset.copy)

    try {
      await navigator.clipboard.writeText(copyText)
      button.textContent = "Copied"
      button.setAttribute("aria-label", `Copied prompt: ${copyText}`)
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

export function enablePromptCopyAll(button) {
  const list = document.getElementById(button.getAttribute("aria-controls"))
  let resetTimer = 0

  if(!list)
    return

  button.addEventListener("click", async () => {
    const prompts = [...list.querySelectorAll("[data-copy]")]
      .map(row => withoutEllipsis(row.dataset.copy))

    if(prompts.length === 0)
      return

    try {
      await navigator.clipboard.writeText(prompts.join("\r\n"))
      button.textContent = "Copied all"
      button.setAttribute("aria-label", `Copied all ${prompts.length} prompts`)
      button.classList.add("is-done")
    } catch {
      button.textContent = "Copy failed"
      button.setAttribute("aria-label", "Could not copy all prompts")
    }

    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      button.textContent = "Copy all"
      button.removeAttribute("aria-label")
      button.classList.remove("is-done")
    }, 1600)
  })
}

document.querySelectorAll(".prompt-list").forEach(enablePromptCopy)
document.querySelectorAll("[data-action='copy-all']").forEach(enablePromptCopyAll)
