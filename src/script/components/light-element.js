/**
 * Minimal base class for light DOM custom elements.
 *
 * No shadow root: everything a component renders lives in the document's
 * light DOM, so the app stylesheet styles it like any other markup and
 * events bubble normally.
 */
export default class LightElement extends HTMLElement {
  #rendered = false

  connectedCallback() {
    if(this.#rendered)
      return

    this.#rendered = true
    this.innerHTML = this.render()
    this.mounted?.()
  }

  /**
   * @returns {string} markup placed inside this element
   */
  render() {
    return ""
  }

  /** Convenience: first descendant matching `selector`. */
  $(selector) {
    return this.querySelector(selector)
  }

  /** Convenience: all descendants matching `selector`. */
  $$(selector) {
    return [...this.querySelectorAll(selector)]
  }

  /** Fire a bubbling, composed CustomEvent from this element. */
  emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, {detail, bubbles: true}))
  }
}

/** Escape text destined for an innerHTML template. */
export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[ch])
}
