# Font Usage Guide

This project uses a comprehensive font management system with multiple Google Fonts for different use cases.

## Available Fonts

### Primary Fonts
- **Inter** (`font-sans`) - Main UI font, modern and clean
- **Montserrat** (`font-display`) - Headers and titles, bold and impactful
- **Source Sans 3** (`font-body`) - Body text, highly readable

### Secondary Fonts
- **Poppins** (`font-friendly`) - Friendly UI elements, rounded and approachable
- **Nunito** (`font-thai`) - Thai language support, excellent readability
- **Roboto Mono** (`font-mono`) - Code and monospace text

## Usage Examples

### In Components
```tsx
// Using font classes
<h1 className="font-display font-bold text-4xl">Main Title</h1>
<p className="font-body text-lg">Body text content</p>
<code className="font-mono text-sm">Code snippet</code>

// Using font combinations
<div className="font-friendly font-medium">
  Friendly interface text
</div>
```

### Font Combinations
```tsx
import { getFontVariables } from '@/lib/fonts'

// Modern combination
<div className={getFontVariables('modern')}>
  Modern UI content
</div>

// Friendly combination
<div className={getFontVariables('friendly')}>
  Friendly interface
</div>
```

### Font Weights
```tsx
// Available weights
<span className="font-light">Light text</span>
<span className="font-normal">Normal text</span>
<span className="font-medium">Medium text</span>
<span className="font-semibold">Semibold text</span>
<span className="font-bold">Bold text</span>
<span className="font-extrabold">Extra bold text</span>
<span className="font-black">Black text</span>
```

### Font Sizes
```tsx
// Available sizes
<span className="text-xs">Extra small</span>
<span className="text-sm">Small</span>
<span className="text-base">Base</span>
<span className="text-lg">Large</span>
<span className="text-xl">Extra large</span>
<span className="text-2xl">2X large</span>
<span className="text-3xl">3X large</span>
<span className="text-4xl">4X large</span>
<span className="text-5xl">5X large</span>
<span className="text-6xl">6X large</span>
```

## Best Practices

1. **Use font-display for headings** - Montserrat provides strong visual hierarchy
2. **Use font-body for content** - Source Sans 3 is optimized for readability
3. **Use font-sans for UI elements** - Inter provides clean, modern interface
4. **Use font-friendly for friendly interfaces** - Poppins adds warmth
5. **Use font-thai for Thai content** - Nunito has excellent Thai support
6. **Use font-mono for code** - Roboto Mono is designed for code readability

## Performance

All fonts are:
- Preloaded for optimal performance
- Use `display: swap` for better loading experience
- Include Latin and Thai subsets
- Optimized with multiple weights

## Customization

To add new fonts or modify existing ones:

1. Add the font import in `src/lib/fonts.ts`
2. Add the font variable to the CSS in `src/app/globals.css`
3. Update the font configuration object
4. Add utility classes as needed
