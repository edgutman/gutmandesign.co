# Gutman Design Portfolio

Product design portfolio for Eddy Gutman, showcasing fintech and growth design work.

## Local Development

### Quick Start
```bash
# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Project Structure
```
/
├── index.html                 # Homepage
├── assets/
│   ├── css/
│   │   └── main.css          # Main stylesheet
│   ├── js/
│   │   └── main.js           # Site functionality
│   ├── images/
│   │   ├── portrait.svg      # Brand illustration
│   │   └── case-studies/     # Project images (placeholder)
│   └── fonts/                # Web fonts (if needed)
├── case-study-*.html          # Individual case studies (to be created)
├── about.html                 # About page (to be created)
├── password.html              # Password protection (to be created)
└── resume.pdf                 # Downloadable resume (to be added)
```

### Features Implemented
- ✅ Responsive HTML structure
- ✅ CSS Grid layout system
- ✅ Mobile-first responsive design
- ✅ Smooth scrolling navigation
- ✅ Intersection Observer animations
- ✅ Mobile navigation toggle
- ✅ SEO-optimized meta tags
- ✅ Accessible markup

### Next Steps
1. Add actual case study content and images
2. Create individual case study pages
3. Implement password protection for Altruist work
4. Add About page
5. Add resume PDF
6. Optimize images and performance
7. Test cross-browser compatibility

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

### Performance Features
- Lazy loading images
- CSS custom properties for theming
- Minimal JavaScript footprint
- Optimized SVG graphics
- No external dependencies

## Content Management

### Adding Case Studies
1. Create new HTML file: `case-study-[name].html`
2. Use consistent structure from planning docs
3. Add preview image to `assets/images/case-studies/`
4. Update homepage grid with new case study card

### Updating Content
- Hero copy: Edit `index.html` hero section
- Services: Update services section in `index.html`
- Contact info: Update contact section and meta tags
- Styling: Modify `assets/css/main.css`

Built with vanilla HTML, CSS, and JavaScript for maximum performance and maintainability.