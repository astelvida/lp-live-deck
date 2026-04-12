## Deploy Checklist — run before EVERY deploy
- [ ] npm run type-check — zero errors
- [ ] npm run build — clean, zero warnings
- [ ] Zero hardcoded values anywhere in src/
- [ ] Error boundaries: kill Notion env vars, verify fallback renders
- [ ] Lighthouse: Performance ≥90 · Accessibility ≥90 · Best Practices ≥90
- [ ] Responsive: 375px · 768px · 1440px (Playwright screenshots)
- [ ] OG tags: og:title · og:description · og:image render correctly
- [ ] Animations: 60fps confirmed in Chrome DevTools Performance tab

## Git
- Branch: feat/[section] · fix/[description]
- Commits: feat(hero): add live pipeline count
- Types: feat · fix · refactor · style · chore · docs
- Never commit to main directly