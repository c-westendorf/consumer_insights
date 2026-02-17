# Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Error loading insights data. Please try again."

**Cause:** This happens when opening `story_arc.html` directly using `file://` protocol. Modern browsers block fetch requests from local files due to CORS security restrictions.

**Solutions:**

#### Solution 1: Use Local Server (Recommended)
```bash
cd consumer_insights/prototype
./serve.sh
```

Then open: `http://localhost:8000`

#### Solution 2: Manual Server Start
If `serve.sh` doesn't work:

**Python 3:**
```bash
cd consumer_insights/prototype
python3 -m http.server 8000
```

**Python 2:**
```bash
cd consumer_insights/prototype
python -m SimpleHTTPServer 8000
```

**Node.js:**
```bash
cd consumer_insights/prototype
npx http-server -p 8000
```

Then open your browser to: `http://localhost:8000`

#### Solution 3: Verify Data.js is Loaded
The prototype now includes `js/data.js` with embedded data. Check that:
1. File exists: `prototype/js/data.js`
2. It's loaded before other scripts in `story_arc.html`
3. Browser console shows no errors (F12 → Console tab)

---

### Issue: Waterfall Chart Not Displaying

**Cause:** Plotly.js not loading from CDN (internet connection required)

**Solution:**
1. Check internet connection
2. Wait a few seconds for CDN to load
3. Check browser console (F12) for errors
4. Try refreshing the page (Cmd+R or Ctrl+R)

**Offline Alternative:**
If you need offline access, download Plotly.js locally:
```bash
cd consumer_insights/prototype
curl -o plotly.min.js https://cdn.plot.ly/plotly-2.27.0.min.js
```

Then update `story_arc.html`:
```html
<!-- Replace CDN line with: -->
<script src="plotly.min.js"></script>
```

---

### Issue: Sparklines Not Showing

**Cause:** Canvas sparkline generation error

**Solution:**
1. Check browser console for errors
2. Verify `utils.js` is loaded
3. Try a different browser (Chrome recommended)

---

### Issue: Drill-Down Modal Not Opening

**Cause:** Click event not firing or modal JavaScript not loaded

**Solution:**
1. Verify `interactions.js` is loaded
2. Check browser console for errors
3. Ensure you're clicking on the colored bars, not the labels
4. Try clicking "PCW Customers" or "Reactivated" bars

**Debug in Console:**
```javascript
// Open browser console (F12) and type:
openDrillDown('PCW Customers')
```

---

### Issue: Styles Look Broken

**Cause:** CSS files not loading

**Solution:**
1. Verify all CSS files exist:
   - `css/main.css`
   - `css/choice_menu.css`
   - `css/story_arc.css`
2. Check file paths in HTML `<link>` tags
3. Clear browser cache: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
4. Try a different browser

---

### Issue: Page is Blank

**Cause:** JavaScript error preventing initialization

**Solution:**
1. Open browser console (F12 → Console tab)
2. Look for red error messages
3. Check that all JS files are loading:
   - `js/data.js`
   - `js/utils.js`
   - `js/narrative.js`
   - `js/visualizations.js`
   - `js/interactions.js`
4. Verify file paths are correct

**Quick Test:**
Open console and type:
```javascript
window.insightData
```
Should show the data object.

---

### Issue: Server Won't Start

**Cause:** Port 8000 already in use or Python not installed

**Solutions:**

**Check if port is in use:**
```bash
# macOS/Linux
lsof -i :8000

# Windows
netstat -ano | findstr :8000
```

**Use different port:**
```bash
python3 -m http.server 8001
# Then open: http://localhost:8001
```

**Check Python installation:**
```bash
python3 --version
# Should show Python 3.x.x

# If not installed, install Python 3
# macOS: brew install python3
# Windows: Download from python.org
# Linux: sudo apt-get install python3
```

---

### Issue: serve.sh Permission Denied

**Cause:** Script not executable

**Solution:**
```bash
chmod +x prototype/serve.sh
./serve.sh
```

---

### Issue: Browser Shows "Mixed Content" Warning

**Cause:** Using HTTPS page to load HTTP resources (shouldn't happen with this prototype)

**Solution:**
Ensure you're accessing via:
- `http://localhost:8000` (not https://)
- Or `file:///` protocol

---

## Browser-Specific Issues

### Chrome
- **Issue:** CORS errors with file://
- **Solution:** Use local server (Option 1)

### Safari
- **Issue:** Strict CORS policy
- **Solution:** Use local server (Option 1)
- **Alternative:** Enable "Disable local file restrictions" in Develop menu

### Firefox
- **Issue:** Slower Plotly rendering
- **Solution:** Try Chrome or wait a few extra seconds

### Edge
- **Issue:** Similar to Chrome
- **Solution:** Use local server (Option 1)

---

## Performance Issues

### Slow Page Load
1. Check internet connection (Plotly CDN)
2. Close other browser tabs
3. Disable browser extensions
4. Try Chrome for best performance

### Charts Rendering Slowly
1. Wait 2-3 seconds after page load
2. Plotly is loading from CDN
3. Once loaded, interactions are fast

### Modal Animation Lag
1. Close other applications
2. Try a different browser
3. Reduce browser zoom level

---

## Verification Checklist

Before reporting an issue, verify:

- [ ] Using local server (`./serve.sh` or `python3 -m http.server 8000`)
- [ ] Internet connection working (for Plotly CDN)
- [ ] Browser is up to date (Chrome 90+, Safari 14+, etc.)
- [ ] All files present in `prototype/` directory
- [ ] No errors in browser console (F12)
- [ ] Tried hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- [ ] Tried different browser

---

## Getting Help

If issues persist:

1. **Check browser console:**
   - Press F12 (or Cmd+Option+I on Mac)
   - Look at Console tab for errors
   - Take a screenshot

2. **Verify file structure:**
   ```bash
   cd consumer_insights/prototype
   ls -la
   ```
   Should show:
   - `index.html`
   - `story_arc.html`
   - `css/` (3 files)
   - `js/` (5 files)
   - `data/` (1 file)

3. **Test with minimal setup:**
   ```bash
   cd consumer_insights/prototype
   python3 -m http.server 8000
   ```
   Open: `http://localhost:8000`

4. **Review validation report:**
   - Check `VALIDATION_REPORT.md` for known issues

---

## Quick Fixes

**Reset Everything:**
```bash
# Re-download or re-generate prototype
# Or pull fresh copy from repository
```

**Clear Browser Cache:**
- Chrome: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
- Safari: Cmd+Option+E
- Firefox: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)

**Try Incognito/Private Mode:**
- Chrome: Cmd+Shift+N (Mac) or Ctrl+Shift+N (Windows)
- Safari: Cmd+Shift+N
- Firefox: Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)

This eliminates cache and extension issues.

---

**Most Common Solution:** Use the local server! 99% of issues are resolved by running:
```bash
cd consumer_insights/prototype
./serve.sh
```

Then opening: `http://localhost:8000`
