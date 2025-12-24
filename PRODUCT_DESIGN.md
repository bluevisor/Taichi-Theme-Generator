# Taichi Theme Generator - Product Design Document

**Version**: 25.12.1\
**Last Updated**: 2024-12-24

---

## Overview

Taichi Theme Generator is a web-based tool for generating harmonious dual
light/dark theme color palettes for design systems. The application generates 10
semantic color tokens that work together to create cohesive UI themes, with
real-time preview of how the colors appear in common UI components.

---

## Core Concepts

### Dual Theme Generation

Every generation produces **both** a Light and Dark theme simultaneously,
ensuring visual harmony across both modes. The themes share the same hue
relationships but apply different lightness values appropriate for each mode.

### Semantic Color Tokens (10 Total)

The generator produces 10 lockable/editable color tokens:

| Token         | Purpose                                       |
| ------------- | --------------------------------------------- |
| `bg`          | Main page/app background                      |
| `surface`     | Card, modal, container backgrounds            |
| `text`        | Primary body text                             |
| `textMuted`   | Secondary/muted text (captions, labels)       |
| `textOnColor` | Text on colored backgrounds (buttons, badges) |
| `primary`     | Primary brand/action color                    |
| `secondary`   | Secondary brand color                         |
| `accent`      | Highlight/accent color                        |
| `success`     | Success/positive state                        |
| `error`       | Error/destructive state                       |

### Additional Internal Tokens (Not Displayed in Swatch Strip)

These tokens are generated but not shown in the main swatch strip:

- `surface2` - Secondary surface (derived from `surface`)
- `primaryFg` - Foreground on primary (typically white)
- `secondaryFg` - Foreground on secondary
- `accentFg` - Foreground on accent
- `successFg` - Foreground on success
- `errorFg` - Foreground on error
- `warnFg` - Foreground on warn
- `border` - Border color (derived from text)
- `ring` - Focus ring color (derived from primary)
- `warn` / `warnFg` - Warning state (not displayed)

---

## User Interface Layout

The application has a vertical layout structure:

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER BAR                           │
├─────────────────────────────────────────────────────────────┤
│              OPTIONS PANEL (Collapsible)                    │
├─────────────────────────────────────────────────────────────┤
│               SWATCH STRIP (Collapsible)                    │
├─────────────────────────────────────────────────────────────┤
│   LIGHT THEME PREVIEW    │    DARK THEME PREVIEW            │
│                          │                                  │
│                          │                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## UI Elements - Detailed Description

### 1. Header Bar

**Location**: Fixed at top of viewport\
**Background**: Uses current UI theme (light/dark based on system preference or
user toggle)

#### 1.1 Logo / Brand (Left Side)

- **Taichi Icon**: Custom yin-yang SVG icon representing duality of light/dark
  themes
- **Text**: "Taichi Theme Generator"
- **Interaction**: None (decorative)

#### 1.2 Navigation Controls (Right Side)

Two navigation arrows for history:

- **Left Arrow** (`←`): Navigate to previous theme in history (newer)
- **Right Arrow** (`→`): Navigate to next theme in history (older)

#### 1.3 Generate Button

- **Icon**: Shuffle + Spacebar badge
- **Label**: "Generate" + "Space" indicator
- **Action**: Generates a new random theme using current mode and settings
- **Keyboard Shortcut**: `Space` key

#### 1.4 Mode Dropdown

Harmony mode selection for color generation:

- **Random**: Completely random hue selection
- **Monochrome**: Single hue with saturation variations
- **Analogous**: Adjacent hues (±30°)
- **Complementary**: Opposite hues (180° apart)
- **Split-Complementary**: Base + two colors ±150° apart
- **Triadic**: Three colors 120° apart

#### 1.5 Format Dropdown

Output color format for copy/export:

- **HEX**: `#RRGGBB`
- **RGB**: `rgb(R, G, B)`
- **CMYK**: `cmyk(C%, M%, Y%, K%)`
- **HSL**: `hsl(H, S%, L%)`
- **LAB**: `lab(L% a b)`
- **LCH**: `lch(L% C H)`
- **OKLCH**: `oklch(L% C H)`
- **Display P3**: `color(display-p3 R G B)`

#### 1.6 Action Buttons (Icon Buttons)

| Button       | Icon  | Action                             |
| ------------ | ----- | ---------------------------------- |
| Palette      | 🎨    | Toggle Swatch Strip visibility     |
| Options      | ⚙️    | Toggle Options Panel visibility    |
| Image        | 🖼️    | Upload image to extract seed color |
| History      | 📜    | Toggle History Panel visibility    |
| Download     | ⬇️    | Export theme as JSON file          |
| Share        | 🔗    | Open Share Modal for URL sharing   |
| Theme Toggle | ☀️/🌙 | Toggle UI between light/dark mode  |

