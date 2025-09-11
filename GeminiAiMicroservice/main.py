import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import LearningPlanRequest, TaskItem, LearningPlanResponse
from learning_plan_generator import LearningPlanGenerator

app = FastAPI(
    title="Enhanced Learning Plan Generator API",
    description="Generate unique, progressive learning plans using AI",
    version="2.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generator = None

@app.on_event("startup")
async def startup_event():
    global generator
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY environment variable not set")
    
    generator = LearningPlanGenerator(api_key)
    print("Enhanced Learning Plan Generator initialized successfully")

@app.get("/")
async def root():
    return {
        "message": "Enhanced Learning Plan Generator API",
    }


@app.post("/generate-plan", response_model=LearningPlanResponse)
async def generate_plan(request: LearningPlanRequest):
    if not generator:
        raise HTTPException(status_code=500, detail="Generator not initialized")
    
    if not request.goal.strip():
        raise HTTPException(status_code=400, detail="Goal cannot be empty")
    
    if not request.duration.strip():
        raise HTTPException(status_code=400, detail="Duration cannot be empty")
    
    try:
        plan = generator.generate_learning_plan(request.goal, request.duration)
        
        response = LearningPlanResponse(
            goalTitle=plan["goalTitle"],
            totalDays=plan["totalDays"],
            monthlyTasks=[TaskItem(**task) for task in plan["monthlyTasks"]],
            weeklyTasks=[TaskItem(**task) for task in plan["weeklyTasks"]],
            dailyTasks=[TaskItem(**task) for task in plan["dailyTasks"]]
        )
        
        return response
        
    except Exception as e:
        print(f"Error in generate_plan endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating plan: {str(e)}")



if __name__ == "__main__":
    test_duration_scenarios()