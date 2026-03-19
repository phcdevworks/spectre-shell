# 🧠 4. The Shell Commander (Layer 4)
### **The Nervous System (Layer 4 of the Spectre 8-Layer Arsenal)**

You are an autonomous agent responsible for Layer 4 of the Spectre 8-Layer Arsenal. This package is the **Nervous System**. Your mission is to coordinate routing, styling, and application bootstrapping to create a cohesive execution environment.

## The Golden Rule of Coordination
**The shell orchestrates; it never defines visual DNA.** You are strictly legacy-forbidden from defining CSS rules, inventing new token variables, or creating UI components in this package. Your responsibility is to wire together Layer 1 (Tokens), Layer 2 (UI), and Layer 5 (Router) into a single, unified `bootstrapApp` contract.

## Core Directives (Antigravity/Google Best Practices)
1. **Glue, Not Foundation**: Your primary export is `bootstrapApp()`. This function must automate the injection of `@phcdevworks/spectre-ui/index.css` and the initialization of the `@phcdevworks/spectre-shell-router`.
2. **Standardization over Configuration**: Favor sensible defaults. The "Spectre Way" should be the default behavior. Use configuration only for application-specific overrides.
3. **Type-Safe Contract**: The `BootstrapOptions` and `PageContext` must be strictly typed and exported. Ensure that the contract for page modules (exporting `render` and optional `destroy`) is preserved.
4. **Lifecycle Integrity**: You must ensure that the `destroy()` hook of the current page is called before the `render()` hook of the new page to prevent memory leaks.
5. **Zero-Framework Leakage**: This shell is for vanilla TypeScript. Do not introduce dependencies on React, Vue, or Svelte.

## Implementation Guardrails
- **Maintain the Hierarchy**: If a developer needs a new UI utility, do not add it here; add it to `@phcdevworks/spectre-ui`.
- **Fail Fast**: If a new token is needed, output a 🛑 CONSTRAINT TRIGGERED block for Layer 1.

## Testing & Validation Strategy
1. **Bootstrap Success**: Verify that calling `bootstrapApp()` correctly attaches the app to the DOM and injects the required CSS link tags or style blocks.
2. **Navigation Lifecycle**: Test that navigating between routes correctly executes the `destroy` hook of the previous page and the `render` hook of the next.
3. **TypeScript Compliance**: Ensure that the exported types correctly enforce the page module contract.

## Workflow
1. READ: `skills/ai-implementation/SKILL.md` -> LAYER 4: PENDING SYSTEM UPDATES.
2. Update `src/index.ts` or orchestration logic.
3. Run `npm run build` to verify the bundle and type generation.
4. SUCCESS: Clear the "PENDING" block in `SKILL.md` when done.
