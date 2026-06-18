const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const seoContentPath = path.join(__dirname, '../data/seo_content.json');
const seoAuditPath = path.join(__dirname, '../data/full_seo_audit.json');

/**
 * Helper to read and parse JSON files asynchronously.
 * Using fs.readFile ensures we serve the freshest content without Node.js module caching.
 */
const readJsonFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
};

// GET /api/seo - Get all SEO content
router.get('/', async (req, res) => {
  try {
    const data = await readJsonFile(seoContentPath);
    res.json(data);
  } catch (err) {
    console.error('Error reading SEO content:', err);
    res.status(500).json({ message: 'Error reading SEO content data' });
  }
});

// GET /api/seo/audit - Get full SEO audit data
router.get('/audit', async (req, res) => {
  try {
    const data = await readJsonFile(seoAuditPath);
    res.json(data);
  } catch (err) {
    console.error('Error reading SEO audit:', err);
    res.status(500).json({ message: 'Error reading SEO audit data' });
  }
});

// GET /api/seo/:page - Get page-specific SEO details
router.get('/:page', async (req, res) => {
  try {
    const pageKey = req.params.page;
    const data = await readJsonFile(seoContentPath);
    
    if (data && data[pageKey]) {
      res.json(data[pageKey]);
    } else {
      res.status(404).json({ message: `SEO content not found for page: ${pageKey}` });
    }
  } catch (err) {
    console.error(`Error reading SEO content for page ${req.params.page}:`, err);
    res.status(500).json({ message: 'Error reading page SEO data' });
  }
});

module.exports = router;
