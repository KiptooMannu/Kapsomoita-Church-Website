// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Your GitHub repo name
const repoName = 'Kapsomoita-Church-Website'

// If deploying on GitHub Pages, set base to repo name, otherwise root
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: isGitHubPages ? `/${repoName}/` : '/', 
})



// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react() ,     tailwindcss()], 
//    base: '/Kapsomoita-Church-Website/',
// })
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react() ,     tailwindcss()], 
//    base: '/',
// })








