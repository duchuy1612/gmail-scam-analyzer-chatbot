#!/bin/bash

# Test script for MySQL database integration
echo "🧪 Testing MySQL Database Integration"
echo "======================================"

BASE_URL="http://localhost:3001"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to make HTTP requests and check status
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    echo -e "${BLUE}Testing: ${description}${NC}"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint")
    fi
    
    body=$(echo "$response" | head -n -1)
    status=$(echo "$response" | tail -n 1)
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (Status: $status)"
        echo "Response: $body"
    else
        echo -e "${RED}❌ FAIL${NC} (Expected: $expected_status, Got: $status)"
        echo "Response: $body"
    fi
    echo ""
}

# Test 1: Database Connection
echo "1. Database Connection Test"
test_endpoint "GET" "/test-db" "" "200" "Database connectivity"

# Test 2: User Registration
echo "2. User Registration Test"
test_endpoint "POST" "/auth/register" \
    '{"email":"dbtest@example.com","name":"DB Test User","password":"testpass123"}' \
    "201" "User registration"

# Test 3: User Login
echo "3. User Login Test"
login_response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"dbtest@example.com","password":"testpass123"}')

token=$(echo $login_response | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -n "$token" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Login successful, token received"
    echo "Token: ${token:0:50}..."
else
    echo -e "${RED}❌ FAIL${NC} - Login failed"
    echo "Response: $login_response"
fi
echo ""

# Test 4: Protected Endpoint (Email Analysis History)
echo "4. Protected Endpoint Test"
if [ -n "$token" ]; then
    history_response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/emails/history" \
        -H "Authorization: Bearer $token")
    
    body=$(echo "$history_response" | head -n -1)
    status=$(echo "$history_response" | tail -n 1)
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✅ PASS${NC} - Protected endpoint accessible"
        echo "Response: $body"
    else
        echo -e "${RED}❌ FAIL${NC} - Protected endpoint failed (Status: $status)"
    fi
else
    echo -e "${RED}❌ SKIP${NC} - No token available"
fi
echo ""

# Test 5: Mock Data Verification
echo "5. Mock Data Verification"
echo "Checking database contents..."

# Check users table
user_count=$(docker exec infrastructure-mysql-1 mysql -u appuser -papppassword gmail_scam_analyzer -e "SELECT COUNT(*) FROM users;" 2>/dev/null | tail -n 1)
echo "Users in database: $user_count"

# Check email_analyses table
analysis_count=$(docker exec infrastructure-mysql-1 mysql -u appuser -papppassword gmail_scam_analyzer -e "SELECT COUNT(*) FROM email_analyses;" 2>/dev/null | tail -n 1)
echo "Email analyses in database: $analysis_count"

# Check chat_sessions table
session_count=$(docker exec infrastructure-mysql-1 mysql -u appuser -papppassword gmail_scam_analyzer -e "SELECT COUNT(*) FROM chat_sessions;" 2>/dev/null | tail -n 1)
echo "Chat sessions in database: $session_count"

# Check chat_messages table
message_count=$(docker exec infrastructure-mysql-1 mysql -u appuser -papppassword gmail_scam_analyzer -e "SELECT COUNT(*) FROM chat_messages;" 2>/dev/null | tail -n 1)
echo "Chat messages in database: $message_count"

if [ "$user_count" -ge "4" ] && [ "$analysis_count" -ge "3" ] && [ "$session_count" -ge "2" ] && [ "$message_count" -ge "4" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Mock data present and new data added"
else
    echo -e "${RED}❌ FAIL${NC} - Mock data missing or incomplete"
fi
echo ""

echo "🎉 Database Integration Test Complete!"
echo "======================================"
