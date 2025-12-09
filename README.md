# Naughty or Nice

## Local Dev
```sh
npm install
npm run dev
```
Open the URL Vite prints (usually `http://localhost:5173`).

## Build
```sh
npm run build
npm run preview
```

## Deploy to GitHub Pages
1. Push the repo to GitHub.
2. If using project pages (`https://username.github.io/repo`):
   - Set `base: '/repo/'` in `vite.config.js`.
3. Build and publish the `dist` folder:
   - Create a branch `gh-pages` and publish `dist` contents.
   - Or use GitHub Actions for Vite/Pages.

Example manual deploy:
```sh
npm run build
git checkout --orphan gh-pages
rm -rf .gitignore
mv dist/* .
rm -rf dist
git add -A
git commit -m "Deploy"
git push -f origin gh-pages
```
Then enable Pages under repository settings with branch `gh-pages`.

## License
MIT (code), but no warranties. Enjoy responsibly.
