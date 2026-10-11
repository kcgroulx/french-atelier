# Research and design evidence

Sources checked 11 October 2026. The app is evidence-informed, not experimentally validated.

## Build priorities

1. **Recall before reveal.** Make typed French, contextual gap fills, and short constructed replies central. Multiple choice and word tiles are useful scaffolds, but success there must not automatically mark productive ability as mastered. Revisit even previously correct items. Evidence: [retrieval experiment](https://doi.org/10.1126/science.1152408), [learning-direction experiment](https://journals.sagepub.com/doi/10.1177/0033688209343854).
2. **Space practice across days.** Persist due dates and prioritize due review. A correct answer today is practice success; later unhinted success is better evidence of retention. There is strong L2 evidence for spacing, but no universal optimal interval or clear overall superiority of expanding over equal spacing. Evidence: [L2 spacing meta-analysis](https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12479).
3. **Train understanding and expression.** Pair interpretation of a sentence with production in a changed context. A grammar item should change meaning, such as who has something, how much is wanted, or whether a request is negative. Both comprehension- and production-based instruction help; productive practice deserves a substantial role. Evidence: [comparative grammar meta-analysis](https://onlinelibrary.wiley.com/doi/10.1111/lang.12001).
4. **Make listening a meaning task.** First ask for the situation or a concrete detail from a short recording; then replay, compare with the transcript, and optionally dictate a short segment. Guided prediction, monitoring, and checking have direct French-learning evidence. Dictation is a useful product choice for sound-to-word attention, not a demonstrated substitute for comprehension or conversation. Evidence: [French listening experiment](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9922.2009.00559.x).
5. **Explain, repair, retrieve again.** Give one precise explanation of the target error, allow a repair, then revisit a changed example later. Do not just flash a red X and display an answer. Corrective-feedback evidence is strong, but classroom oral-feedback findings do not directly validate a particular app feedback algorithm. Evidence: [classroom feedback meta-analysis](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/abs/oral-feedback-in-classroom-sla/4999EE1C8379B2BF026B148EAF373CA1).
6. **Introduce briefly, then mix.** Explain one grammar point with a small number of examples, then mix previously introduced targets so the learner must select the right form. Interleaving evidence is promising and target-dependent, not a reason to shuffle every exercise indiscriminately. Evidence: [explicit-instruction synthesis](https://benjamins.com/catalog/sibil.48.18goo), [grammar-interleaving experiment](https://yuichisuzuki.net/wp-content/uploads/2023/04/Nakata-Suzuki-2019-MLJ.pdf).
7. **Teach pronunciation without fake precision.** Offer listen/repeat, optional record-and-compare, and one focused sound or rhythm cue. Prioritize intelligibility. Never manufacture a pronunciation percentage from a button click or equate speech-to-text matching with validated pronunciation assessment. Evidence: [pronunciation measurement meta-analysis](https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12345), [official CEFR](https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4).

## Concrete MVP mechanics (design choices, not validated prescriptions)

### Session

- Offer a 12-prompt session: four due retrieval prompts, three audio/meaning prompts, three contextual grammar-production prompts, and two transfer prompts using changed situations. This allocation is a starting heuristic, not a scientifically optimal ratio.
- Keep at least one short spoken exchange or mini-text per session so the app is more than isolated translation cards.
- Optional challenge mode removes word banks and starts with the transcript hidden. Hints remain available. Record hint usage rather than making a hint look like independent recall.
- Prefer short, carefully authored French with reusable vocabulary and one clear target. Early topics can include introductions, ordering, directions, time, everyday preferences, and asking someone to repeat.
- Write all lesson content originally. Do not reproduce Duolingo exercises, characters, branding, proprietary sequencing, or audio.

### Scheduling and progress

- Track performance per concept AND mode: recognition, typed production, listening meaning, and dictation. A learner can know the written word without reliably recognizing it in speech.
- Suggested initial schedule: unhinted success returns after 1, 3, 7, 14, then 30 days; an error adds a repair later in the same session and a next-day review. This is an explicit heuristic, not a fitted memory model or claim of optimality.
- Do not award multiple day-level retention advances for repeating the same item in one sitting. Log the first response separately from repaired answers.
- Suggested records: item/concept ID, exercise mode, timestamp, first response correctness, hint/reveal usage, replay count, error tag, due date, current interval, and successful review dates.
- Progress language: “practiced,” “ready to review,” “recalled after 7 days,” and “needs another try.” Avoid “fluent,” a precise vocabulary-size estimate, or a CEFR certification based on this small bank.
- For adaptation, choose more practice in weak modes and fewer new items when overdue review accumulates. Any numeric thresholds are tuning decisions. Monitor learning over days, not just same-session accuracy or time spent.

### Feedback and acceptance

- Normalize case, ordinary spacing, apostrophe style, and terminal punctuation. Maintain authored acceptable variants for short answers. Do not accept every near string match as correct French.
- Distinguish a target grammar error from a typo. Accent feedback can be a separate message, but preserve meaningful distinctions such as a/à and ou/où. If the answer means something different, do not silently award full credit.
- For open responses without a reliable semantic evaluator, provide the model answer plus a clearly labeled self-check. Do not represent exact-string matching as an intelligent conversation tutor.
- Feedback example: “Use de after a negated quantity: Je n’ai pas de café. Try the same pattern with pain.” Then use a different prompt later.
- For dictation, show a readable word-level comparison and explanation. Do not collapse orthography, grammar, and comprehension into one unexplained score.
- Audio should expose replay and slower playback controls, with text available after the attempt. If French audio is unavailable, show a clear fallback and exclude the item from listening metrics. Synthetic audio should be labeled appropriately and pronunciation-sensitive examples should be checked.
- Optional speaking is practice unless genuine recording and evaluation are implemented. No microphone indicator or “heard you” state without actual functionality.

### Honest evaluation

- Label any initial check “practice calibration” rather than a placement test. Let learners bypass familiar basics without inferring their overall CEFR level from existing flashcard-deck size.
- Use new examples of known patterns in later checks. This helps distinguish recall of one screen from flexible use; it does not establish transfer to real conversation by itself.
- An A1-oriented syllabus can target familiar everyday language and identifying concrete information in slow, clear recordings. CEFR descriptors guide goals across several abilities; completing app units does not validate a CEFR attainment claim.

## Ten verified sources and strength of evidence

1. **Kim & Webb (2022), The Effects of Spaced Practice on Second Language Learning.** Meta-analysis: 48 experiments, 3,411 participants. Spacing benefited L2 learning; longer gaps helped delayed outcomes relative to shorter ones; equal and expanding schedules were statistically equivalent overall. Strong support for spacing, not for the exact app schedule. [Publisher](https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12479)
2. **Karpicke & Roediger (2008), The Critical Importance of Retrieval for Learning.** Foreign-vocabulary experiment: repeated retrieval after initial success improved delayed recall relative to continued study without retrieval. Narrow task evidence; does not establish complete language competence. [Science](https://doi.org/10.1126/science.1152408)
3. **Webb (2009), The Effects of Receptive and Productive Learning of Word Pairs on Vocabulary Knowledge.** Primary study: learning direction affected which kinds of word knowledge improved; productive learning favored several productive outcomes while receptive learning better supported receptive meaning. Supports assessing modes separately. [Publisher](https://journals.sagepub.com/doi/10.1177/0033688209343854)
4. **Shintani, Li & Ellis (2013), Comprehension-Based Versus Production-Based Grammar Instruction.** Meta-analysis of 35 projects in 30 studies. Both approaches produced large gains; production had an advantage for delayed productive knowledge. Supports combining meaningful input and output, not eliminating either. [Publisher](https://onlinelibrary.wiley.com/doi/10.1111/lang.12001)
5. **Goo, Granena, Yilmaz & Novella (2015), Implicit and Explicit Instruction in L2 Learning.** Meta-analysis of 34 comparative samples found explicit instruction more effective overall. Supports concise explanations alongside practice; does not imply memorizing rules alone produces fluency. [Publisher](https://benjamins.com/catalog/sibil.48.18goo)
6. **Lyster & Saito (2010), Oral Feedback in Classroom SLA.** Meta-analysis of 15 classroom studies, 827 participants. Corrective feedback had durable benefits; prompts outperformed recasts overall, particularly on constructed-response measures. Generalizing to automated typed feedback is an implementation inference. [Publisher](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/abs/oral-feedback-in-classroom-sla/4999EE1C8379B2BF026B148EAF373CA1)
7. **Nakata & Suzuki (2019), Mixing Grammar Exercises Facilitates Long-Term Retention.** Primary study of 115 Japanese learners practicing English grammar. Interleaving outperformed blocking on an adjusted one-week delayed measure; immediate results differed less. Evidence is narrower than “all mixed practice works.” The blocked-then-mixed condition was not significantly superior to either alternative. [Author manuscript](https://yuichisuzuki.net/wp-content/uploads/2023/04/Nakata-Suzuki-2019-MLJ.pdf)
8. **Vandergrift & Tafaghodtari (2010), Teaching L2 Learners How to Listen Does Make a Difference.** Semester-long primary study of 106 French learners. A guided listening-process group outperformed a same-text, same-exposure comparison after controlling initial differences. Directly relevant, but one classroom study does not validate this app’s exact listening flow. [Publisher](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9922.2009.00559.x)
9. **Saito & Plonsky (2019), Effects of Second Language Pronunciation Teaching Revisited.** Synthesis of 77 studies emphasizes how outcomes depend on measures. Instruction benefits were clearest for monitored, specific features; effects on spontaneous globally rated speech were less clear. Supports focused practice and modest claims. [Publisher](https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12345)
10. **Council of Europe (2020), CEFR Companion Volume.** Authoritative framework, not an intervention trial. Listening descriptors include extracting concrete information from short, familiar, very clearly delivered recordings at A1. Phonology guidance emphasizes intelligibility, sound articulation, and prosody. Use as a goal map; do not present app scores as validated CEFR assessment. Relevant printed pages: 52 and 133–135. [Official PDF](https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4)

Research access note: publisher abstracts were verified for most papers; the interleaving manuscript and CEFR document were inspected in full-text form. No claim here depends on an inaccessible detailed result. This is an evidence-informed design brief, not a systematic review or a claim that the resulting app itself has been validated.
