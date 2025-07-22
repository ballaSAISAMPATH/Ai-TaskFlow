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
        "version": "2.1.0",
        "features": [
            "Fixed duration calculation - no forced monthly tasks",
            "Proper handling of weeks-only and days-only durations",
            "Enhanced React course curriculum",
            "Intelligent task distribution"
        ]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "generator_initialized": generator is not None
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

def test_duration_scenarios():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: Please set GEMINI_API_KEY environment variable")
        return
    
    test_generator = LearningPlanGenerator(api_key)
    
    test_cases = [
        {"goal": "Learn DSA", "duration": "2 weeks", "expected": {"months": 0, "weeks": 2, "days": 14}},
        {"goal": "Learn React", "duration": "8 weeks", "expected": {"months": 0, "weeks": 8, "days": 56}},
        {"goal": "Learn React", "duration": "3 months", "expected": {"months": 3, "weeks": 12, "days": 90}},
        {"goal": "Learn Python", "duration": "30 days", "expected": {"months": 0, "weeks": 4, "days": 30}},
    ]
    
    for test_case in test_cases:
        print(f"\n{'='*80}")
        print(f"Testing: {test_case['goal']} - {test_case['duration']}")
        print(f"Expected: {test_case['expected']}")
        
        duration_dict = test_generator.parse_duration(test_case['duration'])
        totals = test_generator.calculate_totals(duration_dict)
        
        print(f"Parsed: {duration_dict}")
        print(f"Totals: {totals}")
        
        plan = test_generator.generate_learning_plan(test_case['goal'], test_case['duration'])
        
        print(f"Generated plan structure:")
        print(f"  Monthly tasks: {len(plan['monthlyTasks'])}")
        print(f"  Weekly tasks: {len(plan['weeklyTasks'])}")  
        print(f"  Daily tasks: {len(plan['dailyTasks'])}")
        
        expected = test_case['expected']
        actual = {
            "months": len(plan['monthlyTasks']),
            "weeks": len(plan['weeklyTasks']),
            "days": len(plan['dailyTasks'])
        }
        
        matches = all(actual[k] == expected[k] for k in expected)
        print(f"✅ PASSED" if matches else f"❌ FAILED - Expected {expected}, got {actual}")
        
        if len(plan['weeklyTasks']) > 0:
            print(f"\nSample weekly tasks:")
            for i, task in enumerate(plan['weeklyTasks'][:2]):
                print(f"  {task['label']}: {', '.join(task['tasks'])}")
        
        if len(plan['dailyTasks']) > 0:
            print(f"\nSample daily tasks:")
            for i, task in enumerate(plan['dailyTasks'][:3]):
                print(f"  {task['label']}: {task['tasks'][0]}")


if __name__ == "__main__":
    test_duration_scenarios()