# Marketing Agency Landing Page

A modern, responsive landing page for a marketing agency built with HTML and CSS.

## Project Structure

```
.
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Global styles and variables
├── sections/              # Modular HTML sections
│   ├── hero.html         # Hero section
│   ├── partners.html     # Partners logo grid
│   ├── mission.html      # Mission statement and stats
│   └── services.html     # Services grid
└── assets/               # Images and SVGs
    ├── logo.svg
    └── partners/         # Partner logos
```

## Features

- Modern, clean design
- Fully responsive layout
- Modular section-based architecture
- CSS custom properties for easy theming
- Optimized for performance
- Interactive hover states and animations

## Setup

1. Clone the repository
2. Create the `assets` directory and add required images:
   - Add your logo as `assets/logo.svg`
   - Add partner logos in `assets/partners/`
   - Add team illustration as `assets/team-illustration.svg`
3. Open `index.html` in a web browser

## Browser Support

The site is built with modern CSS features and is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

The site uses a modular approach where each section is in its own HTML file with scoped styles. This makes it easy to:
- Maintain and update individual sections
- Reuse components across pages
- Keep the codebase organized and scalable

To add a new section:
1. Create a new HTML file in the `sections` directory
2. Add the section's HTML and scoped styles
3. Import it in `index.html` 