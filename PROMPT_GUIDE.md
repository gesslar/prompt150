# Prompt 150 authoring guide

This document is guidance for humans and coding agents adding prompt families
to `src/script/prompts1.js`.

## Purpose

Prompt 150 is for writing complete stories in exactly 150 words. The generated
prompt is the beginning of the story, and its words count toward that total.

The generator should produce **sentence ignition**, not a story idea. Its ideal
effect is:

> Oh, I know how this sentence continues.

It should not ask the writer to accept, explain, or escape a premise supplied
by the generator.

The governing principle is:

> Begin the sentence. Never begin the story.

## Editorial standard

A good prompt:

- creates immediate grammatical momentum;
- can continue naturally in several unrelated directions;
- is short enough to earn every word it takes from the 150-word limit;
- leaves setting, genre, conflict, imagery, character, and meaning to the
  writer;
- can become sincere, ironic, comic, tender, mundane, horrific, or strange;
- stops immediately before the writer's own idea begins.

The prompt does not need to be evocative in isolation. It needs to be
**grammatically fertile**.

Short speech acts and sentence frames are often productive because they
establish voice without establishing narrative. An opening can express
gratitude, doubt, recommendation, regret, or a question while leaving the
object and circumstances entirely open.

### Leave semantic completion to the author

A prompt may supply a verb when it creates a grammatical ledge. Openings such
as `I love...`, `I recommend...`, and `I don't understand why...` establish a
speech act or stance, but the author still supplies the object, event, and
meaning that complete the thought.

The important boundary is not the presence of a verb. It is whether the prompt
has completed its first meaningful claim. `This time, she...`, `If only we...`,
and `At first, it...` ask the author simply to finish the sentence in their own
way. By contrast, `This time, she stayed...`, `If only we had known...`, and
`At first, nothing seemed wrong...` assert an event, realization, or condition
that the author must inherit.

The generator may provide grammatical direction. The author should provide
the semantic completion: what happened, what was perceived, what was judged,
or what proved important.

## What to avoid

### Do not supply a miniature premise

Avoid prompts that already contain a situation, reveal, conflict, or implied
plot. If the writer must spend words justifying what the prompt introduced, the
prompt has created **explanation debt**.

Too leading:

> We found a key beneath the floorboards...

More open:

> We found out...

The first supplies a prop and location. The second supplies only grammatical
direction.

### Be cautious with concrete nouns

Objects, named places, occupations, weather, physical settings, and decorative
images often decide too much. A concrete word is not automatically wrong, but
it must do more good than the narrative obligation it creates.

Abstract language is not automatically safe either. A phrase such as
"Somewhere, someone was waiting" is not object-heavy, but it still commits the
writer to a spatial frame and an awaiting person. It consumes semantic and word
count real estate that the writer must then address.

### Do not confuse vagueness with openness

"Something else" withholds information but provides little momentum. Useful
openness creates a grammatical ledge from which many ideas are possible.

### Do not over-author for eloquence

The generator is not responsible for writing the striking part of the sentence.
Long, atmospheric, or polished fragments tend to impose tone and genre. Let the
writer provide the memorable language.

### Do not require enormous option lists

If a template only becomes meaningful after enumerating many scenarios, it is
probably carrying too much semantic weight. Prefer a compact option set with a
large interpretive range.

## Generative structure

Each prompt family is an array:

```js
[
  "Template with {1} and {2}",
  ["options for {1}"],
  ["options for {2}"]
]
```

Slots are one-based. `{1}` uses the first definition array, `{2}` the second,
and so on. Every definition must be a non-empty array of strings.

The generator capitalizes the completed prompt and appends `...`. Punctuation
in the template belongs to the supplied opening and is preserved. For example:

```js
[
  "For the {1} time,",
  ["first", "last"]
]
```

produces `For the first time,...`. The comma is story grammar; `...` is the
interface's handoff meaning "now your turn."

## Use nesting for real branches

An option may introduce a later slot. This is useful when one choice changes
which continuations are grammatical or meaningful:

```js
[
  "I should have {1}",
  ["listened", "asked why", "said {2}", "waited"],
  ["yes", "no"]
]
```

Only the `said {2}` branch consumes the second definition. This creates two
coherent variants without forcing unrelated first-level choices to use `{2}`.

Another useful shape is:

```js
[
  "We found {1}",
  ["a way", "each other", "nothing", "out", "something {2}"],
  ["buried", "hidden", "behind", "beneath"]
]
```

Nesting is powerful when it models dependency. Do not add nesting merely to
increase the mathematical combination count.

Avoid self-reference: an option selected for `{1}` must not reintroduce `{1}`.
The generator detects unresolved loops after 32 passes and throws an error.

## Grammar and agreement

Every possible generated result must be grammatically viable. Do not combine
subjects and verbs independently when agreement can break. Reuse the pronoun
and conjugation helpers already in `prompts1.js`, or pre-compose dependent
phrases into a single option list.

For example, pairing `does` with `she` before random selection is safer than
selecting an auxiliary and pronoun from unrelated arrays.

Capitalization should normally be left to the generator. Options may retain
intentional capitalization where the word can appear after punctuation or where
the slot itself begins the prompt.

## Evaluating a proposed family

Before adding it, ask:

1. What has this prompt already decided for the writer?
2. Does it introduce a prop, place, genre, conflict, relationship, or event?
3. Does the writer now owe the prompt an explanation?
4. Could the same output begin romance, comedy, memoir, horror, and speculative
   fiction without fighting the wording?
5. Can at least four genuinely different continuations come to mind quickly?
6. Does each option create momentum, or is it merely vague?
7. Could any words be removed while preserving the handoff?
8. Are all Cartesian combinations grammatical and semantically useful?
9. Would nesting represent the branches more honestly?
10. Is every supplied word worth counting against 150?
11. Does the author complete the prompt's first meaningful thought, or has the
    prompt completed it for them?

Reject or revise the family if the answers reveal explanation debt or a narrow
narrative channel.

## Reference work

The author's [`150brief` archive](https://inscrive.blogspot.com/search/label/150brief)
shows the intended relationship between prompt and story. The pieces frequently
take extremely plain openings in dark, comic, intimate, speculative, or
otherwise unexpected directions. Seasonal context does not require seasonal
content, and an innocent speech act may become sincere, coercive, ironic, or
horrifying.

Use the archive to understand how little the prompt needs to decide. Do not
copy its subject matter, imagery, darkness, or twists into new prompt options.
Those belong to the writer.

## Workflow for future agents

1. Read this guide, `src/script/prompts1.js`, and `src/script/generator.js`.
2. Preserve the author's current prompt edits and vocabulary choices.
3. Draft a small number of families at a time.
4. Explain what grammatical momentum each family supplies and what it
   deliberately leaves undecided.
5. Treat subjective feedback as editorial direction, not an edge case.
6. Test every branch, including options that introduce nested slots.
7. Generate a large sample and reject unresolved placeholders, runtime errors,
   accidental punctuation, and awkward combinations.
8. Show representative outputs so the author can judge their semantic weight.

Do not optimize for the number of combinations. Optimize for the number of
different stories a writer remains free to tell.
