---
'vitepress-plugin-npm-commands': patch
'vitepress-plugin-detype': patch
---

Pass a deep cloned copy of `env` to avoid mutating the original object. 
