# Carrière de mode — backend Vercel

Backend visuel isolé. Cette migration est volontairement additive : le jeu GitHub Pages continue d'utiliser son endpoint actuel tant que le backend Vercel n'a pas été déployé, configuré et testé.

Variables requises côté Vercel :
- `MAGNIFIC_API_KEY`

Routes :
- `GET /api/health`
- `POST /api/generate-listing-visual`

Le basculement du jeu se fera seulement après validation du endpoint Vercel en production.
