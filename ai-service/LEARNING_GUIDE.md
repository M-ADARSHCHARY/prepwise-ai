# FastAPI Learning Guide

## What You'll Learn

1. **Microservices:** Breaking monolith into independent services
2. **Async/Await:** Handle multiple requests without blocking
3. **FastAPI:** Modern, fast Python web framework
4. **Pydantic:** Data validation (like Mongoose schemas)
5. **REST Principles:** Proper API design

## Microservices Explained

### Traditional Monolith
```
┌─────────────────────────────────┐
│  Express App (One big app)      │
├─────────────────────────────────┤
│ • User routes                   │
│ • Session routes                │
│ • Analysis logic                │ ◄─ AI is inside main app
│ • Database connections          │
│ • File uploads                  │
└─────────────────────────────────┘
```

**Problems:**
- One bug crashes everything
- Can't scale AI separately
- Hard to maintain
- Tech lock-in (Node.js only)

### Microservices Architecture
```
┌──────────────────┐
│ Express Backend  │
│ (Node.js)        │
│                  │
│ • Users          │
│ • Sessions       │ ◄─ Calls FastAPI when needed
│ • Roadmaps       │
└────────┬─────────┘
         │ HTTP
         │
┌────────▼────────────┐
│ FastAPI Service     │
│ (Python)            │
│                     │
│ • AI Analysis       │
│ • LLM Calls         │
└─────────────────────┘
```

**Benefits:**
- Services fail independently
- Scale AI service separately
- Easy to add new tech (Python for AI)
- Easier testing

## Code Walkthrough

### 1. models.py - Data Validation

```python
class AnalysisRequest(BaseModel):
    resume_text: str
    job_description_text: str
```

This is like Mongoose schema:
- Defines what requests should look like
- Automatic validation (FastAPI rejects invalid requests)
- Auto-generates OpenAPI/Swagger documentation

### 2. services.py - Business Logic

```python
async def analyze_session(resume_text: str, job_description_text: str) -> dict:
    matched_skills = extract_skills(...)
    missing_skills = generate_missing_skills(...)
    ...
    return {...}
```

**Why `async`?**
- LLM API calls take 5-30 seconds
- `async` lets FastAPI handle other requests while waiting
- Like Node.js event loop but for Python

### 3. main.py - The API

```python
@app.post("/analyze")
async def analyze(request: AnalysisRequest):
    result = await analyze_session(...)
    return AnalysisResponse(**result)
```

**Decorator `@app.post("/analyze")`:**
- Creates HTTP POST endpoint at `/analyze`
- Like Express: `app.post('/analyze', handler)`

**`async def`:**
- Function is asynchronous
- Can use `await` inside

**Request/Response:**
- Input: `AnalysisRequest` (validated by Pydantic)
- Output: `AnalysisResponse` (auto-converted to JSON)

## FastAPI vs Express

| Feature | Express (Node.js) | FastAPI (Python) |
|---------|-------------------|------------------|
| Syntax | `app.post('/path', handler)` | `@app.post('/path')` with function |
| Validation | Manual checks | Pydantic automatic |
| Docs | Manual Swagger setup | Auto-generated at `/docs` |
| Async | Default (callbacks) | `async/await` |
| Speed | Fast | **Very Fast** (async by default) |
| Learning | Easier for JS devs | Cleaner, more Pythonic |

## Execution Flow: What Happens When You Call /analyze

```
1. Browser/Postman sends POST request:
   POST http://localhost:8000/analyze
   {
     "resume_text": "...",
     "job_description_text": "..."
   }

2. FastAPI receives request
   └─> Pydantic validates JSON
       └─> If invalid, return 400 error

3. @app.post decorator routes to our function

4. analyze(request) is called
   └─> request.resume_text (already validated)
   └─> call await analyze_session(...)
       └─> Wait for mock analysis (non-blocking)
       └─> Return dict with results

5. FastAPI receives dict
   └─> Pydantic converts to AnalysisResponse JSON
   └─> Return 200 OK

6. Browser/Postman receives:
   {
     "ats_score": 85,
     "matched_skills": [...],
     ...
   }
```

## Key Concepts

### async/await
```python
# Blocking (bad):
result = expensive_function()  # Waits 10 seconds
return result

# Non-blocking (good):
result = await expensive_function()  # Waits 10 seconds but doesn't block other requests
return result
```

### Pydantic Validation
```python
class Request(BaseModel):
    name: str           # Required string
    age: int            # Required int
    email: str | None   # Optional

# FastAPI automatically rejects:
# - Missing fields
# - Wrong types
# - Invalid formats
```

### Decorators
```python
@app.get()      # Read data
@app.post()     # Create data
@app.put()      # Update data
@app.delete()   # Delete data
```

Like Express:
- `@app.get()` ≈ `app.get()`
- `@app.post()` ≈ `app.post()`

## Next: Real LLM Integration

Later, you'll replace mock logic with real LLM:

```python
import google.generativeai as genai

async def analyze_session(...):
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
    Analyze this resume against the job description.
    Resume: {resume_text}
    JD: {job_description_text}
    
    Return JSON with:
    - ats_score (0-100)
    - matched_skills (array)
    - missing_skills (array with priority)
    """
    
    response = await model.generate_content_async(prompt)
    result = parse_llm_response(response)
    return result
```

## Testing Checklist

- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] Service starts without errors
- [ ] `/health` endpoint works
- [ ] `/docs` page loads in browser
- [ ] Can POST to `/analyze` in Swagger UI
- [ ] Response matches expected schema
- [ ] Multiple concurrent requests work

## When You're Stuck

1. Check Python version: `python --version` (need 3.8+)
2. Virtual env activated? Check for `(venv)` in terminal
3. Dependencies installed? `pip list | grep fastapi`
4. Port conflict? Change `AI_SERVICE_PORT` in `.env`
5. Import errors? Make sure you're in `ai-service` directory

## Files Overview

```
ai-service/
├── main.py              ◄─ FastAPI app (endpoints)
├── models.py            ◄─ Pydantic schemas
├── services.py          ◄─ Business logic
├── requirements.txt     ◄─ Dependencies
├── .env                 ◄─ Config
├── setup.bat            ◄─ One-click Windows setup
└── README.md            ◄─ Full documentation
```

## Common Patterns

### Pattern 1: Simple GET
```python
@app.get("/items/{item_id}")
async def get_item(item_id: int):
    return {"item_id": item_id}
```

### Pattern 2: POST with Validation
```python
@app.post("/items")
async def create_item(item: ItemModel):
    return {"status": "created", "item": item}
```

### Pattern 3: Error Handling
```python
@app.post("/analyze")
async def analyze(request: Request):
    try:
        result = await analyze_session(...)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## Ready to Start?

1. Run `setup.bat` (Windows) or follow README (Mac/Linux)
2. Open `http://localhost:8000/docs`
3. Try the `/analyze` endpoint
4. Ask questions about any part!
