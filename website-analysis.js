const { chromium } = require('playwright');

async function analyzeWebsite() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔍 Analyzing https://www.noworrieskorea.com/');

    // Navigate to the website
    await page.goto('https://www.noworrieskorea.com/', { waitUntil: 'networkidle' });

    // Basic page information
    const title = await page.title();
    const url = page.url();

    console.log('\n📄 기본 정보:');
    console.log(`제목: ${title}`);
    console.log(`URL: ${url}`);

    // Get page structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    console.log('\n📝 페이지 구조 (제목들):');
    headings.forEach((heading, index) => {
      console.log(`${index + 1}. ${heading.trim()}`);
    });

    // Get navigation links
    const navLinks = await page.locator('nav a, header a').evaluateAll(links =>
      links.map(link => ({
        text: link.textContent?.trim(),
        href: link.href
      })).filter(link => link.text && link.text.length > 0)
    );

    console.log('\n🧭 내비게이션 링크:');
    navLinks.forEach((link, index) => {
      console.log(`${index + 1}. ${link.text} -> ${link.href}`);
    });

    // Get main content sections
    const sections = await page.locator('section, main, article').count();
    console.log(`\n📱 콘텐츠 섹션 수: ${sections}`);

    // Check for forms
    const forms = await page.locator('form').count();
    console.log(`📝 폼 개수: ${forms}`);

    // Check for images
    const images = await page.locator('img').count();
    console.log(`🖼️ 이미지 개수: ${images}`);

    // Get meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    if (metaDescription) {
      console.log(`\n📋 메타 설명: ${metaDescription}`);
    }

    // Check for Korean content
    const bodyText = await page.locator('body').textContent();
    const hasKorean = /[가-힣]/.test(bodyText || '');
    console.log(`🇰🇷 한국어 콘텐츠: ${hasKorean ? '있음' : '없음'}`);

    // Performance metrics
    const performanceTiming = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart
      };
    });

    console.log('\n⚡ 성능 지표:');
    console.log(`DOM 로드 시간: ${performanceTiming.domContentLoaded}ms`);
    console.log(`전체 로드 시간: ${performanceTiming.loadComplete}ms`);

    // Check for common elements
    const commonElements = {
      '헤더': await page.locator('header').count(),
      '푸터': await page.locator('footer').count(),
      '버튼': await page.locator('button, input[type="button"], input[type="submit"]').count(),
      '링크': await page.locator('a').count(),
      '리스트': await page.locator('ul, ol').count()
    };

    console.log('\n🔧 페이지 요소:');
    Object.entries(commonElements).forEach(([element, count]) => {
      console.log(`${element}: ${count}개`);
    });

    // Screenshot
    await page.screenshot({ path: 'noworrieskorea-screenshot.png', fullPage: true });
    console.log('\n📸 스크린샷 저장됨: noworrieskorea-screenshot.png');

  } catch (error) {
    console.error('❌ 분석 중 오류 발생:', error);
  } finally {
    await browser.close();
  }
}

analyzeWebsite();