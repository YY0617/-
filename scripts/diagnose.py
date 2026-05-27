"""
Deep diagnostic script for TapTap mini-game
"""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 400, "height": 800})

    errors = []
    logs = []
    page.on("pageerror", lambda err: errors.append(str(err)))
    page.on("console", lambda msg: logs.append(f"[{msg.type}] {msg.text}"))

    try:
        page.goto("http://localhost:5173/", timeout=15000)
        page.wait_for_load_state("networkidle", timeout=15000)
        page.wait_for_timeout(3000)
    except Exception as e:
        errors.append(f"Navigation: {str(e)}")

    title = page.title()
    root = page.locator("#root")
    root_exists = root.count() > 0
    root_html = root.inner_html()[:800] if root_exists else "MISSING"
    root_visible = root.is_visible() if root_exists else False
    body_text = page.locator("body").inner_text()[:500]

    page.screenshot(path="e:/游戏/tap-tap-mini/deep_debug.png")

    print("=== DIAGNOSTIC REPORT ===")
    print(f"Title: {title}")
    print(f"Root exists: {root_exists}")
    print(f"Root visible: {root_visible}")
    print(f"Root HTML (first 800): {root_html}")
    print(f"Body text (first 500): {body_text}")
    print(f"PAGE Errors ({len(errors)}):")
    for e in errors:
        print(f"  {e[:300]}")
    print(f"Console logs ({len(logs)}):")
    for l in logs[-20:]:
        print(f"  {l[:300]}")

    browser.close()