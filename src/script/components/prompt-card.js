import LightElement from "./light-element.js"
import {getFreshPrompt} from "../generator.js"

const COPY_LABEL = "Copy"
const COPIED_LABEL = "Copied"

/**
 * <prompt-card> — shows the current prompt and the controls that change it.
 *
 * Emits `prompt:new` (detail: {text}) whenever a prompt is generated.
 */
export default class PromptCard extends LightElement {
  #current = ""
  #previous = new Set()
  #copyTimer = 0

  render() {
    return `
      <article class="card">
        <p class="card__eyebrow">Microfiction prompt</p>
        <p class="card__prompt" id="current-prompt" data-prompt role="status" aria-live="polite"></p>
        <div class="card__actions">
          <button class="button button--primary" type="button" data-action="new"
            aria-controls="current-prompt" aria-keyshortcuts="Space Enter">
            <span aria-hidden="true">&#9733;</span> New prompt
          </button>
          <button class="button" type="button" data-action="copy" aria-controls="current-prompt"
            aria-keyshortcuts="C" aria-live="polite">${COPY_LABEL}</button>
        </div>
      </article>
    `
  }

  mounted() {
    this.$("[data-action='new']").addEventListener("click", () => this.next())
    this.$("[data-action='copy']").addEventListener("click", () => this.copy())

    document.addEventListener("keydown", event => {
      if(event.metaKey || event.ctrlKey || event.altKey)
        return

      const tag = event.target?.tagName

      if(tag === "INPUT" || tag === "TEXTAREA" || event.target?.isContentEditable)
        return

      if(event.key === " " || event.key === "Enter") {
        // Let the keyboard activate a focused button on its own.
        if(event.target?.closest?.("button"))
          return

        event.preventDefault()
        this.next()
      } else if(event.key.toLowerCase() === "c") {
        this.copy()
      }
    })
  }

  get prompt() {
    return this.#current
  }

  /** Generate and display the next prompt. */
  next() {
    let prompt

    try {
      prompt = getFreshPrompt(this.#previous)
    } catch(error) {
      this.#show(error.message, true)

      return
    }

    this.#current = prompt.text
    this.#previous.add(prompt.familyId)
    this.#show(this.prompt, false)
    this.emit("prompt:new", {text: this.prompt})
  }

  /** Show an arbitrary prompt (used when replaying one from history). */
  show(text) {
    this.#current = text
    this.#show(text, false)
  }

  async copy() {
    if(!this.#current)
      return

    const button = this.$("[data-action='copy']")

    try {
      await navigator.clipboard.writeText(this.#current)
    } catch {
      button.textContent = "Copy failed"
      button.setAttribute("aria-label", "Could not copy the current prompt")
      clearTimeout(this.#copyTimer)
      this.#copyTimer = setTimeout(() => {
        button.textContent = COPY_LABEL
        button.removeAttribute("aria-label")
      }, 1600)

      return
    }

    button.textContent = COPIED_LABEL
    button.setAttribute("aria-label", "Current prompt copied")
    button.classList.add("is-done")
    clearTimeout(this.#copyTimer)
    this.#copyTimer = setTimeout(() => {
      button.textContent = COPY_LABEL
      button.removeAttribute("aria-label")
      button.classList.remove("is-done")
    }, 1600)
  }

  #show(text, isError) {
    const target = this.$("[data-prompt]")

    target.textContent = text
    target.classList.toggle("is-error", isError)
    target.setAttribute("role", isError ? "alert" : "status")
    target.setAttribute("aria-live", isError ? "assertive" : "polite")

    // Restart the entrance animation.
    target.classList.remove("is-entering")
    void target.offsetWidth
    target.classList.add("is-entering")
  }
}

customElements.define("prompt-card", PromptCard)
