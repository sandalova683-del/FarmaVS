const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
if(!html.includes('health-service.js')) throw new Error('Health service is not loaded');
if(!html.includes('FormulaVSHealth')) throw new Error('Health bridge is not wired');
if(!html.includes('syncSteps')) throw new Error('Steps sync UI is missing');
console.log('FormulaVS web package check: OK');