#### 1.7 Mobile Menu

- **Hamburger Icon**: Visible on mobile only
- **Action**: Opens mobile drawer with all header actions

---

### 2. Options Panel (Collapsible)

**Location**: Below header, above swatch strip\
**Toggle**: Click the Options (⚙️) button in header\
**Layout**: 7-column grid on desktop, 4-column on tablet, 2-column on mobile

#### 2.1 Border Width Slider

- **Range**: 0-3 (None, 1px, 2px, 4px)
- **Labels**: "None" ↔ "Thick"
- **Effect**: Controls border thickness on UI elements in preview
- **Display**: Shows actual pixel value (e.g., "2px")

#### 2.2 Shadows Slider

- **Range**: 0-5 (None to XL shadow)
- **Labels**: "Flat" ↔ "Float"
- **Effect**: Controls shadow intensity on cards/buttons in preview
- **Display**: Shows level number (e.g., "Lvl 3")

#### 2.3 Roundness Slider

- **Range**: 0-5 (Sharp to Very Round)
- **Labels**: "Square" ↔ "Round"
- **Effect**: Controls border-radius on UI elements
- **Mapping**: 0=none, 1=sm, 2=md, 3=xl, 4=2xl, 5=3xl/full

#### 2.4 Gradients Slider

- **Range**: 0-2 (Solid, Subtle, Vivid)
- **Labels**: "Solid" ↔ "Vivid"
- **Effect**: Controls gradient intensity on primary buttons
- **Mapping**: 0=solid color, 1=subtle linear, 2=strong diagonal

#### 2.5 Saturation Slider

- **Range**: 0-4
- **Labels**: "Mono" ↔ "Vivid"
- **Effect**: Controls color vibrancy across all generated colors
- **Behavior**:
  - Level 0: Pure grayscale
  - Level 1-4: Progressively more saturated colors
- **Triggers Regeneration**: Yes

#### 2.6 Brightness Slider

- **Range**: 1-5
- **Labels**: "Dim" ↔ "Bright"
- **Default**: 3 (Normal)
- **Effect**: Compresses entire color range toward dark or bright
- **Behavior**:
  - Level 1 (Dim): Compresses toward dark - colors near white shift toward 50%
    gray
  - Level 3 (Normal): No change - equal headroom to white and black
  - Level 5 (Bright): Compresses toward bright - colors near black shift toward
    50% gray
- **Algorithm**: Uses `applyBrightness(lightness, level)` function:
  - Colors at 50% gray: minimal/no shift
  - Colors near 0% or 100%: maximum shift toward 50%
  - Shift amount proportional to distance from center gray
- **Triggers Regeneration**: Yes
- **Applied To**: ALL color tokens (bg, surface, text, primary, secondary,
  accent, success, error, border, ring)

#### 2.7 Contrast Slider

- **Range**: 1-5
- **Labels**: "Soft" ↔ "Max"
- **Effect**: Controls difference between text and background
- **Behavior**: Higher values create more readable text with greater lightness
  difference
- **Triggers Regeneration**: Yes

---

### 3. Swatch Strip (Collapsible)

**Location**: Below options panel, above preview\
**Toggle**: Click the Palette (🎨) button in header\
**Layout**: 10 columns on desktop (lg), 5 on tablet (sm), 2 on mobile

#### 3.1 Compact Swatch Design

Each swatch displays:

- **Header Row**: Token name (uppercase) + Lock icon
- **Light/Dark Side-by-Side**: Two color rectangles showing light and dark
  values
- **Color Values**: Displayed inside each swatch with auto-contrasting text

#### 3.2 Swatch Interactions

- **Click on Swatch**: Copies color value to clipboard
- **Click Lock Icon**: Locks color to prevent regeneration
- **Hover**: Scales slightly with shadow for visual feedback

#### 3.3 Token Display Order

1. `bg`
2. `surface`
3. `text`
4. `textMuted`
5. `textOnColor`
6. `primary`
7. `secondary`
8. `accent`
9. `success`
10. `error`

---

### 4. Preview Section (Split View)

**Location**: Main content area, takes remaining viewport height\
**Layout**: Side-by-side (50%/50%) on desktop, stacked on mobile

#### 4.1 Light Theme Preview (Left)

Displays UI components using the light theme colors.

#### 4.2 Dark Theme Preview (Right)

Displays UI components using the dark theme colors.

#### 4.3 Preview Components (Both Sides)

##### 4.3.1 Theme Badge

- Pill badge showing "Light Theme Preview" or "Dark Theme Preview"
- Uses `primary` color at 15% opacity with border

##### 4.3.2 Main Heading

- "Taichi Theme Generator"
- Shows text gradient effect when gradients slider > 0

##### 4.3.3 Description Paragraph

- Uses `textMuted` for secondary text
- Contains inline code badges for `primary`, `secondary`, `accent` tokens

