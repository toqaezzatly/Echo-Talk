﻿# Directory Structure

- backend
  - src
    - controllers
      - auth.controller.js
      - message.controller.js
    - lib
      - cloudinary.js
      - db.js
      - socket.js
      - utils.js
    - middleware
      - auth.middleware.js
    - models
      - message.model.js
      - user.model.js
    - routes
      - auth.route.js
      - message.route.js
    - index.js
  - .env
  - package-lock.json
  - package.json
  - yarn.lock
- frontend
  - public
    - avatar.png
    - vite.svg
  - src
    - assets
      - react.svg
    - components
      - skeletons
        - MessageSkeleton.jsx
        - SidebarSkeleton.jsx
      - AuthImagePattern.jsx
      - ChatContainer.jsx
      - ChatHeader.jsx
      - MessageInput.jsx
      - Navbar.jsx
      - NoChatSelected.jsx
      - Sidebar.jsx
    - constants
      - index.js
    - lib
      - axios.js
      - utils.js
    - pages
      - HomePage.jsx
      - LoginPage.jsx
      - ProfilePage.jsx
      - SettingsPage.jsx
      - SignUpPage.jsx
    - store
      - useAuthStore.js
      - useChatStore.js
      - useThemeStore.js
    - App.css
    - App.jsx
    - index.css
    - main.jsx
  - eslint.config.js
  - index.html
  - package-lock.json
  - package.json
  - postcss.config.js
  - README.md
  - tailwind.config.js
  - vite.config.js
- .gitignore
- index.html
- pitch-1.html
- pitch.html
- Print-MindMap.ps1
- README.md
