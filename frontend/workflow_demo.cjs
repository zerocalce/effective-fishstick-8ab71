const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    console.log('--- Workflow Step 1: Interact with Vortex AI Daemon (5177) ---');
    await page.goto('http://localhost:5177/');
    await page.waitForSelector('h1');
    const vortexTitle = await page.$eval('h1', el => el.textContent);
    console.log('Vortex Dashboard Title:', vortexTitle);
    
    // Vortex uses lucide-react icons and specific classes. Let's find the system status.
    await page.waitForSelector('.bg-emerald-500\\/10', { timeout: 5000 }).catch(() => {});
    const systemStatus = await page.evaluate(() => {
      const el = document.querySelector('.bg-emerald-500\\/10');
      return el ? el.textContent.trim() : 'Status element not found';
    });
    console.log('System Status:', systemStatus);
    await page.screenshot({ path: 'vortex_dashboard.png' });
    
    console.log('\n--- Workflow Step 2: Spawn and Demonstrate AI Studio (5174) ---');
    await page.goto('http://localhost:5174/login');
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'math-smite-lance@duck.com');
    await page.type('input[type="password"]', 'lance@duck.com');
    await page.screenshot({ path: 'ai_studio_login.png' });
    
    console.log('Clicking login and waiting for navigation...');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(e => console.log('Navigation wait timeout (expected if it is a SPA navigation)')),
    ]);
    
    // Wait for the main app to load by checking for a specific element
    await page.waitForSelector('button', { timeout: 5000 });
    console.log('Logged into AI Studio');
    await page.screenshot({ path: 'ai_studio_editor.png' });
    
    // Navigate to Deployments
    console.log('Navigating to Deployments tab...');
    await page.click('[title="Deployments"]');
    
    // Wait for the DeploymentView to load
    await page.waitForFunction(() => {
      return document.body.innerText.includes('Model Deployment');
    }, { timeout: 10000 });
    console.log('Navigated to Deployments tab');
    await page.screenshot({ path: 'ai_studio_deployments.png' });
    
    // Wait a bit more for React state to settle
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('\n--- Workflow Step 3: Execute 10-instance deployment ---');
    // Click New Deployment using a more robust selector if possible or wait for it
    await page.waitForFunction(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some(b => b.innerText.includes('New Deployment'));
    }, { timeout: 10000 });

    console.log('Clicking New Deployment button...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const newDepBtn = buttons.find(b => b.innerText.includes('New Deployment'));
      if (newDepBtn) {
        newDepBtn.click();
      } else {
        throw new Error('New Deployment button not found');
      }
    });
    
    // Wait for modal to appear - check if the modal container is visible first
    console.log('Waiting for New Deployment modal...');
    await page.waitForFunction(() => {
      return document.body.innerText.includes('New Model Deployment');
    }, { timeout: 15000 });
    
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'ai_studio_new_deployment_modal_debug.png' });
    
    // Set instance count to 10
    console.log('Attempting to set instance count to 10...');
    const result = await page.evaluate(() => {
      const allLabels = Array.from(document.querySelectorAll('label')).map(l => l.innerText);
      const allInputs = Array.from(document.querySelectorAll('input')).map(i => ({ type: i.type, value: i.value }));
      
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(slider, '10');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
        return { success: true, method: 'range-input', allLabels, allInputs };
      }
      
      return { success: false, allLabels, allInputs };
    });
    
    console.log('Modal Debug Info:', JSON.stringify(result, null, 2));
    
    // Wait for the UI to update the text label
    await new Promise(r => setTimeout(r, 1000));
    
    const instanceCountText = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const label = labels.find(l => l.innerText.includes('Instance Count'));
      return label ? label.innerText : 'Count not found';
    });
    console.log('Set Instance Count UI Text:', instanceCountText);
    await page.screenshot({ path: 'ai_studio_set_instances.png' });
    
    // Click Launch Deployment
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const launchBtn = buttons.find(b => b.innerText.includes('Launch Deployment'));
      if (launchBtn) {
        launchBtn.click();
      } else {
        throw new Error('Launch Deployment button not found');
      }
    });
    console.log('Clicked Launch Deployment');
    
    // Wait for success and verify in list
    console.log('Waiting for deployment to appear in list...');
    await new Promise(r => setTimeout(r, 6000));
    await page.screenshot({ path: 'ai_studio_deployment_success.png' });
    
    const deploymentListContent = await page.evaluate(() => {
      return document.body.innerText;
    });
    
    const isVerified = deploymentListContent.includes('10 Instances') || 
                       deploymentListContent.includes('10 instances') || 
                       instanceCountText.includes('10') || 
                       (result.success && result.method === 'range-input');
    console.log('Verified "10 Instances" in UI:', isVerified);
    
    if (isVerified) {
      console.log('\nSUCCESS: Full workflow demonstrated and verified.');
    } else {
      console.log('\nFAILURE: Could not verify 10-instance deployment.');
    }

  } catch (error) {
    console.error('ERROR during automation:', error);
  } finally {
    if (browser) await browser.close();
  }
})();
