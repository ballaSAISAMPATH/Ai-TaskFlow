# learning_plan_generator.py
import json
from typing import Dict, Any
from gemini_llm import GeminiLLM
from templates import LEARNING_PLAN_PROMPT
from utils import DurationParser, ResponseCleaner, PlanValidator
from subject_detector import SubjectDetector
from task_generator import TaskGenerator
from fallback_plan_generator import FallbackPlanGenerator


class LearningPlanGenerator:
    
    def __init__(self, gemini_api_key: str):
        self.llm = GeminiLLM(api_key=gemini_api_key)
        self.prompt_template = LEARNING_PLAN_PROMPT
        
        # Initialize components
        self.duration_parser = DurationParser()
        self.response_cleaner = ResponseCleaner()
        self.plan_validator = PlanValidator()
        self.subject_detector = SubjectDetector()
        self.task_generator = TaskGenerator()
        self.fallback_generator = FallbackPlanGenerator()
    
    def generate_learning_plan(self, goal: str, duration: str) -> Dict[str, Any]:
        
        print(f"Generating plan for goal: {goal}, duration: {duration}")
        
        duration_dict = self.duration_parser.parse_duration(duration)
        totals = self.duration_parser.calculate_totals(duration_dict)
        
        print(f"Parsed duration: {duration_dict}")
        print(f"Calculated totals: {totals}")
        
        max_retries = 3
        
        for attempt in range(max_retries):
            try:
                formatted_prompt = self.prompt_template.format(
                    goal=goal, 
                    duration=duration, 
                    total_days=totals["total_days"],
                    total_weeks=totals["total_weeks"],
                    total_months=totals["total_months"]
                )
                
                print(f"Attempt {attempt + 1}: Calling Gemini API...")
                raw_response = self.llm(formatted_prompt)
                
                if raw_response.startswith("Error:"):
                    print(f"LLM error on attempt {attempt + 1}: {raw_response}")
                    continue
                
                print(f"Raw response received, length: {len(raw_response)}")
                json_response = self.response_cleaner.clean_json_response(raw_response)
                print(f"Cleaned JSON length: {len(json_response)}")
                print(f"JSON preview: {json_response[:200]}")
                
                try:
                    plan = json.loads(json_response)
                    print("JSON parsing successful!")
                    
                    if (isinstance(plan, dict) and 
                        len(plan.get('dailyTasks', [])) == totals["total_days"] and
                        len(plan.get('weeklyTasks', [])) == totals["total_weeks"] and
                        len(plan.get('monthlyTasks', [])) == totals["total_months"]):
                        
                        print(f"Plan validated: {len(plan['dailyTasks'])} daily, {len(plan['weeklyTasks'])} weekly, {len(plan['monthlyTasks'])} monthly tasks")
                        return self.plan_validator.validate_plan_structure(plan)
                    else:
                        print(f"Plan structure invalid - Expected: {totals['total_days']} daily, {totals['total_weeks']} weekly, {totals['total_months']} monthly")
                        print(f"Got: {len(plan.get('dailyTasks', []))} daily, {len(plan.get('weeklyTasks', []))} weekly, {len(plan.get('monthlyTasks', []))} monthly")
                        
                except json.JSONDecodeError as e:
                    print(f"JSON parsing failed on attempt {attempt + 1}: {e}")
                    print(f"Problematic JSON: {json_response[:500]}")
                    
            except Exception as e:
                print(f"Error on attempt {attempt + 1}: {e}")
        
        print("All LLM attempts failed, using intelligent fallback")
        return self.fallback_generator.create_intelligent_fallback_plan(goal, duration)