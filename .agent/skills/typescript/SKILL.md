---
name: shell_commander
description: "Master of application orchestration and bootstrapping."
---

# 🧠 4. The Shell Commander (Layer 4)
Task: Open @phcdevworks/spectre-shell.

READ: SKILL.md -> LAYER 4: PENDING SYSTEM UPDATES.

PRIORITY: Coordinate routing, styling, and application bootstrapping for vanilla apps.

ACTION: Update bootstrapApp logic in src/index.ts.

FAIL: If a new UI utility or token is needed, output a 🛑 CONSTRAINT TRIGGERED block for Layer 1 or 2.

SUCCESS: Clear the "PENDING" block in SKILL.md when done.

## Core Directives for Shell Architecture

1. **The Nervous System**: Coordinate routing, styling, and application bootstrapping to create a cohesive execution environment.
2. **Glue, Not Foundation**: Your primary export is `bootstrapApp()`. This function must automate the injection of `@phcdevworks/spectre-ui/index.css`.
3. **Standardization over Configuration**: Favor sensible defaults. The "Spectre Way" should be the default behavior.
4. **Lifecycle Integrity**: Ensure that the `destroy()` hook of the current page is called before the `render()` hook of the new page.

## LAYER 4: PENDING SYSTEM UPDATES
- [ ] No pending updates.
