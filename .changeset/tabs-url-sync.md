---
'vitepress-plugin-tabs': minor
---

Sync tabs with a `key:` shared state to URL query parameters. Sharing a link like `?ab=tab%20b` pre-selects the matching tab on load, and clicking a tab updates the URL via `history.replaceState` so the URL always reflects the visible tab.
