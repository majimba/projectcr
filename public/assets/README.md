# Assets Directory

This directory contains all static assets for the Project CR Dashboard application.

## Directory Structure

```
assets/
├── images/          # General images, photos, screenshots
├── graphics/        # Charts, diagrams, illustrations
├── icons/           # Icon files (SVG, PNG, ICO)
├── logos/           # Company logos, brand assets
└── README.md        # This file
```

## Usage in Next.js

All assets in this directory are served from the root URL. For example:

- `public/assets/images/hero.jpg` → `http://localhost:3000/assets/images/hero.jpg`
- `public/assets/icons/user.svg` → `http://localhost:3000/assets/icons/user.svg`

## Best Practices

### File Naming
- Use kebab-case for file names: `user-profile-icon.svg`
- Be descriptive but concise
- Include size indicators when relevant: `logo-32x32.png`

### Image Optimization
- Use appropriate formats:
  - **SVG** for icons and simple graphics
  - **PNG** for images with transparency
  - **JPG** for photographs
  - **WebP** for modern browsers (with fallbacks)

### File Organization
- Group related assets in subdirectories
- Use consistent naming conventions
- Keep file sizes optimized for web use
- Include both regular and high-DPI versions when needed

## Asset Guidelines

### Images
- Maximum width: 1920px for hero images
- Maximum width: 800px for content images
- Compress images before adding to repository
- Use descriptive alt text in components

### Icons
- Prefer SVG format for scalability
- Use consistent stroke width (typically 1.5px or 2px)
- Follow the design system's icon style guide
- Include both filled and outlined versions when applicable

### Graphics
- Maintain consistent color palette
- Use the project's brand colors
- Ensure accessibility compliance
- Provide alternative text descriptions

## Adding New Assets

1. Place files in the appropriate subdirectory
2. Use descriptive, kebab-case naming
3. Optimize file size and format
4. Update this README if adding new categories
5. Test assets in the application

## Current Assets

### Images
- *No images added yet*

### Graphics
- *No graphics added yet*

### Icons
- *No custom icons added yet*

### Logos
**Luminary Co. Brand Assets**

#### Primary Logo Variations
- `luminary-logo.png` (1086KB) - Main logo file
- `luminary-logo-500x500.png` (191KB) - Square format, medium size
- `luminary-logo-1000x1000.png` (924KB) - Square format, large size
- `luminary-logo-2000x2000.png` (2.3MB) - Square format, extra large size

#### Color Variations
- `logo_monochrome.png` (456KB) - Monochrome/black version
- `logo_yellow_text_white_bg.png` (6.6KB) - Yellow text on white background
- `logo_yellow_text_white_bg_enhanced.png` (6.6KB) - Enhanced version
- `logo_yellow_text_white_bg_fixed.png` (6.6KB) - Fixed version
- `logo_white_text_yellow_bg.png` (6.6KB) - White text on yellow background
- `logo_white_text_yellow_bg_fixed.png` (6.6KB) - Fixed version

#### Specialized Versions
- `luminaryco_logo_transparent.png` (1.1MB) - Transparent background
- `luminaryco_logo_white_bg_yellow_text.png` (14KB) - White background with yellow text

#### Usage Recommendations
- **Primary Logo**: Use `luminary-logo.png` for most applications
- **Square Format**: Use `luminary-logo-500x500.png` for social media and profile images
- **Transparent Background**: Use `luminaryco_logo_transparent.png` when background color is unknown
- **Monochrome**: Use `logo_monochrome.png` for single-color applications
- **High Resolution**: Use `luminary-logo-2000x2000.png` for print or large displays
