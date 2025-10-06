# React Router v7 Splat Route Changes - Documentation

## What is a Splat Route?
A splat route uses `path="*"` to catch all unmatched routes:
```javascript
<Route path="*" element={<NotFound />} />
```

## v6 vs v7 Behavior Changes

### Current v6 Behavior (without flag):
- Relative paths in nested routes under splat routes resolve from the splat route's location
- Can lead to unexpected behavior with complex nested routing

### New v7 Behavior (with v7_relativeSplatPath flag):
- Relative paths resolve more predictably
- Better consistency with non-splat route behavior
- More intuitive for developers

## Your Application Impact

### Current Routes Analysis:
```javascript
// Your current splat route - SAFE ✅
<Route path="*" element={<Navigate to="/" replace />} />
```

**Impact Level: MINIMAL** 🟢
- Your splat route just redirects to home page
- No nested routing within the splat route
- No relative path navigation from the splat route
- **The flag change won't affect your app's behavior**

## Best Practices

### ✅ Safe Splat Route Patterns:
```javascript
// Simple redirect (your pattern) - Always safe
<Route path="*" element={<Navigate to="/" replace />} />

// Simple component render - Safe
<Route path="*" element={<NotFoundPage />} />
```

### ⚠️ Patterns That Need Attention:
```javascript
// Complex nested routing within splat - Review needed
<Route path="*" element={<DynamicLayout />}>
  <Route path="relative" element={<Component />} />
</Route>

// Relative navigation from splat route components - Review needed
function SplatComponent() {
  const navigate = useNavigate();
  // navigate("../relative") - behavior changes in v7
}
```

## Recommendation
Keep `v7_relativeSplatPath: true` enabled - it ensures your app works correctly with React Router v7 when it releases, and has no negative impact on your current routing setup.