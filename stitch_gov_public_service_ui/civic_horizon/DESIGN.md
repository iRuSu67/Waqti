# Design System Specification: The Elevated Civic Experience

## 1. Overview & Creative North Star: "The Digital Architect"
This design system moves away from the sterile, utilitarian aesthetic of traditional public service platforms toward a philosophy we call **"The Digital Architect."** 

The North Star for this system is the intersection of **Institutional Trust and Boutique Digital Craft.** We achieve this by rejecting "template" layouts—flat grids and generic borders—in favor of intentional asymmetry, editorial-grade white space, and a sophisticated layering of surfaces. This system should feel like a high-end architectural blueprint: structured and authoritative, yet airy, modern, and light-filled.

**The Creative Strategy:** 
- **Intentional Breathing Room:** Use exaggerated margins to signify premium quality.
- **Asymmetric Balance:** Align core content to a strict grid, but allow "accent" elements (like background gradients or floating icons) to break the container, creating a sense of motion.
- **Tonal Authority:** Trust is built through high-contrast typography and depth, not through rigid lines.

---

## 2. Colors & Surface Philosophy
The palette is anchored by a high-energy `primary` (#0049e6) that commands attention, supported by a sophisticated range of navies and "off-whites" that prevent the interface from feeling harsh.

### The "No-Line" Rule
**Traditional 1px borders are strictly prohibited for sectioning.** To define boundaries, designers must use background shifts. 
- Use `surface_container_low` (#eef0ff) for the main page body.
- Use `surface_container_lowest` (#ffffff) for card elements to create a "lifted" effect without a stroke.
- This creates a soft, organic UI that feels woven together rather than boxed in.

### Signature Textures & Gradients
Flat buttons are for utilities; actions are for engagement. 
- **Action Gradients:** Use a subtle linear gradient (45°) from `primary` (#0049e6) to `primary_container` (#829bff) for main CTAs. This adds a "jewel-like" depth that feels high-end and interactive.
- **Glassmorphism:** For floating navigation or top-level modals, use `surface` at 80% opacity with a `20px` backdrop-blur. This ensures the vibrant royal blue headers "bleed" through, maintaining color continuity.

---

### 3. Typography: The Editorial Voice
We use **Inter** exclusively to bridge the gap between technical legibility and modern elegance.

| Token | Size | Weight | Role |
| :--- | :--- | :--- | :--- |
| **display-lg** | 3.5rem | 700 (Bold) | Hero statements / Impactful data |
| **headline-md** | 1.75rem | 600 (Semi) | Section headers |
| **title-lg** | 1.375rem | 600 (Semi) | Card titles / Form headers |
| **body-lg** | 1.0rem | 400 (Regular) | Primary reading / Descriptions |
| **label-md** | 0.75rem | 500 (Medium) | Functional tags / Metadata |

**Hierarchy Note:** To achieve the "Dribbble-trending" look, maintain a high contrast between `on_surface` (#272e42) for titles and `on_surface_variant` (#535b71) for body text. This creates a clear visual path for the user’s eye.

---

## 4. Elevation & Depth
In this design system, depth is a functional tool, not just an ornament.

- **Tonal Layering:** Always stack "Light on Darker." For example, a `surface_container_lowest` card should sit atop a `surface_container_low` background. 
- **Ambient Shadows:** For "Active" or "Featured" cards, use a deep, diffused shadow.
    - *Shadow Color:* `on_surface` at 6% opacity.
    - *Blur:* 40px.
    - *Spread:* -5px (to keep the shadow tucked and clean).
- **The "Ghost Border" Fallback:** If a layout requires a divider (e.g., in complex data tables), use `outline_variant` (#a5adc6) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons: The "App Store" Polish
- **Primary:** Gradient fill (`primary` to `primary_container`), `xl` (1.5rem) corner radius. Subtle inner-glow on top edge.
- **Secondary:** Transparent background with `outline` at 20% opacity. 
- **Interaction:** On hover, the gradient should shift slightly in hue; on click, the component should scale to 98%.

### Cards & Containers
- **Rules:** No dividers. Separation is achieved through `xl` (1.5rem) corner radius and the `surface_container` hierarchy.
- **Content:** Pair `headline-sm` titles with `body-sm` descriptions. Icons should be "Dual-Tone": `primary` for the main shape and `primary_container` for the accent.

### Input Fields
- **Resting State:** `surface_container_high` background with no border. 
- **Focused State:** A 2px `primary` border with a 4px soft outer glow (using `primary` at 10% opacity).
- **Labeling:** Use `label-md` floating above the field in `on_surface_variant`.

### Signature Component: The "Civic Progress" Widget
A unique component for this system—a container that uses a `tertiary` (#903985) accent bar on the left edge to denote urgent public service updates (e.g., "New Election Data" or "Utility Alert"). This breaks the blue-monochrome and signals high-importance through color theory.

---

## 6. Do’s and Don’ts

### Do:
- **Do** use `9999px` (Full) rounding for pills/tags to create a friendly, modern contrast against the `xl` card corners.
- **Do** allow content to breathe. If you think there is enough margin, add 8px more.
- **Do** use `primary_fixed` (#829bff) for background tints when you need to highlight a specific functional area.

### Don’t:
- **Don’t** use pure #000000 for text. It’s too harsh. Always use `on_surface` (#272e42).
- **Don’t** use 1px solid lines to separate list items. Use a 16px vertical gap instead.
- **Don’t** use standard "Drop Shadows" from a default library. They are too muddy. Always use tinted, diffused ambient shadows.
- **Don't** use sharp corners (`none`). The civic experience should feel welcoming, not industrial. Use `md` (0.75rem) as the absolute minimum radius.