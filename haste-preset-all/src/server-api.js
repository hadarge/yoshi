const express = require('express');
const projectConfig = require('../config/project');

module.exports = app => {
  const files = projectConfig.clientFilesPath();

  [corsMiddleware(), resourceTimingMiddleware(), express.static(files)]
  .forEach(mw => app.use(mw));

  return app;
};

function corsMiddleware() {
  return (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  };
}

function resourceTimingMiddleware() {
  return (req, res, next) => {
    res.setHeader('Timing-Allow-Origin', '*');
    next();
  };
}
