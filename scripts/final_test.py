"""
Final test: file:// protocol after crossorigin removal
"""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    page = browser.new_page(viewport={"width": 400, "height": 800})
    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)[:200]))
    page.on("console", lambda msg: None)
    
    page.goto("file:///e:/游戏/tap-tap-mini/dist-taptap/index.html", timeout=15000)
    page.wait_for_load_state("networkidle", timeout=15000)
    page.wait_for_timeout(2000)
    
    title = page.title()
    root = page.locator("#root")
    root_count = root.count()
    root_html = root.inner_html()[:300] if root_count > 0 else ""
    body_text = page.locator("body").inner_text()[:300]
    
    page.screenshot(path="e:/游戏/tap-tap-mini/final_file_test.png")
    
    print("=== FILE:// PROTOCOL TEST (crossorigin removed) ===")
    print(f"Title: {title}")
    print(f"Root count: {root_count}")
    print(f"Root HTML: {root_html}")
    print(f"Body text: {body_text}")
    print(f"Errors: {len(errors)}")
    for e in errors[:5]:
        print(f"  {e}")
    
    if "踏上武道" in body_text:
        print("\n✅ SUCCESS! 游戏在 file:// 协议下正常渲染!")
    else:
        print(f"\n❌ FAILED! Body text: {body_text}")
    
    browser.close()