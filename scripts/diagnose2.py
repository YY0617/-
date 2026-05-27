"""
Test both file:// and http://localhost protocols
"""
from playwright.sync_api import sync_playwright

def test_url(url, label, browser):
    page = browser.new_page(viewport={"width": 400, "height": 800})
    errors = []
    logs = []
    page.on("pageerror", lambda err: errors.append(str(err)[:200]))
    page.on("console", lambda msg: logs.append(f"[{msg.type}] {msg.text}"[:200]))

    try:
        page.goto(url, timeout=10000)
        page.wait_for_load_state("networkidle", timeout=10000)
        page.wait_for_timeout(2000)
        status = "LOADED"
    except Exception as e:
        status = f"TIMEOUT/ERROR: {str(e)[:100]}"

    title = page.title() or "NO TITLE"
    root = page.locator("#root")
    root_count = root.count()
    root_html = root.inner_html()[:200] if root_count > 0 else "EMPTY"
    body_text = page.locator("body").inner_text()[:300] if page.locator("body").count() > 0 else ""

    print(f"\n=== {label} ===")
    print(f"URL: {url}")
    print(f"Status: {status}")
    print(f"Title: {title}")
    print(f"Root elements: {root_count}")
    print(f"Root HTML: {root_html}")
    print(f"Body text: {body_text}")
    print(f"Errors ({len(errors)}):")
    for e in errors[:5]:
        print(f"  {e}")
    print(f"Critical logs:")
    for l in logs[-10:]:
        print(f"  {l}")

    page.close()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # Test 1: file:// protocol (what user likely does)
    test_url("file:///e:/游戏/tap-tap-mini/dist-taptap/index.html", "FILE protocol", browser)
    
    # Test 2: http://localhost:8080 (preview server)
    test_url("http://localhost:8080/", "HTTP preview server", browser)
    
    # Test 3: dev server  
    test_url("http://localhost:5173/", "DEV server", browser)

    browser.close()