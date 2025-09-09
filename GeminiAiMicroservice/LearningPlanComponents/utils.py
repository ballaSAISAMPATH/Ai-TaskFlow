# utils.py
import re
from typing import Dict, List, Any


def is_repetitive(task_list: List[Dict[str, Any]]) -> bool:
    seen = set()
    for task in task_list:
        task_str = ' '.join(task["tasks"]).lower()
        cleaned = re.sub(r'\b(day|week|month|study|learn|practice|continue)\s+\d+:?\s*', '', task_str)
        if cleaned in seen and len(cleaned) > 10:
            return True
        seen.add(cleaned)
    return False


class DurationParser:
    @staticmethod
    def parse_duration(duration: str) -> Dict[str, int]:
        duration = duration.lower().strip()
        
        months = weeks = days = 0
        
        month_match = re.search(r'(\d+)\s*month[s]?', duration)
        if month_match:
            months = int(month_match.group(1))
        
        week_match = re.search(r'(\d+)\s*week[s]?', duration)
        if week_match:
            weeks = int(week_match.group(1))
        
        day_match = re.search(r'(\d+)\s*day[s]?', duration)
        if day_match:
            days = int(day_match.group(1))
        
        return {"months": months, "weeks": weeks, "days": days}
    
    @staticmethod
    def calculate_totals(duration_dict: Dict[str, int]) -> Dict[str, int]:
        total_days = duration_dict["months"] * 30 + duration_dict["weeks"] * 7 + duration_dict["days"]
        
        if duration_dict["months"] > 0:
            total_months = duration_dict["months"]
        else:
            total_months = 0
        
        if duration_dict["weeks"] > 0 or duration_dict["months"] > 0:
            total_weeks = duration_dict["months"] * 4 + duration_dict["weeks"]
        else:
            total_weeks = max(1, total_days // 7) if total_days >= 7 else 0
        
        total_days = max(1, total_days)
        
        return {
            "total_days": total_days,
            "total_weeks": total_weeks,
            "total_months": total_months
        }


class ResponseCleaner:
    @staticmethod
    def clean_json_response(response: str) -> str:
        response = re.sub(r'```json\s*', '', response, flags=re.IGNORECASE)
        response = re.sub(r'```\s*$', '', response)
        response = re.sub(r'```', '', response)
        
        json_start = response.find('{')
        if json_start != -1:
            response = response[json_start:]
        
        json_end = response.rfind('}')
        if json_end != -1:
            response = response[:json_end + 1]
        
        return response.strip()


class PlanValidator:
    @staticmethod
    def validate_plan_structure(plan: Dict[str, Any]) -> Dict[str, Any]:
        if "goalTitle" not in plan:
            plan["goalTitle"] = "Learning Goal"
        
        if "totalDays" not in plan:
            plan["totalDays"] = 30
        
        for key in ["monthlyTasks", "weeklyTasks", "dailyTasks"]:
            if key not in plan:
                plan[key] = []
        
        for task_type in ["monthlyTasks", "weeklyTasks", "dailyTasks"]:
            if not isinstance(plan[task_type], list):
                plan[task_type] = []
            
            for i, task in enumerate(plan[task_type]):
                if not isinstance(task, dict):
                    plan[task_type][i] = {"label": f"Task {i+1}", "tasks": [], "status": False}
                else:
                    if "label" not in task:
                        task["label"] = f"Task {i+1}"
                    if "tasks" not in task:
                        task["tasks"] = []
                    if "status" not in task:
                        task["status"] = False
                    if not isinstance(task["tasks"], list):
                        task["tasks"] = [str(task["tasks"])] if task["tasks"] else []
        
        return plan