##### 4.3.4 Keyboard Hint

- "Press Space to generate..." instruction
- Uses `accent` color for the keyboard badge

##### 4.3.5 Display Section (Hero Banner)

- Large hero card with background image
- Gradient overlays using `primary` and `accent`
- "Premium Experience" badge using `secondary`
- Main headline with colored text spans
- Shimmer animation on hover (plays once)
- Float-up animation on hover

##### 4.3.6 Actions Section

Demonstrates button styles:

- **Primary Button**: Uses `primary` color + gradient (if enabled)
- **Secondary Button**: Uses `secondary` color
- **Accent Button**: Uses `accent` color
- **Outline Button**: Border-only with `surface` background
- **Error Button**: Uses `error` color
- **Success Button**: Uses `success` color
- **Icon Buttons**: Settings and Bell icons

##### 4.3.7 Input Fields Section

- Email input with icon
- Select dropdown
- Checkbox and radio buttons
- Volume/range slider

##### 4.3.8 Cards Section

- **Revenue Card**: Progress bar, stats, icon badge
- **Profile Card**: Avatar, tags, action button

##### 4.3.9 Feedback Section (Alerts)

- Info alert using `secondary`
- Error alert using `error`
- Success alert using `success`

##### 4.3.10 Navigation Section

- Tab navigation with active state
- Breadcrumb navigation
- Avatar badge

##### 4.3.11 Footer

- Brand section with logo
- Link columns (Product, Resources, Legal)
- Social icons
- Copyright with version number

---

### 5. History Panel (Collapsible)

**Location**: Overlay from left side\
**Toggle**: Click History (📜) button

Contains:

- Scrollable list of previous themes
- Visual preview swatches for each
- Click to restore theme
- Clear history button

---

### 6. Share Modal

**Location**: Centered modal overlay\
**Toggle**: Click Share (🔗) button

Features:

- Shareable URL containing theme seed and settings
- Copy URL button
- Social share options

---

## Keyboard Shortcuts

| Key            | Action                      |
| -------------- | --------------------------- |
| `Space`        | Generate new theme          |
| `←` / `→`      | Navigate theme history      |
| `Cmd/Ctrl + Z` | Undo (go to previous theme) |

---

## URL Parameters

The application state is encoded in URL parameters for sharing:

| Param  | Description                                |
| ------ | ------------------------------------------ |
| `mode` | Generation mode (random, monochrome, etc.) |
| `seed` | Seed color hex value                       |
| `sat`  | Saturation level (0-4)                     |
| `con`  | Contrast level (1-5)                       |
| `bri`  | Brightness level (1-5)                     |
| `bw`   | Border width (0-3)                         |
| `sh`   | Shadow strength (0-5)                      |
| `gr`   | Gradient level (0-2)                       |
| `rd`   | Radius level (0-5)                         |

---

## Color Generation Algorithm

### Base Hue Selection

1. **Random Mode**: Completely random base hue
2. **Harmony Modes**: Base hue with calculated complementary hues

### Saturation Application

- Level 0: Pure grayscale (0% saturation)
- Level 1-4: Mapped to ranges 15-25%, 40-50%, 65-75%, 90-100%

### Brightness Application

**Implementation** (via `applyBrightness` function):

- Applied to ALL color tokens
- Shift amount = proportional to distance from 50% gray
- Colors at 50% gray: no shift
- Colors near 0% or 100%: maximum shift toward center

**Level Effects**:

- Level 1 (Dim): Bright colors compressed 50% toward gray
- Level 2: Bright colors compressed 25% toward gray
- Level 3 (Normal): No change
- Level 4: Dark colors compressed 25% toward gray
- Level 5 (Bright): Dark colors compressed 50% toward gray

### Contrast Application

- Calculates text lightness as offset from background
- Higher contrast = greater offset
- Ensures minimum readability even at extremes

---

## Technical Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React
- **State**: React hooks (useState, useEffect, useCallback)
- **Persistence**: LocalStorage for history
- **URL Routing**: Browser History API

---

## File Structure

```
/
├── App.tsx                    # Main application component
├── types.ts                   # TypeScript type definitions
├── index.html                 # HTML entry with Tailwind config
├── components/
│   ├── PreviewSection.tsx     # Theme preview with UI components
│   ├── SwatchStrip.tsx        # Color swatch grid
│   └── ShareModal.tsx         # Share URL modal
└── utils/
    └── colorUtils.ts          # Color generation and conversion
```

---

## Known Issues / TODOs

1. **Mobile Experience**: Preview sections are constrained on mobile; recommend
   landscape or tablet.

---

## Version History

- **v25.12.1**: Added textMuted, textOnColor tokens; redesigned swatch strip;
  added brightness slider
- **v25.12.0**: Initial release with 8 swatch colors
