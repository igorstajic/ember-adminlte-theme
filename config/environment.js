/* eslint-env node */
'use strict';

module.exports = function(/* environment, appConfig */) {
  return { 
    contentSecurityPolicyHeader: 'Content-Security-Policy',
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' *",
      'font-src': "'self' 'unsafe-inline' maxcdn.bootstrapcdn.com fonts.googleapis.com fonts.gstatic.com",
      'connect-src': "'self' *",
      'img-src': "'self' * data:",
      'style-src': "'self' 'unsafe-inline' maxcdn.bootstrapcdn.com fonts.googleapis.com"
    }
  };
};
