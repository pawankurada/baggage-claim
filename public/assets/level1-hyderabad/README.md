# Level 1: Hyderabad

Hyderabad is the first-bag approach only: a compact ZERO40, chai shop with rooftop Mini's Biryani billboard, Charminar background, street festoon lights and a text-free Prabhas rooftop billboard. Later bag paths are neutral. All scenery is decorative. Platforms, physics, bags, notes, checkpoints and the ending retain their original logic and coordinates.

## Replace art without touching gameplay

Edit `hyderabadAssets` at the top of `src/hyderabad.js`, or overwrite the corresponding file and reload:

- `zero40/lounge.svg`: illustrated ZERO40 Jubilee Hills cutaway. Replace with a transparent 660:400 PNG/SVG. Put supplied venue references in this directory for future illustration work; raw photographs are not displayed automatically.
- `zero40/`: put a final transparent logo/sign here and set `zero40Sign` to its relative path. It overlays the existing ZERO40 sign. Leave null to use drawn lettering.
- `prabhas/portrait-no-text.png`: generated Baahubali-era Prabhas illustration without lettering. Replace with a 2:3 illustrated portrait/poster, or set `prabhas` to a new file path. Supplied source photos may be stored in this directory, but must be translated into art before displaying if you want the consistent illustrated style.
- `charminar/charminar.svg`: original vector landmark with four minarets and central arch.
- `autos/auto.svg`, `biryani/handi.svg`, `street/shops.svg`: original vector scenery matching the original game's simple shape language.
- `background/`: reserved for later skyline artwork. The sunset and skyline currently draw in Canvas.

These are first-pass illustrations, not exact architectural reproductions. ZERO40 is labelled as the real venue; the illustrated cutaway adapts the Jubilee Hills references, rather than claiming to reproduce a particular photograph. No venue or actor reference was supplied in the project.

## Sources

- ZERO40 official site: https://www.zero40.com/ (venue, four levels, gallery).
- Urban Zen project: https://archinect.com/firms/project/149935625/zero40/150162253 (metallic grey cuboidal façade cutouts, neutral palette, rough-cut timber, pendant lights and greenery).
- Lighting supplier project photos: https://tudoandco.wordpress.com/2017/02/17/customer-showcase-zero40-brewery-hyderabad-india/ (industrial pendants and communal tables).

## Generated poster

Built-in imagegen was used. Final prompt:

"Use case: illustration-story. Create a vertical cinema poster asset for a cozy illustrated Hyderabad 2D platform game. Subject: recognizable Telugu actor Prabhas himself, Baahubali-era look, strong distinctive face, thick wavy shoulder-length dark hair, moustache and short beard, bronze period armour, affectionate dignified expression. Bust portrait dominating poster. Flat gouache illustration, clean rounded silhouettes, restrained details, warm terracotta, cream, muted gold and charcoal palette, not photo, not pixel art. Background simple dusty peach sun halo. Text verbatim at bottom: PRABHAS, smaller BAAHUBALI. No other text. Finished rectangular poster, no frame, no environment."

Poster revision used built-in imagegen: remove all PRABHAS and BAAHUBALI lettering, continue the armour/background, preserve the face, hair, costume, style and composition. The original poster.png is retained.
