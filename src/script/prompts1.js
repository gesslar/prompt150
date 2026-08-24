const pronouns = {
  person: {
    base: ["I", "you", "we", "they"],
    thirdSingular: ["he", "she", "it"]
  },
  thing: {
    base: ["they"],
    thirdSingular: ["it"]
  }
}
const personPronouns = [...pronouns.person.base, ...pronouns.person.thirdSingular]
const thingPronouns = [...pronouns.thing.base, ...pronouns.thing.thirdSingular]
const allPronouns = [...personPronouns, ...thingPronouns]
const allBasePronouns = [...new Set([...pronouns.person.base, ...pronouns.thing.base])]
const allThirdSingularPronouns = [...new Set([...pronouns.person.thirdSingular, ...pronouns.thing.thirdSingular])]
const question = ["who", "what", "where", "when", "why"]

export default [
  [
    "I {1}",
    ["love", "hate", "don't mind", "wish", "hope", "wonder", "dream",],
  ],
  [
    "I {1} it when",
    ["love", "hate", "don't mind",]
  ],
  [
    "What {1}",
    ["do", "does", "if",]
  ],
  [
    "What {1} {2}",
    ["do", "if",],
    allPronouns
  ],
  [
    "When {1}",
    ["do", "does", "has", "have", "am", "are",]
  ],
  [
    "{1} {2} {3}",
    question,
    ["could", "would", "should", "can", "do"],
    allPronouns,
  ]
]

/*
[
  "What if",
  "It was a",
  "I don't understand why",
  "How could",
  "Everytime I",
  "The best thing",
  "I'm thankful for",
  "I love",
  "I recommend",
]
*/
