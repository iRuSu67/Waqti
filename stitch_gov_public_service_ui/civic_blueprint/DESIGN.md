# Design System Documentation: The Digital Secretariat

## 1. Overview & Creative North Star
The objective of this design system is to evolve the "institutional" aesthetic from a cold, bureaucratic experience into a premium, editorial service. We are moving away from the generic "utility app" look toward a concept we call **"The Digital Secretariat."**

This Creative North Star emphasizes authoritative clarity, quiet confidence, and sophisticated organization. By utilizing intentional asymmetry, varying typographic scales, and tonal depth, we create a UI that feels less like a database and more like a high-end concierge for public service. We reject the "flat" trap of the early 2010s; instead, we embrace a "Dimensional Minimalism" where hierarchy is communicated through light and layering rather than lines and boxes.

---

## 2. Colors & Surface Logic
Our palette is rooted in a "Stark White" foundation, but it is the nuanced shifts between surfaces that define the experience.

### The "No-Line" Rule
Explicitly prohibited: 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts. For example, a card should be defined by placing a `surface_container_lowest` (#ffffff) element on a `surface_container_low` (#f1f4f6) background. 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine archival paper.
- **Level 0 (Base):** `surface` (#f8f9fa). Used for the primary app background.
- **Level 1 (Sectioning):** `surface_container_low` (#f1f4f6). Used to group content areas.
- **Level 2 (Interaction):** `surface_container_lowest` (#ffffff). Used for primary cards and input fields.
- **Level 3 (Prominence):** `surface_container_high` (#e3e9ec). Used for secondary information or inactive states.

### The "Glass & Gradient" Rule
To elevate the navy blue headers beyond a standard "flat" header, use a subtle tonal transition from `primary` (#3a5f94) to `on_primary_fixed_variant` (#375c91). 
- **Floating Elements:** Use Glassmorphism for persistent bottom bars or top navigation. Apply a semi-transparent `surface` color with a 20px-32px backdrop-blur. This ensures the content feels integrated and the app feels "airy" rather than heavy.

---

## 3. Typography
We use a dual-font strategy to balance institutional authority with modern legibility.

- **The Voice (Public Sans):** Used for `display` and `headline` scales. Public Sans provides a "government-standard" weight that feels official yet approachable. Use high contrast in sizing—pair a `headline-lg` (2rem) with `body-md` (0.875rem) to create an editorial, rhythmic flow.
- **The Engine (Inter):** Used for `title`, `body`, and `label` scales. Inter is selected for its high x-height and exceptional legibility in dense service data.

**Key Rule:** Titles should never be "just bold." Use `on_surface_variant` (#586064) for labels and `on_surface` (#2b3437) for primary content to create tonal hierarchy through color, not just weight.

---

## 4. Elevation & Depth
In this system, depth is a tool for focus, not decoration.

### The Layering Principle
Hierarchy is achieved by "stacking" the surface-container tiers. Place a `surface_container_lowest` card on a `surface_container_low` background to create a soft, natural lift.

### Ambient Shadows
When an element must "float" (e.g., a primary action button or a modal), use an **Ambient Shadow**:
- **Color:** `on_surface` (#2b3437) at 4%–6% opacity.
- **Blur:** 24px to 40px.
- **Spread:** -4px.
This mimics natural light and avoids the "muddy" look of standard 10% black shadows.

### The "Ghost Border" Fallback
If a boundary is absolutely necessary for accessibility, use a **Ghost Border**:
- **Token:** `outline_variant` (#abb3b7).
- **Opacity:** 15%–20%.
- **Weight:** 1px.
Never use 100% opaque borders; they interrupt the visual flow.

---

## 5. Components

### Buttons
- **Primary:** Use `primary` (#3a5f94) with a subtle linear gradient to `primary_dim` (#2d5387). Corner radius: `md` (0.375rem).
- **Secondary:** `primary_container` (#d5e3ff) background with `on_primary_container` (#2c5287) text. No border.
- **Tertiary:** Text-only using `on_primary_fixed` (#153f73), with a 10% opacity `primary` background on press state.

### Cards & Lists
**Strict Rule:** No divider lines. 
- Separate list items using 16px of vertical white space from the spacing scale.
- For high-density data, use alternating tonal backgrounds (e.g., `surface` and `surface_container_low`) instead of lines.

### Input Fields
- **Background:** `surface_container_lowest` (#ffffff).
- **Border:** Ghost Border (20% `outline_variant`).
- **Active State:** Change border to 100% `primary` (#3a5f94) and add a soft 4px `primary_fixed` (#d5e3ff) outer glow.

### New Component: The Service Header
A bespoke mobile header for public service. A large `headline-lg` title sits on a `surface_container_lowest` background that transitions into a glassmorphic state upon scroll, ensuring the user always has a clear "Home" sensation.

---

## 6. Do's and Don'ts

### Do
- **Do** use `surface_container_lowest` for elements the user can interact with (buttons, inputs, cards).
- **Do** prioritize "Breathing Room." If you think there is enough margin, add 8px more.
- **Do** use `tertiary` (#5d5d78) for supplementary info that isn't essential but provides context.

### Don't
- **Don't** use pure #000000 for text. Use `on_surface` (#2b3437) for a softer, premium feel.
- **Don't** use icons with different stroke weights. Stick to a 1.5pt or 2pt stroke consistent with the `label-md` weight.
- **Don't** use traditional "alert red" for errors. Use `error` (#9f403d) which is more sophisticated and less alarming for a government context.