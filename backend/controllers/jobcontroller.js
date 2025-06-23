const puppeteer = require('puppeteer');
const Job = require('../models/Job');

const scrapingProfiles = {
  'linkedin.com': { descriptionSelectors: ['.show-more-less-html__markup'], clickExpandSelector: 'button.show-more-less-html__button', extraWait: 3000 },
  'indeed.com': { descriptionSelectors: ['#jobDescriptionText'] },
  'glassdoor.com': { descriptionSelectors: ['[data-test="jobDescription"]'] },
  'workday.com': { descriptionSelectors: ['[data-automation-id="jobPostingDescription"]'], clickExpandSelector: '[data-automation-id="moreJobDetails"]', extraWait: 5000 },
  'eightfold.ai': { descriptionSelectors: ['.job-description-container', '.job-description-section', '.description-content', '[data-testid="job-description"]', '.job-posting-description'], clickExpandSelector: 'button[aria-label="Show more"]', extraWait: 8000 },
  'default': { descriptionSelectors: ['.job-description', '.description', '.content', 'main', 'section', 'article', '.job-details', '.responsibilities', '.requirements'] }
};

const formatDescription = (html) => {
  if (!html || html === 'Description Not Found') return html;
  return html.replace(/<li>/g, '\n• ').replace(/<\/li>/g, '').replace(/<br\s*\/?>/gi, '\n').replace(/<p>/gi, '\n\n').replace(/<[^>]*>/g, '').replace(/\s+\n/g, '\n').replace(/\n{2,}/g, '\n\n').replace(/ +/g, ' ').trim();
};

const formatStructuredDescription = (description) => {
  let text = '', html = '<div class="job-description">';
  
  if (description.aboutRole) {
    text += `About the Role:\n${description.aboutRole}\n\n`;
    html += `<h3>About the Role</h3><p>${description.aboutRole}</p>`;
  }
  
  if (description.responsibilities) {
    text += 'Responsibilities:\n';
    html += '<h3>Responsibilities</h3><ul>';
    description.responsibilities.forEach(item => {
      text += `• ${item}\n`;
      html += `<li>${item}</li>`;
    });
    text += '\n';
    html += '</ul>';
  }
  
  if (description.requirements) {
    text += 'Requirements:\n';
    html += '<h3>Requirements</h3>';
    if (description.requirements.experience) {
      text += `Experience: ${description.requirements.experience}\n`;
      html += `<p><strong>Experience:</strong> ${description.requirements.experience}</p>`;
    }
    if (description.requirements.skills) {
      text += 'Skills:\n';
      html += '<ul>';
      description.requirements.skills.forEach(skill => {
        text += `• ${skill}\n`;
        html += `<li>${skill}</li>`;
      });
      html += '</ul>';
    }
    text += '\n';
  }
  
  if (description.benefits) {
    text += 'Benefits:\n';
    html += '<h3>Benefits</h3><ul>';
    description.benefits.forEach(benefit => {
      text += `• ${benefit}\n`;
      html += `<li>${benefit}</li>`;
    });
    html += '</ul>';
  }
  
  html += '</div>';
  return { text: text.trim(), html };
};

const processJob = async (req, res) => {
  const { url, title, company, location, jobType, experience, description, descriptionHtml } = req.body;

  if (!title || !company) {
    return res.status(400).json({ message: 'Title and company are required' });
  }

  try {
    let finalDescriptionHtml = '';
    let finalDescription = '';

    // Handle structured description object first
    if (typeof description === 'object' && description !== null) {
      const formatted = formatStructuredDescription(description);
      finalDescription = formatted.text;
      finalDescriptionHtml = formatted.html;
    } else if (url) {
      // Try scraping if URL is provided
      try {
        const hostname = new URL(url).hostname;
        const profile = Object.entries(scrapingProfiles).find(([site]) => hostname.includes(site))?.[1] || scrapingProfiles['default'];

        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        if (profile.clickExpandSelector) {
          try {
            await page.click(profile.clickExpandSelector);
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (_) {}
        }

        if (profile.extraWait) await new Promise(resolve => setTimeout(resolve, profile.extraWait));

        const scrapedHtml = await page.evaluate((selectors) => {
          for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) return el.innerHTML;
          }
          return 'Description Not Found';
        }, profile.descriptionSelectors);

        await browser.close();

        // Use scraped content if successful, otherwise fallback to manual description
        if (scrapedHtml && scrapedHtml !== 'Description Not Found') {
          finalDescriptionHtml = scrapedHtml;
          finalDescription = formatDescription(scrapedHtml);
        } else {
          // Fallback to manual description
          finalDescription = description || 'Description Not Found';
          finalDescriptionHtml = descriptionHtml || description || 'Description Not Found';
        }
      } catch (scrapeError) {
        console.error('Scraping failed, using fallback description:', scrapeError);
        // Fallback to manual description
        finalDescription = description || 'Description Not Found';
        finalDescriptionHtml = descriptionHtml || description || 'Description Not Found';
      }
    } else {
      // Use manual description only
      finalDescription = description || '';
      finalDescriptionHtml = descriptionHtml || description || '';
    }

    const newJob = await Job.create({
      url: url || '',
      title,
      company,
      location: location || 'Not Specified',
      jobType: jobType || 'Not Specified',
      experience: experience || 'Not Specified',
      descriptionHtml: finalDescriptionHtml,
      description: finalDescription,
      applyLink: url || ''
    });

    res.status(201).json({
      message: url ? 'Job scraped and saved successfully' : 'Job created successfully',
      job: newJob
    });

  } catch (error) {
    console.error('Job processing error:', error);
    res.status(500).json({ message: 'Failed to process job', error: error.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job', error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted successfully', deletedJob: job });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job', error: error.message });
  }
};

module.exports = { processJob, getAllJobs, getJobById, deleteJob };