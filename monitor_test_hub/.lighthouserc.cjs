module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }], // Allow minor variances in runtime tests
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 1.0 }],
        'categories:seo': ['error', { minScore: 1.0 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1000 }],
        'interactive': ['error', { maxNumericValue: 1500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
