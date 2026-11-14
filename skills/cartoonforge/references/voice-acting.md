# Voice acting — how delivery changes with the situation

TTS reads flat. Cartoon dialogue carries emotion mostly in **pitch movement** (level, swings, cracks)
and **timing**, while loudness stays fairly even (TV dialogue is compressed). These rules were measured
on reference clips of adult-animation dialogue (pitch tracked with pYIN, semitones relative to the
speaker's median). They describe *delivery patterns*, never a specific actor's voice.

| Situation | Pitch level | Movement | Timing | Other |
|---|---|---|---|---|
| Panic, yelling for help | +6…+7.5 st, peaks +13 | each phrase starts high and **falls** ~8 st | short 1–2.5 s bursts, quick breaths | voice **cracks** upward on the first syllable |
| Nervous talking to oneself | ±1 st | wide (≈10 st), jumpy spikes on stressed words | fast, many tiny pauses | stammer on starts, wobble |
| Defeated, flat, bored | −4…−5 st | narrow (3–5 st), monotone, slight fall | slower, longer stretches | — |
| Hopeful / asking | +2…+2.5 st | **rises** through the phrase, ends high | normal | — |
| Surprise yelp ("oh!") | sudden jump +12…+16 st from low | instant up, back down | very short | — |
| Deadpan statement | ≈0…−1 st | very narrow (3–5 st), drifts down at the end | steady rhythm | — |
| Hysterical shriek | +10 st | huge slow **swings** (≈15 st, ~2–3 per second), shrill rise at the end | sustained | crack at the start |

## In cartoonforge
`script.json` lines carry `"emotion"`; `audio.mjs` turns it into delivery (`EMO_VOICE`):
speed ×, static pitch, gain, contour from→to, crack, wobble, stammer, swoop — `voice_acting.py`
bends the TTS line ("tape bend") and adds stammer. Override any field per line:

```json
{ "text": "Wait. Robots?!", "emotion": "shocked", "crack": 12, "to": -6 }
```

Emotions with voice profiles: happy, laugh, excited, dreamy, smug, bored, sad, crying, surprised, shocked,
scared, nervous, embarrassed, confused, skeptical, disgusted, angry, furious, hysterical, deadpan.
