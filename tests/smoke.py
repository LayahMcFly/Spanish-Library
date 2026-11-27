import asyncio, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width':412,'height':880}, device_scale_factor=2, has_touch=True, is_mobile=True)
        pg = await ctx.new_page()
        errs=[]; reqs=[]
        pg.on('console', lambda m: errs.append(f'{m.type}: {m.text}') if m.type in ('error','warning') else None)
        pg.on('pageerror', lambda e: errs.append('PAGEERROR '+str(e)))
        pg.on('request', lambda r: reqs.append(r.url))
        await pg.goto('http://localhost:8765/index.html')
        await pg.wait_for_timeout(1500)
        print('title', await pg.title())
        print('books', await pg.locator('.bcard').count())
        print('errors', errs)
        print('external', [r for r in reqs if 'localhost' not in r and not r.startswith('data:')])
        await pg.screenshot(path='shots/lib_mobile.png')
        await b.close()
asyncio.run(main())
