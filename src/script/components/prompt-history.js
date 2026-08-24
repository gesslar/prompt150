import LightElement, {escapeHtml} from "./light-element.js"

const STORAGE_KEY = "prompter:history"
const LIMIT = 8

/**
 * <prompt-history> — the recently generated prompts.
 *
 * Listens for `prompt:new` on the document and emits `prompt:replay`
 * (detail: {text}) when one of its entries is clicked.
 */
export default class PromptHistory extends LightElement {
  #items = []

  render() {
    return `
      <section class="history" hidden>
        <header class="history__header">
          <h2 class="history__title">Recent</h2>
          <button class="button button--quiet" type="button" data-action="clear">Clear</button>
        </header>
        <ul class="history__list" data-list></ul>
      </section>
    `
  }

  mounted() {
    this.#items = this.#load()

    this.$("[data-action='clear']").addEventListener("click", () => {
      this.#items = []
      this.#save()
      this.#paint()
    })

    this.$("[data-list]").addEventListener("click", event => {
      const button = event.target.closest("[data-text]")

      if(button)
        this.emit("prompt:replay", {text: button.dataset.text})
    })

    document.addEventListener("prompt:new", event => this.add(event.detail.text))

    this.#paint()
  }

  add(text) {
    this.#items = [text, ...this.#items.filter(item => item !== text)].slice(0, LIMIT)
    this.#save()
    this.#paint()
  }

  #paint() {
    const list = this.$("[data-list]")

    list.innerHTML = this.#items
      .map(text => `
        <li class="history__item">
          <button class="history__entry" type="button" data-text="${escapeHtml(text)}">
            ${escapeHtml(text)}
          </button>
        </li>
      `)
      .join("")

    this.$(".history").hidden = this.#items.length === 0
  }

  #load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")

      return Array.isArray(raw) ? raw.filter(item => typeof item === "string").slice(0, LIMIT) : []
    } catch {
      return []
    }
  }

  #save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.#items))
    } catch {
      // Storage unavailable (private mode, quota) — history stays in memory.
    }
  }
}

customElements.define("prompt-history", PromptHistory)
