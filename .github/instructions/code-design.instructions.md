---
description: "Use when creating or refactoring TypeScript, JavaScript, React, or Next.js code. Covers single responsibility, small functions, low coupling, and feature-oriented file organization."
applyTo: "**/*.{ts,tsx,js,jsx,mjs}"
---

# Code Design Guidelines

- Give each function, component, and module one job. If code is handling rendering, data shaping, and side effects together, split those concerns.
- Keep functions small and purpose-specific. If a function needs multiple logical phases or branches, extract helpers with descriptive names.
- Favor composition over monolithic components. Build larger behavior from smaller units that can be understood in isolation.
- Limit dependencies and pass narrow inputs. Avoid modules that reach through multiple layers or know too much about distant collaborators.
- Organize new files by feature boundary and responsibility. Keep route handlers, UI, and shared helpers separate once a file starts carrying multiple concerns.