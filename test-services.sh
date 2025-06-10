#!/bin/bash

echo "Testing Gmail Scam Analyzer Services..."
echo "======================================="

# Test AI Service
echo "1. Testing AI Service (Port 8000)..."
AI_RESPONSE=$(curl -s http://localhost:8000/ || echo "Failed")
if [[ $AI_RESPONSE == *"Gmail Scam Analyzer AI Service"* ]]; then
    echo "✅ AI Service is running"
    echo "   Response: $AI_RESPONSE"
else
    echo "❌ AI Service not responding"
    echo "   Response: $AI_RESPONSE"
fi

echo ""

# Test Backend API
echo "2. Testing Backend API (Port 3001)..."
BACKEND_RESPONSE=$(curl -s http://localhost:3001/ || echo "Failed")
if [[ $BACKEND_RESPONSE == *"Hello"* ]]; then
    echo "✅ Backend API is running"
    echo "   Response: $BACKEND_RESPONSE"
else
    echo "❌ Backend API not responding"
    echo "   Response: $BACKEND_RESPONSE"
fi

echo ""

# Test Frontend
echo "3. Testing Frontend (Port 3000)..."
FRONTEND_RESPONSE=$(curl -s -I http://localhost:3000/ | head -n 1 || echo "Failed")
if [[ $FRONTEND_RESPONSE == *"200"* ]]; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend not responding"
    echo "   Response: $FRONTEND_RESPONSE"
fi

echo ""
echo "======================================="
echo "Service URLs:"
echo "• AI Service: http://localhost:8000"
echo "• AI Service Docs: http://localhost:8000/docs"
echo "• Backend API: http://localhost:3001"
echo "• Backend Swagger: http://localhost:3001/api/docs"
echo "• Frontend: http://localhost:3000"
echo "• Dashboard: http://localhost:3000/dashboard"
echo "======================================="
