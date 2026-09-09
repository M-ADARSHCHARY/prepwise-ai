# PrepWise AI Service - FastAPI Microservice

## What is this?

A **microservice** that handles AI analysis for resumes vs job descriptions. It runs independently on port 8000 and receives requests from the Node.js backend.

**Why separate?**
- AI/LLM calls are async and potentially slow (5-30 seconds)
- Isolate AI logic from main application
- Easy to scale independently
- Can use different tech stack (Python for AI, Node.js for API)

## Architecture

```
┌─────────────────┐
│  React Frontend │
│  (Port 3000)    │
└────────┬────────┘
         │
┌─────────▼─────────┐
│  Node.js Backend  │ ◄─── Makes REST calls to AI Service
│  Express API      │
│  (Port 5000)      │
└────────┬──────────┘
         │
         │ HTTP POST /analyze
         │
┌────────▼──────────┐
│  FastAPI Service  │ ◄─── This file (Port 8000)
│  AI Analysis      │
│  (Port 8000)      │
└───────────────────┘
```

## Setup (First Time)

### Step 1: Create Python Virtual Environment

```bash
cd c:\PJCTS\prepwise-ai\ai-service

# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Run the Service

```bash
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Testing

### Option 1: Browser (Interactive Docs)
Open: `http://localhost:8000/docs`

You'll see an interactive Swagger UI where you can test endpoints live.

### Option 2: Postman

**Health Check:**
```
GET http://localhost:8000/health
```

**Analyze Endpoint:**
```
POST http://localhost:8000/analyze

Body (JSON):
{
  "resume_text": "5 years experience with Java, Python, React...",
  "job_description_text": "Looking for experienced backend engineer. Skills: Java, System Design, Cloud..."
}
```

### Option 3: From Node.js Backend (Integration)

Later, you'll update Node.js backend to call this instead of mock service:

```javascript
// Instead of: analyzeSessionWithAI(resumeText, jdText)
// Do this: POST to http://localhost:8000/analyze
const response = await fetch('http://localhost:8000/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resume_text: resumeText,
    job_description_text: jobDescriptionText
  })
});
const result = await response.json();
```

## Key Files

- **main.py** - FastAPI app with endpoints
- **models.py** - Pydantic request/response schemas (like Mongoose models)
- **services.py** - Business logic (analysis functions)
- **requirements.txt** - Python dependencies
- **.env** - Environment variables

## Learning: Key FastAPI Concepts

### 1. Decorators
```python
@app.get("/health")      # HTTP GET method
@app.post("/analyze")    # HTTP POST method
```

### 2. Async/Await (handles multiple requests simultaneously)
```python
async def analyze(request: AnalysisRequest):
    result = await analyze_session(...)  # Non-blocking wait
    return result
```

### 3. Pydantic Models (automatic validation + docs)
```python
class AnalysisRequest(BaseModel):
    resume_text: str
    job_description_text: str

# FastAPI automatically validates incoming JSON
# and generates OpenAPI/Swagger docs
```

### 4. Dependency Injection
```python
# More advanced - we'll use later for databases, authentication
```

## Next Steps

1. ✅ Start FastAPI service
2. Test `/docs` interface
3. Test `/analyze` endpoint in Postman
4. Integrate with Node.js backend (modify analyzePreparationSession)
5. Add real LLM (replace mock logic in services.py)

## Common Issues

**Port 8000 already in use:**
```bash
# Windows: Find process
netstat -ano | findstr :8000

# Kill it
taskkill /PID <PID> /F

# Or change port in .env: AI_SERVICE_PORT=8001
```

**Import errors (models.py not found):**
- Make sure you `cd` to ai-service folder before running
- Run the app with: `uvicorn app.main:app --reload`

**Venv not activating:**
- Windows: `venv\Scripts\activate.bat`
- Make sure Python is installed: `python --version`

## Production Notes

For real deployment, you'll also need:
- Error logging (Sentry, LogRocket)
- Database for caching results
- Rate limiting
- Authentication/API keys
- SSL certificates
