import LightElement from "./light-element.js"

const STORAGE_KEY = "prompter:theme"

/**
 * <theme-toggle> — switches between the parchment and midnight palettes.
 *
 * Writes `data-theme` on <html>; with no stored choice the system
 * preference wins, which is what the stylesheet assumes.
 */
export default class ThemeToggle extends LightElement {
  render() {
    return `
      <button class="button button--icon" type="button" data-action="toggle" aria-pressed="false">
        <span class="theme-toggle__glyph" aria-hidden="true"></span>
        <span class="visually-hidden">Toggle colour theme</span>
      </button>
    `
  }

  mounted() {
    this.#apply(this.#stored() ?? this.#system())
    this.$("[data-action='toggle']").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark"

      this.#apply(next)

      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Storage unavailable — the choice lasts for this page only.
      }
    })
  }

  #apply(theme) {
    document.documentElement.dataset.theme = theme

    const button = this.$("[data-action='toggle']")

    button.setAttribute("aria-pressed", String(theme === "dark"))
    button.querySelector(".theme-toggle__glyph").textContent = theme === "dark" ? "☾" : "☀"
  }

  #stored() {
    try {
      const value = localStorage.getItem(STORAGE_KEY)

      return value === "dark" || value === "light" ? value : null
    } catch {
      return null
    }
  }

  #system() {
    return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
  }
}

customElements.define("theme-toggle", ThemeToggle)
