const { chromium } = require('playwright');

async function safeTechAnalysis() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔬 안전한 기술 스택 분석: https://www.noworrieskorea.com/');

    await page.goto('https://www.noworrieskorea.com/', { waitUntil: 'networkidle' });

    // 1. HTML 소스 기반 분석
    console.log('\n📄 HTML 소스 분석:');
    const htmlContent = await page.content();

    // 메타 태그에서 생성기 정보 추출
    const generatorMatch = htmlContent.match(/<meta\s+name="generator"\s+content="([^"]+)"/i);
    if (generatorMatch) {
      console.log(`  🏗️ 생성 도구: ${generatorMatch[1]}`);
    }

    // 2. 로드된 스크립트 분석
    console.log('\n📜 스크립트 분석:');
    const scripts = await page.locator('script[src]').evaluateAll(scripts =>
      scripts.map(script => ({
        src: script.src,
        async: script.async,
        defer: script.defer
      }))
    );

    const scriptAnalysis = {
      jquery: scripts.some(s => s.src.includes('jquery')),
      react: scripts.some(s => s.src.includes('react')),
      vue: scripts.some(s => s.src.includes('vue')),
      angular: scripts.some(s => s.src.includes('angular')),
      bootstrap: scripts.some(s => s.src.includes('bootstrap')),
      googleAnalytics: scripts.some(s => s.src.includes('google-analytics') || s.src.includes('gtag')),
      total: scripts.length
    };

    console.log(`  📊 총 스크립트: ${scriptAnalysis.total}개`);
    Object.entries(scriptAnalysis).forEach(([tech, detected]) => {
      if (tech !== 'total' && detected) {
        console.log(`  ✓ ${tech} 감지됨`);
      }
    });

    // 스크립트 소스 출력
    scripts.forEach((script, index) => {
      const url = new URL(script.src);
      console.log(`    ${index + 1}. ${url.pathname.split('/').pop() || url.hostname}`);
    });

    // 3. CSS 파일 분석
    console.log('\n🎨 CSS 분석:');
    const cssLinks = await page.locator('link[rel="stylesheet"]').evaluateAll(links =>
      links.map(link => link.href)
    );

    const cssFrameworks = [];
    cssLinks.forEach(href => {
      if (href.includes('bootstrap')) cssFrameworks.push('Bootstrap');
      if (href.includes('tailwind')) cssFrameworks.push('Tailwind CSS');
      if (href.includes('bulma')) cssFrameworks.push('Bulma');
      if (href.includes('fonts.googleapis.com')) cssFrameworks.push('Google Fonts');
    });

    console.log(`  📄 CSS 파일: ${cssLinks.length}개`);
    if (cssFrameworks.length > 0) {
      console.log('  🎯 감지된 프레임워크:');
      [...new Set(cssFrameworks)].forEach(framework => {
        console.log(`    ✓ ${framework}`);
      });
    }

    // 4. 메타 태그 종합 분석
    console.log('\n🔍 메타 정보:');
    const metaTags = await page.locator('meta').evaluateAll(metas =>
      metas.map(meta => ({
        name: meta.name,
        property: meta.property,
        content: meta.content,
        charset: meta.getAttribute('charset')
      })).filter(meta => meta.name || meta.property || meta.charset)
    );

    const viewport = metaTags.find(meta => meta.name === 'viewport')?.content;
    const description = metaTags.find(meta => meta.name === 'description')?.content;
    const charset = metaTags.find(meta => meta.charset)?.charset;

    console.log(`  📱 뷰포트: ${viewport || 'not set'}`);
    console.log(`  🔤 인코딩: ${charset || 'not specified'}`);
    console.log(`  📝 설명: ${description ? description.substring(0, 100) + '...' : 'not set'}`);

    // 오픈그래프 및 소셜 미디어 태그
    const ogTags = metaTags.filter(meta => meta.property && meta.property.startsWith('og:'));
    const twitterTags = metaTags.filter(meta => meta.name && meta.name.startsWith('twitter:'));

    console.log(`  📊 오픈그래프 태그: ${ogTags.length}개`);
    console.log(`  🐦 트위터 태그: ${twitterTags.length}개`);

    // 5. 이미지 분석
    console.log('\n🖼️ 이미지 분석:');
    const images = await page.locator('img').evaluateAll(imgs =>
      imgs.map(img => ({
        src: img.src,
        alt: img.alt,
        loading: img.loading,
        width: img.naturalWidth,
        height: img.naturalHeight
      }))
    );

    const imageFormats = {};
    images.forEach(img => {
      try {
        const ext = new URL(img.src).pathname.split('.').pop().toLowerCase();
        imageFormats[ext] = (imageFormats[ext] || 0) + 1;
      } catch (e) {}
    });

    console.log(`  📸 총 이미지: ${images.length}개`);
    Object.entries(imageFormats).forEach(([format, count]) => {
      console.log(`    ${format.toUpperCase()}: ${count}개`);
    });

    const lazyImages = images.filter(img => img.loading === 'lazy').length;
    console.log(`  ⚡ 지연 로딩: ${lazyImages}개`);

    // 6. 폼 분석
    console.log('\n📝 폼 분석:');
    const forms = await page.locator('form').evaluateAll(forms =>
      forms.map(form => ({
        method: form.method,
        action: form.action,
        inputs: Array.from(form.querySelectorAll('input')).length,
        textareas: Array.from(form.querySelectorAll('textarea')).length
      }))
    );

    console.log(`  📋 총 폼: ${forms.length}개`);
    forms.forEach((form, index) => {
      console.log(`    ${index + 1}. ${form.method.toUpperCase()} → ${form.action || 'same page'}`);
      console.log(`       입력필드: ${form.inputs}개, 텍스트영역: ${form.textareas}개`);
    });

    // 7. 보안 헤더 체크
    console.log('\n🔒 보안 분석:');
    const response = await page.goto('https://www.noworrieskorea.com/');
    const headers = response.headers();

    const securityHeaders = [
      'content-security-policy',
      'x-frame-options',
      'x-content-type-options',
      'strict-transport-security',
      'referrer-policy'
    ];

    securityHeaders.forEach(header => {
      const value = headers[header];
      console.log(`  ${header}: ${value || '❌ 없음'}`);
    });

    console.log(`  🔐 HTTPS: ${response.url().startsWith('https://') ? '✅' : '❌'}`);

  } catch (error) {
    console.error('❌ 분석 중 오류:', error);
  } finally {
    await browser.close();
  }
}

safeTechAnalysis();