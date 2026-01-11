# FaziCricketClub Portfolio Demo Site

A polished mini-site showcasing the FaziCricketClub full-stack application for portfolio purposes.

**Developer:** Faz Ahmed
**Website:** [dotnetdeveloper.co.uk](https://dotnetdeveloper.co.uk)

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Landing page with project overview |
| `backend.html` | Backend architecture documentation |
| `frontend.html` | Frontend features documentation |
| `styles.css` | Shared CSS styling |
| `README.md` | This file |

---

## Viewing the Demo Site

### Option 1: Local File
Simply open `index.html` in a web browser.

### Option 2: Local Server (Recommended)
```bash
# Using Python
cd docs
python -m http.server 8080
# Open http://localhost:8080

# Using Node.js (npx)
npx serve docs
```

### Option 3: GitHub Pages
Push to GitHub and enable Pages on the `docs` folder.

---

## Adding Screenshots

The `frontend.html` page includes placeholders for screenshots. To add them:

### Required Screenshots

1. **dashboard.png** - Dashboard overview
   - Route: `/dashboard`
   - Login as any user
   - Capture the main dashboard with stats cards

2. **members-list.png** - Members management
   - Route: `/members`
   - Show the table with some members, search bar visible

3. **match-detail.png** - Match scorecard
   - Route: `/matches/:id` (pick a completed match)
   - Show batting and bowling tables

4. **leaderboards.png** - Player leaderboards
   - Route: `/statistics/leaderboards`
   - Show the rankings table

5. **dark-mode.png** - Dark theme
   - Route: `/settings` or any page
   - Toggle dark mode and capture

6. **admin-users.png** - Admin user management
   - Route: `/admin/users`
   - Login as Admin user
   - Show the user management interface

### Screenshot Instructions

1. **Run the application:**
   ```bash
   # Terminal 1 - Identity API
   cd FaziCricketClub.IdentityApi
   dotnet run

   # Terminal 2 - Main API
   cd FaziCricketClub.API
   dotnet run

   # Terminal 3 - Frontend
   cd FaziCricketClub.Frontend
   ng serve --port 4300
   ```

2. **Login credentials:**
   - Admin: `admin@fazcricket.com` / `Admin@123`
   - Captain: `captain@fazcricket.com` / `Captain@123`
   - Player: `player@fazcricket.com` / `Player@123`

3. **Capture screenshots:**
   - Use browser DevTools (F12) > Device toolbar for consistent sizing
   - Recommended: 1280x800 viewport
   - Save as PNG in the `docs/` folder

4. **Update HTML:**
   Replace the placeholder divs in `frontend.html`:
   ```html
   <!-- Before -->
   <div class="screenshot-placeholder">
       Screenshot: Dashboard Overview
   </div>

   <!-- After -->
   <img src="dashboard.png" alt="Dashboard Overview" class="screenshot-image">
   ```

5. **Add CSS for images (already in styles.css):**
   ```css
   .screenshot-image {
       width: 100%;
       height: auto;
       border-radius: var(--radius-md);
   }
   ```

---

## Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-500: #10b981;  /* Main brand color */
    --primary-600: #059669;  /* Hover states */
    /* ... */
}
```

### Adding Your Info
Update the footer in all HTML files:
```html
<p>&copy; 2025 Faz Ahmed. All rights reserved.</p>
<p>Development & Architecture by
   <a href="https://dotnetdeveloper.co.uk">Faz Ahmed</a>
</p>
```

### Adding Links
The CTA section in `index.html` can link to:
- Live demo URL
- GitHub repository
- LinkedIn profile

---

## Technical Notes

- **No build step required** - Pure HTML/CSS/JS
- **Syntax highlighting** - Uses highlight.js CDN
- **Fonts** - Google Fonts (Inter, JetBrains Mono)
- **Responsive** - Mobile-first design
- **Accessible** - Semantic HTML, proper contrast

---

## License

Copyright 2025 Faz Ahmed. All rights reserved.

The architectural design, code patterns, and technical implementation showcased in this demo were developed by Faz Ahmed (dotnetdeveloper.co.uk).
