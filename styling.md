# Fixing Tailwind CSS Styling Issues 

## Common Issue: Styles Not Loading / Grey Appearance

When the application appears completely grey with no styling applied, it's typically due to Tailwind CSS not being processed correctly. This is a common issue with Next.js hot reload and Tailwind CSS v4.

## Symptoms

- All pages appear grey/unstyled
- No Tailwind utility classes are applied
- Layout appears broken
- Components lack proper styling
- Error: "Cannot apply unknown utility class"

## Root Causes

1. **Tailwind CSS v4 Configuration Issues**
   - CSS variables not properly defined
   - `@apply` directives failing with Tailwind v4
   - PostCSS not processing styles correctly

2. **Next.js Hot Reload Problems**
   - Cache corruption during development
   - Module resolution errors (especially with Turbopack)
   - Stale build artifacts

3. **Development Server Issues**
   - Multiple Node processes running
   - Port conflicts
   - Incomplete module reloads

## Quick Fix Steps

### Step 1: Kill All Node Processes
```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
killall node
```

### Step 2: Clear Next.js Cache
```bash
# Windows
rmdir /s /q .next

# Mac/Linux
rm -rf .next
```

### Step 3: Restart Development Server
```bash
pnpm dev
# or
npm run dev
```

## Permanent Fixes Applied

### 1. Fixed Tailwind CSS v4 Configuration

**Problem**: `@apply` directives not working with CSS variables

**Solution in `src/styles/globals.css`**:
```css
/* Instead of this (breaks in Tailwind v4): */
@layer base {
  * {
    @apply border-border;
  }
}

/* Use this: */
@layer base {
  * {
    border-color: hsl(var(--border));
  }
}
```

### 2. Proper CSS Variable Structure
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  /* ... other variables ... */
}

@theme {
  /* Map CSS variables to Tailwind utilities */
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  /* ... other mappings ... */
}
```

### 3. Disabled Turbopack
**In `package.json`**:
```json
{
  "scripts": {
    "dev": "next dev",  // Removed --turbo flag
  }
}
```

## Prevention Tips

1. **Always restart dev server after major CSS changes**
2. **Clear cache when styles seem stuck**
3. **Check browser console for CSS-related errors**
4. **Ensure all CSS imports are at the top of files**
5. **Verify Tailwind content paths in config**

## Debugging Checklist

- [ ] Check if `globals.css` is imported in `layout.tsx`
- [ ] Verify Tailwind config file exists and is valid
- [ ] Ensure PostCSS config is correct
- [ ] Check for conflicting CSS imports
- [ ] Verify no syntax errors in CSS files
- [ ] Confirm Node modules are installed (`pnpm install`)

## Emergency Recovery

If styles are completely broken and won't recover:

1. **Full Reset**:
   ```bash
   # Stop all processes
   taskkill /F /IM node.exe
   
   # Clear all caches
   rmdir /s /q .next
   rmdir /s /q node_modules/.cache
   
   # Reinstall dependencies
   pnpm install
   
   # Start fresh
   pnpm dev
   ```

2. **Check Git for Changes**:
   ```bash
   git status
   git diff src/styles/globals.css
   ```

## Notes for Future Development

- Tailwind CSS v4 has breaking changes from v3
- Hot reload can be flaky with complex CSS setups
- Always test styling changes in a fresh browser tab
- Consider using `pnpm build && pnpm start` for production-like testing

## Related Files

- `/src/styles/globals.css` - Main CSS file
- `/tailwind.config.js` - Tailwind configuration
- `/postcss.config.js` - PostCSS configuration
- `/src/app/layout.tsx` - Where globals.css is imported
