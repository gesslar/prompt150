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
const allPronouns = [...new Set([...personPronouns, ...thingPronouns])]
const allBasePronouns = [...new Set([...pronouns.person.base, ...pronouns.thing.base])]
const allThirdSingularPronouns = [...new Set([...pronouns.person.thirdSingular, ...pronouns.thing.thirdSingular])]
const question = ["who", "what", "where", "when", "why"]

/**
 * Which conjugated form a pronoun takes as a subject: "I" is its own case,
 * he/she/it take the third singular, everything else takes the plain form.
 */
function formOf(pronoun) {
  if(pronoun === "I")
    return "first"

  return allThirdSingularPronouns.includes(pronoun) ? "third" : "plain"
}

/**
 * Builds "<auxiliary> <pronoun>" phrases with the auxiliary already agreeing
 * with the pronoun it introduces, so a template can fill both from one slot
 * instead of picking them independently and landing on "what do it".
 *
 * @param {{first: string, plain: string, third: string}} forms
 * @param {string[]} [subjects] the pronouns to conjugate against
 * @returns {string[]}
 */
function conjugate(forms, subjects = allPronouns) {
  return subjects.map(pronoun => `${forms[formOf(pronoun)]} ${pronoun}`)
}

/** do I, do you, do we, do they, does he, does she, does it */
const doSubject = conjugate({first: "do", plain: "do", third: "does"})
/** have I, have you, ..., has he, has she, has it */
const haveSubject = conjugate({first: "have", plain: "have", third: "has"})
/** am I, are you, are we, are they, is he, is she, is it */
const beSubject = conjugate({first: "am", plain: "are", third: "is"})
/** modals never inflect, so any modal pairs with any pronoun */
const modalSubject = ["could", "would", "should", "can", "might", "will"]
  .flatMap(modal => allPronouns.map(pronoun => `${modal} ${pronoun}`))

const prompts = [
  [
    "I {1}",
    ["love", "hate", "don't mind", "wish", "hope", "wonder", "dream of",],
  ],
  [
    "I {1} it when",
    ["love", "hate", "don't mind",]
  ],
  [
    "What if {1}",
    allPronouns
  ],
  [
    "{1} {2}",
    question,
    [...doSubject, ...haveSubject, ...beSubject]
  ],
  [
    "{1} {2}",
    question,
    modalSubject
  ],
  [
    "Before {1} noticed",
    ["anyone", "I", "we", "they",]
  ],
  [
    "The trouble with {1}",
    ["memory", "promises", "mirrors", "coming home", "second chances", "the truth"]
  ],
  [
    "No one {1} the {2}",
    ["remembered", "noticed", "questioned", "expected"],
    ["answer", "silence", "difference", "change"]
  ],
  [
    "After {1} left",
    ["everyone", "someone", "you", "we", "they"]
  ],
  [
    "{1} was missing",
    ["Something", "Nothing", "Someone", "One thing", "The rest"]
  ],
  [
    "For the {1} time,",
    ["first", "last"],
  ],
  [
    "This time, {1}",
    allPronouns
  ],
  [
    "If only {1}",
    allPronouns
  ],
  [
    "At first, {1}",
    allPronouns
  ],
  [
    "The {1} {2}",
    ["first", "last"],
    ["time", "chance", "one", "word", "goodbye", "promise"]
  ],
  [
    "{1} never came back",
    allPronouns
  ],
  [
    "We found {1}",
    ["a way", "each other", "nothing", "what remained", "out", "something {2}"],
    ["buried", "hidden", "behind", "beneath", "atop"]
  ],
  [
    "I should have {1}",
    ["listened", "left sooner", "asked why", "said {2}", "known better", "waited"],
    ["yes", "no"]
  ],
  [
    "It took {1}",
    ["me", "us", "them"]
  ],
  [
    "Suppose {1}",
    allPronouns
  ],
  [
    "Although {1}",
    allPronouns
  ],
  [
    "I was told {1}",
    ["that", "to", "not to"]
  ],
  [
    "What {1} meant was",
    allPronouns
  ],
  [
    "I {1} know {2}",
    ["don't", "didn't", "want to"],
    question
  ],
  [
    "{1} {2} have known",
    personPronouns,
    ["should", "couldn't", "might"]
  ],
  [
    "By the time {1}",
    allPronouns
  ],
  [
    "Even if {1}",
    allPronouns
  ],
  [
    "Even ${1}",
    ["before {2}", "after {2}", "while {2}", "during the"],
    [...allPronouns, "the"],
  ],
  [
    "Let {1}",
    ["me", "us", "them", "it"]
  ],
  [
    "I keep {1}",
    ["thinking", "forgetting", "wondering", "trying"]
  ],
  [
    "{1} may have",
    allPronouns
  ]
]

export default prompts.map((family, index) => {
  family.id = index

  return family
})

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
