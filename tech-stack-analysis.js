const { chromium } = require('playwright');

async function analyzeTechStack() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔬 기술 스택 분석: https://www.noworrieskorea.com/');

    await page.goto('https://www.noworrieskorea.com/', { waitUntil: 'networkidle' });

    // 1. JavaScript 라이브러리 및 프레임워크 검출
    console.log('\n📚 JavaScript 라이브러리 & 프레임워크:');
    const jsLibraries = await page.evaluate(() => {
      const libraries = {};

      // jQuery 체크
      if (typeof window.$ !== 'undefined' || typeof window.jQuery !== 'undefined') {
        libraries.jQuery = window.jQuery ? window.jQuery.fn.jquery : 'detected';
      }

      // React 체크
      if (typeof window.React !== 'undefined') {
        libraries.React = window.React.version || 'detected';
      }

      // Vue 체크
      if (typeof window.Vue !== 'undefined') {
        libraries.Vue = window.Vue.version || 'detected';
      }

      // Angular 체크
      if (typeof window.ng !== 'undefined' || typeof window.angular !== 'undefined') {
        libraries.Angular = 'detected';
      }

      // Bootstrap 체크
      if (typeof window.bootstrap !== 'undefined') {
        libraries.Bootstrap = 'detected';
      }

      // 기타 글로벌 객체들 체크
      const globalObjects = Object.keys(window).filter(key =>
        !['chrome', 'webkitStorageInfo', 'webkitIndexedDB'].includes(key) &&
        typeof window[key] === 'object' &&
        window[key] &&
        window[key].constructor &&
        window[key].constructor.name !== 'Object' &&
        !key.startsWith('webkit') &&
        !key.startsWith('moz') &&
        !key.startsWith('ms') &&
        key.length > 2
      );

      return { libraries, globalObjects };
    });

    Object.entries(jsLibraries.libraries).forEach(([lib, version]) => {
      console.log(`  ✓ ${lib}: ${version}`);
    });

    // 2. CSS 프레임워크 및 스타일 분석
    console.log('\n🎨 CSS 프레임워크 & 스타일:');
    const cssInfo = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      const cssFrameworks = [];
      const cssFiles = [];

      stylesheets.forEach(sheet => {
        try {
          if (sheet.href) {
            cssFiles.push(sheet.href);
            const href = sheet.href.toLowerCase();
            if (href.includes('bootstrap')) cssFrameworks.push('Bootstrap');
            if (href.includes('tailwind')) cssFrameworks.push('Tailwind CSS');
            if (href.includes('bulma')) cssFrameworks.push('Bulma');
            if (href.includes('foundation')) cssFrameworks.push('Foundation');
            if (href.includes('materialize')) cssFrameworks.push('Materialize');
          }
        } catch (e) {}
      });

      return { cssFrameworks: [...new Set(cssFrameworks)], cssFiles };
    });

    if (cssInfo.cssFrameworks.length > 0) {
      cssInfo.cssFrameworks.forEach(framework => {
        console.log(`  ✓ ${framework}`);
      });
    }

    console.log(`  📄 CSS 파일 수: ${cssInfo.cssFiles.length}`);
    cssInfo.cssFiles.forEach((file, index) => {
      console.log(`    ${index + 1}. ${file.split('/').pop()}`);
    });

    // 3. 메타 태그 및 SEO 분석
    console.log('\n🔍 SEO & 메타 정보:');
    const metaInfo = await page.evaluate(() => {
      const metas = {};
      document.querySelectorAll('meta').forEach(meta => {
        if (meta.name) metas[meta.name] = meta.content;
        if (meta.property) metas[meta.property] = meta.content;
      });

      return {
        metas,
        generator: document.querySelector('meta[name="generator"]')?.content,
        viewport: document.querySelector('meta[name="viewport"]')?.content,
        charset: document.querySelector('meta[charset]')?.getAttribute('charset'),
        ogTags: Object.keys(metas).filter(key => key.startsWith('og:')),
        twitterTags: Object.keys(metas).filter(key => key.startsWith('twitter:'))
      };
    });

    if (metaInfo.generator) {
      console.log(`  🏗️ 생성 도구: ${metaInfo.generator}`);
    }
    console.log(`  📱 뷰포트: ${metaInfo.viewport || 'not set'}`);
    console.log(`  🔤 인코딩: ${metaInfo.charset || 'not specified'}`);
    console.log(`  📊 오픈그래프 태그: ${metaInfo.ogTags.length}개`);
    console.log(`  🐦 트위터 카드: ${metaInfo.twitterTags.length}개`);

    // 4. 스크립트 소스 분석
    console.log('\n📜 로드된 스크립트:');
    const scripts = await page.locator('script[src]').evaluateAll(scripts =>
      scripts.map(script => script.src).filter(src => src)
    );

    const scriptAnalysis = {
      analytics: scripts.filter(src =>
        src.includes('google-analytics') ||
        src.includes('gtag') ||
        src.includes('gtm') ||
        src.includes('analytics')
      ),
      external: scripts.filter(src =>
        !src.includes(new URL(page.url()).hostname)
      ),
      total: scripts.length
    };

    console.log(`  📊 총 스크립트: ${scriptAnalysis.total}개`);
    console.log(`  🌐 외부 스크립트: ${scriptAnalysis.external.length}개`);
    console.log(`  📈 분석 도구: ${scriptAnalysis.analytics.length}개`);

    // 5. 폰트 분석
    console.log('\n🔤 웹 폰트:');
    const fonts = await page.evaluate(() => {
      const fontFaces = [];
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

      links.forEach(link => {
        if (link.href.includes('fonts.googleapis.com') || link.href.includes('fonts.gstatic.com')) {
          fontFaces.push('Google Fonts');
        }
        if (link.href.includes('typekit') || link.href.includes('adobe')) {
          fontFaces.push('Adobe Fonts');
        }
      });

      return [...new Set(fontFaces)];
    });

    if (fonts.length > 0) {
      fonts.forEach(font => console.log(`  ✓ ${font}`));
    } else {
      console.log('  ❌ 외부 웹폰트 감지되지 않음');
    }

    // 6. 네트워크 요청 분석 (리소스 타입별)
    const resourceTypes = {};
    page.on('response', response => {
      const type = response.request().resourceType();
      resourceTypes[type] = (resourceTypes[type] || 0) + 1;
    });

    // 새로고침하여 네트워크 요청 캡처
    await page.reload({ waitUntil: 'networkidle' });

    console.log('\n🌐 네트워크 리소스:');
    Object.entries(resourceTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}개`);
    });

    // 7. 기술 스택 추정
    console.log('\n🔮 기술 스택 추정:');

    const techStackGuess = await page.evaluate(() => {
      const indicators = [];

      // CMS 감지
      if (document.querySelector('meta[name="generator"]')) {
        const generator = document.querySelector('meta[name="generator"]').content;
        if (generator.includes('WordPress')) indicators.push('CMS: WordPress');
        if (generator.includes('Wix')) indicators.push('CMS: Wix');
        if (generator.includes('Squarespace')) indicators.push('CMS: Squarespace');
        if (generator.includes('Shopify')) indicators.push('CMS: Shopify');
      }

      // 빌더 도구 감지
      if (document.querySelector('[class*="elementor"]') || document.querySelector('[id*="elementor"]')) {
        indicators.push('Page Builder: Elementor');
      }

      if (document.querySelector('[class*="divi"]')) {
        indicators.push('Theme: Divi');
      }

      // 기타 기술 감지
      const bodyClasses = document.body.className;
      if (bodyClasses.includes('wp-')) {
        indicators.push('CMS: WordPress (detected from body classes)');
      }

      return indicators;
    });

    if (techStackGuess.length > 0) {
      techStackGuess.forEach(tech => console.log(`  🎯 ${tech}`));
    } else {
      console.log('  ❓ 명확한 CMS/프레임워크 감지되지 않음');
    }

  } catch (error) {
    console.error('❌ 기술 스택 분석 중 오류:', error);
  } finally {
    await browser.close();
  }
}

analyzeTechStack();