from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random
import time
from datetime import datetime

from .model_utils import load_model

model = load_model()

app = FastAPI(
    title="Gmail Scam Analyzer AI Service",
    description="AI-powered email scam detection and chat assistant service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


@app.on_event("startup")
async def load_classifier():
    """Load the phishing detection model on startup."""
# Import session management library
import flask_login  # Flask-Login provides user session management for Flask

async def load_classifier():
    """Load the phishing detection model on startup."""
    if flask_login.current_user.is_authenticated and flask_login.current_user.has_role('admin'):
        model = load_model()
    else:
        raise PermissionError("Unauthorized access to load classifier")
from datetime import datetime
import logging  # Import logging module for error handling

from .model_utils import load_model

from .model_utils import load_model

model = None  # TODO: Consider lazy loading or initialization in startup event

app = FastAPI(
    title="Gmail Scam Analyzer AI Service",

app = FastAPI(
    title="Gmail Scam Analyzer AI Service",
    description="AI-powered email scam detection and chat assistant service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


@app.on_event("startup")
async def load_classifier():
    """Load the phishing detection model on startup."""
    global model
    try:
        model = load_model()
    except Exception as e:
        logging.error(f"Failed to load model: {str(e)}")
        raise

# Data Models
class EmailData(BaseModel):
    subject: str
    body: str
    sender: str
    recipient: str
    headers: Optional[List[str]] = []
    urls: Optional[List[str]] = []

# Data Models
class EmailData(BaseModel):
    subject: str
    body: str
    sender: str
    recipient: str
    headers: Optional[List[str]] = []
    urls: Optional[List[str]] = []

class EmailAnalysisResult(BaseModel):
    scam_probability: float
    risk_level: str
    explanation: str
    red_flags: List[str]
    confidence: float

class BulkEmailRequest(BaseModel):
    emails: List[EmailData]

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None
    context: Optional[List[str]] = []

class ChatResponse(BaseModel):
    response: str
    session_id: str
    suggestions: List[str]

class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: str
    uptime: float

# Health check endpoint
@app.get("/", response_model=dict)
def read_root():
    return {
        "message": "Gmail Scam Analyzer AI Service is running",
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="healthy",
        message="AI service is operational",
        timestamp=datetime.now().isoformat(),
        uptime=time.time()
    )

# Email analysis endpoints
@app.post("/analyze-email", response_model=EmailAnalysisResult)
def analyze_email(email_data: EmailData):
    """
    Analyze a single email for scam indicators using AI
    """
    """
    try:
        email_content = f"{email_data.subject}
{email_data.body}"
        scam_probability = float(model.predict_proba([email_content])[0][1])
        risk_level = determine_risk_level(scam_probability)
        explanation = generate_explanation(email_data, scam_probability)
        red_flags = identify_red_flags(email_data)
    """
    try:
        text = f"{email_data.subject}
{email_data.body}"
        # TODO: Implement batch prediction or more efficient prediction method
        scam_probability = float(model.predict_proba([text])[0][1])
        risk_level = determine_risk_level(scam_probability)
        explanation = generate_explanation(email_data, scam_probability)
        red_flags = identify_red_flags(email_data)
risk_level = determine_risk_level(scam_probability)
        explanation = generate_explanation(email_data, scam_probability)
        red_flags = identify_red_flags(email_data)
        
        return EmailAnalysisResult(
            scam_probability=scam_probability,
            risk_level=risk_level,
            explanation=explanation,
            red_flags=red_flags,
            confidence=scam_probability
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
        
        return EmailAnalysisResult(
            scam_probability=scam_probability,
            risk_level=risk_level,
            explanation=explanation,
            red_flags=red_flags,
            confidence=confidence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/bulk-analyze-emails", response_model=List[EmailAnalysisResult])
def bulk_analyze_emails(request: BulkEmailRequest):
    """
    Analyze multiple emails for scam indicators
    """
    try:
        texts = [f"{email.subject}\n{email.body}" for email in request.emails]
        probabilities = model.predict_proba(texts)[:, 1]
        results = []
raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/bulk-analyze-emails", response_model=List[EmailAnalysisResult])
async def bulk_analyze_emails(request: BulkEmailRequest):
    """
    Analyze multiple emails for scam indicators
    """
    try:
        texts = [f"{email.subject}
{email.body}" for email in request.emails]
        probabilities = await asyncio.to_thread(model.predict_proba, texts)
        probabilities = probabilities[:, 1]
        
        results = await asyncio.gather(*[
            asyncio.to_thread(
                process_email,
                email_data,
                float(prob)
            ) for email_data, prob in zip(request.emails, probabilities)
        ])
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk analysis failed: {str(e)}")

# Chat endpoint
@app.post("/chat", response_model=ChatResponse)

# TODO: Implement process_email function
# def process_email(email_data: EmailData, scam_probability: float) -> EmailAnalysisResult:
#     risk_level = determine_risk_level(scam_probability)
#     explanation = generate_explanation(email_data, scam_probability)
#     red_flags = identify_red_flags(email_data)
#     confidence = scam_probability
#     return EmailAnalysisResult(
#         scam_probability=scam_probability,
#         risk_level=risk_level,
#         explanation=explanation,
#         red_flags=red_flags,
#         confidence=confidence
#     )
            scam_probability = float(prob)
            risk_level = determine_risk_level(scam_probability)
            explanation = generate_explanation(email_data, scam_probability)
            red_flags = identify_red_flags(email_data)
            confidence = scam_probability
            results.append(
                EmailAnalysisResult(
                    scam_probability=scam_probability,
                    risk_level=risk_level,
                    explanation=explanation,
                    red_flags=red_flags,
                    confidence=confidence,
                )
            )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk analysis failed: {str(e)}")

# Chat endpoint
@app.post("/chat", response_model=ChatResponse)
def chat_with_ai(chat_message: ChatMessage):
    """
    Chat with AI assistant about email security
    """
    try:
        response_text = generate_chat_response(chat_message.message, chat_message.context)
        suggestions = generate_suggestions(chat_message.message)
        session_id = chat_message.session_id or f"session_{int(time.time())}"
        
        return ChatResponse(
            response=response_text,
            session_id=session_id,
            suggestions=suggestions
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

# Helper functions for mock AI logic
def calculate_scam_probability(email_data: EmailData) -> float:
    """Mock scam probability calculation"""
    scam_indicators = 0
    total_checks = 10
    
    # Check for suspicious keywords
    suspicious_keywords = ['urgent', 'verify', 'suspended', 'click here', 'act now', 'winner', 'prize', 'congratulations']
    subject_lower = email_data.subject.lower()
    body_lower = email_data.body.lower()
    
    for keyword in suspicious_keywords:
        if keyword in subject_lower or keyword in body_lower:
            scam_indicators += 1
    
    # Check sender domain
    if any(domain in email_data.sender for domain in ['.biz', '.tk', '.ml', 'suspicious']):
        scam_indicators += 2
    
    # Check for URLs
    if email_data.urls and len(email_data.urls) > 2:
        scam_indicators += 1
    
    # Grammar and formatting checks (simplified)
    if '!!!' in email_data.body or email_data.body.isupper():
        scam_indicators += 1
    
    return min(scam_indicators / total_checks, 1.0)

def determine_risk_level(probability: float) -> str:
    """Determine risk level based on probability"""
    if probability < 0.3:
        return "LOW"
    elif probability < 0.6:
        return "MEDIUM"
    elif probability < 0.8:
        return "HIGH"
    else:
        return "CRITICAL"

def generate_explanation(email_data: EmailData, probability: float) -> str:
    """Generate explanation for the analysis"""
    if probability < 0.3:
        return "This email appears to be legitimate with minimal risk indicators."
    elif probability < 0.6:
        return "This email contains some suspicious elements that warrant caution."
    elif probability < 0.8:
        return "This email shows multiple scam indicators and should be treated with high suspicion."
    else:
        return "This email exhibits critical scam characteristics and is likely fraudulent."

def identify_red_flags(email_data: EmailData) -> List[str]:
    """Identify specific red flags in the email"""
    flags = []
    
    subject_lower = email_data.subject.lower()
    body_lower = email_data.body.lower()
    
    if any(word in subject_lower for word in ['urgent', 'immediate', 'suspended']):
        flags.append("Urgent language in subject")
    
    if any(word in body_lower for word in ['click here', 'verify now', 'act immediately']):
        flags.append("Suspicious call-to-action")
    
    if email_data.urls:
        flags.append("Contains external links")
    
    if not email_data.sender.endswith(('.com', '.org', '.edu', '.gov')):
        flags.append("Suspicious sender domain")
    
    if '!!!' in email_data.body:
        flags.append("Excessive punctuation")
    
    return flags

def calculate_confidence(email_data: EmailData) -> float:
    """Calculate confidence in the analysis"""
    # Mock confidence calculation
    return random.uniform(0.7, 0.95)

def generate_chat_response(message: str, context: List[str] = None) -> str:
    """Generate AI chat response"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['analyze', 'check', 'suspicious']):
        return "I can help you analyze that email for potential scams. Please share the email subject, sender, and content for a detailed analysis."
    
    elif any(word in message_lower for word in ['phishing', 'scam', 'fraud']):
        return "Phishing emails often contain urgent language, suspicious links, and requests for personal information. Look out for sender domain mismatches and grammar errors."
    
    elif any(word in message_lower for word in ['safe', 'legitimate', 'real']):
        return "To verify if an email is legitimate, check the sender's domain, look for official contact information, and verify any claims through official channels."
    
    elif any(word in message_lower for word in ['hello', 'hi', 'help']):
        return "Hello! I'm your AI assistant for email security. I can help you analyze suspicious emails, identify phishing attempts, and provide guidance on email safety."
    
    else:
        return "I'm here to help with email security and scam detection. You can share suspicious emails with me for analysis or ask questions about email safety best practices."

def generate_suggestions(message: str) -> List[str]:
    """Generate contextual suggestions"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['analyze', 'check']):
        return [
            "Share the email content for analysis",
            "Check the sender's domain reputation",
            "Look for grammar and spelling errors",
            "Verify any claims independently"
        ]
    
    elif any(word in message_lower for word in ['phishing', 'scam']):
        return [
            "Learn about common phishing tactics",
            "How to report phishing emails",
            "Best practices for email security",
            "Verify sender authenticity"
        ]
    
    else:
        return [
            "Analyze a suspicious email",
            "Learn about email security",
            "Report a phishing attempt",
            "Get safety recommendations"
        ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
