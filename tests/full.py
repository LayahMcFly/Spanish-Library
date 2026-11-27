import asyncio, json
from playwright.async_api import async_playwright
BASE='http://localhost:8765/index.html'
fails=[]
def check(name, cond, extra=''):
    print(('PASS ' if cond else 'FAIL ')+name+(' '+str(extra) if extra and not cond else ''))
    if not cond: fails.append(name)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width':412,'height':880}, device_scale_factor=2, has_touch=True, is_mobile=True)
        pg = await ctx.new_page()
        errs=[]; reqs=[]
        pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        pg.on('pageerror', lambda e: errs.append('PAGEERROR '+str(e)))
        pg.on('request', lambda r: reqs.append(r.url))
        await pg.goto(BASE); await pg.wait_for_timeout(1200)
        # fonts
        fonts = await pg.evaluate("Promise.all(['600 20px \"Cormorant Garamond\"','400 20px Lora','400 16px \"Atkinson Hyperlegible\"','700 20px \"Dancing Script\"'].map(f=>document.fonts.load(f).then(r=>r.length)))")
        check('local fonts load', all(n>0 for n in fonts), fonts)
        # open book
        await pg.click('.bcard .btn'); await pg.wait_for_timeout(400)
        check('book page chapters', await pg.locator('.chap').count()==12, await pg.locator('.chap').count())
        check('ch2 locked', await pg.locator('.chap.lock').count()==11)
        await pg.click('.btn.primary.big'); await pg.wait_for_timeout(600)
        check('reader page', await pg.locator('.sent').count()>=5)
        await pg.screenshot(path='shots/reader_mobile.png')
        # word tap
        reina = pg.locator('.w[data-w="reina"]').first
        await reina.tap(); await pg.wait_for_timeout(500)
        txt = await pg.inner_text('#sheet')
        check('word sheet shows English+POS', 'queen' in txt and 'Noun' in txt, txt[:200])
        await pg.screenshot(path='shots/word_sheet.png')
        await pg.click('[data-act=saveWord]'); await pg.wait_for_timeout(300)
        saved = await pg.evaluate("ST.words['reina'] && ST.words['reina'].saved")
        check('save word', saved is True)
        check('word highlighted blue', await pg.locator('.w[data-w="reina"].hl-saved').count()>0)
        # sentence selection: tap ✦ on the sentence containing "reina"
        sent = pg.locator('.sent', has=pg.locator('.w[data-w="despertó"]')) if False else pg.locator(".sent").nth(5)
        sid = await sent.get_attribute('data-id')
        es = await pg.evaluate("id=>SENT_BY_ID[id].es", sid)
        await sent.locator('.sbtn').tap(); await pg.wait_for_timeout(400)
        selected = await pg.evaluate("[...document.querySelectorAll('.sent.sel')].map(e=>e.querySelector('.es').textContent.replace('✦','').trim())")
        check('exactly one sentence selected', len(selected)==1, selected)
        check('full sentence incl punctuation', selected and selected[0]==es, (selected, es))
        check('sentence sheet translation', (await pg.inner_text('#sheet')).find(await pg.evaluate("id=>SENT_BY_ID[id].en", sid))>=0)
        await pg.click('.simple summary'); await pg.wait_for_timeout(200)
        check('word breakdown rows', await pg.locator('.bdrow').count()>=3)
        await pg.screenshot(path='shots/sentence_sheet.png')
        await pg.click('#sheet .x'); await pg.wait_for_timeout(400)
        # accented word + punctuation sentence: tap 'despertó'
        dw = pg.locator('.w[data-w="despertó"]')
        if await dw.count(): 
            await dw.first.tap(); await pg.wait_for_timeout(300)
            t=await pg.inner_text('#sheet'); check('despertó -> despertar / woke up', 'despertar' in t and 'woke up' in t, t[:300])
            await pg.click('#sheet .x')
        # bookmark
        await pg.click('.ribbon'); await pg.wait_for_timeout(300)
        check('bookmark saved', await pg.evaluate("ST.bookmarks.length")==1)
        # mode switching: learning hides English
        await pg.evaluate("S.mode='learning';saveSettings();Reader.redraw()")
        check('learning hides english', await pg.locator('.sent .en.show').count()==0)
        await pg.evaluate("S.mode='beginner';saveSettings();Reader.redraw()")
        # page through to end
        n=0
        while await pg.locator('.endcard').count()==0 and n<30:
            await pg.click('[data-act=nextPage]'); await pg.wait_for_timeout(120); n+=1
        check('reached end card', await pg.locator('.endcard').count()==1, n)
        await pg.screenshot(path='shots/endcard.png')
        # chapter lock: ch2 inaccessible until quiz
        await pg.goto(BASE+'#/read/rosas/1/0'); await pg.wait_for_timeout(500)
        check('locked chapter redirects', 'book/rosas' in pg.url, pg.url)
        # quiz: answer every question correctly using the data
        await pg.goto(BASE+'#/quiz/rosas/0'); await pg.wait_for_timeout(500)
        qs = await pg.evaluate("Quiz && 1") if False else None
        steps=0
        while await pg.locator('.results').count()==0 and steps<30:
            steps+=1
            kind = await pg.locator('.kind').inner_text()
            if await pg.locator('.opt.m').count():
                # match
                pairs = await pg.evaluate("""()=>{const q=BOOKS[0].chapters[0].quiz.find(x=>x.k==='match');return q.pairs}""")
                for es_,en_ in pairs:
                    await pg.locator('#mL .opt', has_text=es_).first.click()
                    await pg.locator('#mR .opt', has_text=en_).first.click()
            elif await pg.locator('.opt').count():
                # find correct option by asking data
                q = await pg.locator('.qq').inner_text()
                ans = await pg.evaluate("""q=>{const c=BOOKS[0].chapters[0].quiz.find(x=>x.q===q);return c?c.o[0]:null}""", q)
                await pg.locator('.opt', has_text=ans).first.click()
            elif await pg.locator('textarea#ans').count():
                await pg.fill('#ans','El rey y la reina vivían en el castillo'); await pg.click('[data-act=check]')
            else:
                q = await pg.locator('.prompt').inner_text()
                ans = await pg.evaluate("""q=>{const c=BOOKS[0].chapters[0].quiz.find(x=>x.q===q);return c?c.a[0]:null}""", q)
                await pg.fill('#ans', ans); await pg.click('[data-act=check]')
            await pg.wait_for_timeout(150)
            if await pg.locator('.fb').count(): 
                if steps==3: await pg.screenshot(path='shots/quiz_feedback.png')
                await pg.click('[data-act=qNext]'); await pg.wait_for_timeout(150)
        check('quiz results shown', await pg.locator('.results').count()==1, steps)
        txt = await pg.inner_text('.results')
        check('perfect score 100%', '100%' in txt, txt[:200])
        await pg.screenshot(path='shots/quiz_results.png')
        ch = await pg.evaluate("ST.progress.rosas.chapters[0]")
        check('chapter marked done', ch and ch.get('done') is True, ch)
        await pg.goto(BASE+'#/read/rosas/1/0'); await pg.wait_for_timeout(500)
        check('ch2 now unlocked', '/read/rosas/1/0' in pg.url, pg.url)
        # wrong answer path -> mistakes
        await pg.goto(BASE+'#/quiz/rosas/1'); await pg.wait_for_timeout(400)
        q = await pg.locator('.qq').inner_text()
        right = await pg.evaluate("""q=>BOOKS[0].chapters[1].quiz.find(x=>x.q===q).o[0]""", q)
        opts = await pg.locator('.opt').all_inner_texts()
        wrong = [o for o in opts if o!=right][0]
        await pg.locator('.opt', has_text=wrong).first.click(); await pg.wait_for_timeout(200)
        fb = await pg.inner_text('.fb')
        check('wrong answer feedback explains', 'correct answer' in fb.lower() and 'From the story' in fb, fb[:200])
        check('mistake recorded', await pg.evaluate("ST.mistakes.length")==1)
        await pg.screenshot(path='shots/quiz_wrong.png')
        # tutor
        await pg.goto(BASE+'#/tutor'); await pg.wait_for_timeout(400)
        await pg.fill('#tsent','La reina abrió las puertas del castillo.'); await pg.click('[data-act=tExplain]'); await pg.wait_for_timeout(300)
        t = await pg.inner_text('#texp')
        check('tutor explains', 'queen' in t.lower() and 'Word by word' in t and 'abrir' in t, t[:300])
        await pg.click('[data-act=tutTab][data-t=verbs]'); await pg.fill('#vinp','hablar'); await pg.click('[data-act=vGo]')
        t = await pg.inner_text('#vout')
        check('hablar conjugation', 'hablo' in t and 'hablaron' in t and 'hablaré' in t and 'hablaba' in t, t[:300])
        await pg.fill('#vinp','dormir'); await pg.click('[data-act=vGo]'); t = await pg.inner_text('#vout')
        check('dormir stem change', 'duermo' in t and 'durmió' in t, t[:400])
        await pg.fill('#vinp','empezar'); await pg.click('[data-act=vGo]'); t = await pg.inner_text('#vout'); check('empezar empecé', 'empecé' in t and 'empiezo' in t)
        await pg.click('[data-act=tutTab][data-t=write]'); await pg.fill('#wtxt','el casa es grande\nyo es feliz'); await pg.click('[data-act=wCheck]')
        t = await pg.inner_text('#wout'); check('writing check finds issues', 'feminine' in t and 'capital' in t, t[:400])
        await pg.screenshot(path='shots/tutor_write.png')
        await pg.click('[data-act=tutTab][data-t=grammar]'); check('grammar topics', await pg.locator('.gtopic').count()>=15)
        # notebook
        await pg.goto(BASE+'#/notebook'); await pg.wait_for_timeout(300)
        check('notebook lists saved word', await pg.locator('.wcard').count()==1)
        await pg.click('.wmain'); t=await pg.inner_text('.wmore'); check('notebook detail has example+story', 'Example' in t and 'Found in' in t, t[:200])
        await pg.click('[data-act=nbReview]'); await pg.wait_for_timeout(300)
        check('vocab review quiz opens', await pg.locator('.qcard').count()==1)
        # progress
        await pg.goto(BASE+'#/progress'); await pg.wait_for_timeout(300)
        t = await pg.inner_text('.tiles'); check('progress tiles', 'Books started' in t and 'Quiz average' in t, t)
        await pg.screenshot(path='shots/progress.png')
        # library after progress: continue reading
        await pg.goto(BASE+'#/library'); await pg.wait_for_timeout(300)
        check('continue reading shown', await pg.locator('.hero').count()==1)
        await pg.click('[data-act=libTab][data-t=marks]'); check('bookmarks listed', await pg.locator('.bm').count()==1)
        await pg.click('[data-act=libTab][data-t=shelf]')
        await pg.fill('#libq','molino'); await pg.wait_for_timeout(200); check('search filters', await pg.locator('.bcard').count()==1)
        await pg.fill('#libq',''); await pg.click('[data-act=libLevel][data-l=C2]'); check('C2 level shows Ismael', 'Ismael' in await pg.inner_text('.library')); await pg.click('[data-act=libLevel][data-l=all]'); await pg.fill('#libq','zzzz'); check('no-match message', 'No stories match' in await pg.inner_text('.library')); await pg.fill('#libq',''); check('12 books on shelf', await pg.locator('.bcard').count() == 12)
        await pg.click('[data-act=libLevel][data-l=all]')
        # persistence across reload (IndexedDB)
        await pg.evaluate("save(true)"); await pg.wait_for_timeout(400)
        await pg.evaluate("localStorage.removeItem('sl.state')")   # force IndexedDB path
        await pg.reload(); await pg.wait_for_timeout(1000)
        st = await pg.evaluate("({w:Object.keys(ST.words).length,b:ST.bookmarks.length,c:!!ST.progress.rosas.chapters[0].done})")
        check('state restored from IndexedDB', st['w']>=1 and st['b']==1 and st['c'], st)
        # settings
        await pg.goto(BASE+'#/settings'); await pg.wait_for_timeout(300)
        await pg.evaluate("document.querySelector('[data-set=anim]').click()"); await pg.wait_for_timeout(100)
        check('animations off class', await pg.evaluate("document.body.classList.contains('noanim')"))
        await pg.evaluate("document.querySelector('[data-set=anim]').click()")
        await pg.click('[data-act=setSeg][data-k=theme][data-v=dark]'); await pg.wait_for_timeout(200)
        check('dark theme', await pg.evaluate("document.documentElement.dataset.theme")=='dark')
        await pg.screenshot(path='shots/settings_dark.png')
        await pg.click('[data-act=setSeg][data-k=theme][data-v=light]')
        # export
        async with pg.expect_download() as d: await pg.click('[data-act=exportData]')
        dl = await d.value; path = await dl.path(); data=json.load(open(path))
        check('export has state', 'state' in data and data['state']['bookmarks'])
        # error box copy
        await pg.evaluate("showError(new Error('test boom'))"); check('error box visible & copyable', await pg.locator('#errBox:not([hidden])').count()==1 and 'test boom' in await pg.input_value('#errText'))
        await pg.click('[data-act=closeErr]')
        check('footer version', 'v1.1.0' in await pg.inner_text('.foot'))
        check('no console errors', not errs, errs)
        bad=[r for r in reqs if 'localhost' not in r and not r.startswith('data:')]
        check('no external requests', not bad, bad)
        await b.close()
    print('\nFAILED:', fails if fails else 'none')
asyncio.run(main())
