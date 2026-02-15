# Program Branding Conventions

## Canonical Program Names

Use these exact display names in UI copy:

- `FOSStar`
- `FOSServe`
- `FOSSynC`
- `FOSStorm`
- `FOSStart`
- `FOSSterage`
- `FOSSpeaks`

`FOSStart` is the canonical name. Do not use `FOSSArt` in product UI or data keys.

## Program Identity Source of Truth

All program identity metadata must come from `lib/programs.ts`:

- `id`
- `displayName`
- `slug`
- `logo`
- `themeClass`
- `description`

## Asset Naming Convention

Program logos in `public/logos/` should follow:

- `/<slug>-logo.png`
- `/<slug>-logo.svg` (optional)

Examples:

- `fosstar-logo.png`
- `fosstart-logo.png`
- `fosspeaks-logo.png`

## Styling Convention

Use explicit class maps from `lib/programs.ts` for program theme usage:

- `PROGRAM_TEXT_CLASS`
- `PROGRAM_BG_CLASS`
- `PROGRAM_HOVER_BG_CLASS`

Avoid runtime-generated Tailwind classes like ``text-${program}`` or ``bg-${program}``.
