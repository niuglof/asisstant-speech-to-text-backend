const express = require('express');
const request = require('http');

// Test script to verify login endpoint is working
async function testEndpoints() {
  const data = JSON.stringify({
    email: 'test@example.com',
    password: 'test123'
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log('Testing login endpoint: http://localhost:3001/api/auth/login');

  const req = request.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('RESPONSE:', responseData);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.write(data);
  req.end();

  // Also test the health endpoint
  setTimeout(() => {
    const healthOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/health',
      method: 'GET'
    };

    console.log('\nTesting health endpoint: http://localhost:3001/health');

    const healthReq = request.request(healthOptions, (res) => {
      console.log(`Health STATUS: ${res.statusCode}`);
      
      let healthData = '';
      res.on('data', (chunk) => {
        healthData += chunk;
      });

      res.on('end', () => {
        console.log('Health RESPONSE:', healthData);
        process.exit(0);
      });
    });

    healthReq.on('error', (e) => {
      console.error(`Health check failed: ${e.message}`);
      process.exit(1);
    });

    healthReq.end();
  }, 1000);
}

testEndpoints();