#!/bin/bash

echo "🧪 Gmail Scam Analyzer - Full Integration Test"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: AI Service Direct Call
echo -e "${BLUE}Test 1: AI Service Email Analysis${NC}"
echo "Testing direct AI service call..."

AI_RESULT=$(curl -s -X POST http://localhost:8000/analyze-email \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "URGENT: Your Account Will Be Suspended",
    "body": "Dear valued customer, your account will be suspended in 24 hours unless you verify your information immediately by clicking this link: http://verify-account-now.suspicious-site.com/login",
    "sender": "security@fake-bank-alerts.com",
    "recipient": "user@example.com",
    "urls": ["http://verify-account-now.suspicious-site.com/login"]
  }')

if [[ $AI_RESULT == *"scam_probability"* ]]; then
    echo -e "${GREEN}✅ AI Service working correctly${NC}"
    echo "Scam probability detected in response"
else
    echo -e "${RED}❌ AI Service failed${NC}"
    echo "Response: $AI_RESULT"
fi

echo ""

# Test 2: Backend API Integration
echo -e "${BLUE}Test 2: Backend API Integration${NC}"
echo "Testing backend -> AI service integration..."

BACKEND_RESULT=$(curl -s -X POST http://localhost:3001/emails/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Congratulations! You have won $1,000,000",
    "body": "You have been selected as winner of our international lottery! To claim your prize, send us your bank details immediately.",
    "sender": "lottery@winner-notification.biz", 
    "recipient": "user@example.com"
  }')

if [[ $BACKEND_RESULT == *"scamProbability"* ]]; then
    echo -e "${GREEN}✅ Backend integration working${NC}"
    echo "Analysis result returned successfully"
else
    echo -e "${RED}❌ Backend integration failed${NC}"
    echo "Response: $BACKEND_RESULT"
fi

echo ""

# Test 3: Chat Integration
echo -e "${BLUE}Test 3: Chat AI Integration${NC}"
echo "Testing chat functionality..."

CHAT_RESULT=$(curl -s -X POST http://localhost:3001/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I identify phishing emails?",
    "sessionId": "test_session_123"
  }')

if [[ $CHAT_RESULT == *"response"* ]]; then
    echo -e "${GREEN}✅ Chat integration working${NC}"
    echo "AI response generated successfully"
else
    echo -e "${RED}❌ Chat integration failed${NC}"
    echo "Response: $CHAT_RESULT"
fi

echo ""

# Test 4: Health Checks
echo -e "${BLUE}Test 4: System Health Checks${NC}"
echo "Checking all service health endpoints..."

# AI Service Health
AI_HEALTH=$(curl -s http://localhost:8000/health)
if [[ $AI_HEALTH == *"healthy"* ]]; then
    echo -e "${GREEN}✅ AI Service health check passed${NC}"
else
    echo -e "${RED}❌ AI Service health check failed${NC}"
fi

# Backend Health  
BACKEND_HEALTH=$(curl -s http://localhost:3001/health)
if [[ $BACKEND_HEALTH == *"healthy"* ]]; then
    echo -e "${GREEN}✅ Backend health check passed${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
fi

# Frontend Health
FRONTEND_HEALTH=$(curl -s -I http://localhost:3000/ | head -n 1)
if [[ $FRONTEND_HEALTH == *"200"* ]]; then
    echo -e "${GREEN}✅ Frontend health check passed${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
fi

echo ""
echo "=============================================="
echo -e "${YELLOW}🎉 Integration Test Complete!${NC}"
echo ""
echo -e "${BLUE}Access your application:${NC}"
echo "• Frontend Dashboard: http://localhost:3000/dashboard"
echo "• Backend API Docs: http://localhost:3001/api/docs"  
echo "• AI Service Docs: http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}Sample Test Cases:${NC}"
echo "1. Navigate to http://localhost:3000/dashboard"
echo "2. Click 'Email Analyzer' tab"
echo "3. Click 'Load Phishing Sample' button"
echo "4. Click 'Analyze Email' to test the full pipeline"
echo "5. Try the 'AI Chat' tab for interactive assistance"
echo "=============================================="
