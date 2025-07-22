import json
import re
from typing import Dict, Any, List
from gemini_llm import GeminiLLM
from templates import LEARNING_PLAN_PROMPT

def is_repetitive(task_list: List[Dict[str, Any]]) -> bool:
    seen = set()
    for task in task_list:
        task_str = ' '.join(task["tasks"]).lower()
        cleaned = re.sub(r'\b(day|week|month|study|learn|practice|continue)\s+\d+:?\s*', '', task_str)
        if cleaned in seen and len(cleaned) > 10:
            return True
        seen.add(cleaned)
    return False

class LearningPlanGenerator:
    
    def __init__(self, gemini_api_key: str):
        self.llm = GeminiLLM(api_key=gemini_api_key)
        self.prompt_template = LEARNING_PLAN_PROMPT
        
        self.detailed_curricula = {
            "dsa": [
                "Arrays and String Manipulation", "Two Pointers and Sliding Window", "Linked Lists Operations",
                "Stacks and Queues", "Recursion and Backtracking", "Binary Trees Fundamentals",
                "Binary Search Trees", "Tree Traversals", "Heaps and Priority Queues", "Hash Tables",
                "Graph Representation", "Graph Traversals (BFS/DFS)", "Shortest Path Algorithms",
                "Dynamic Programming Basics", "1D DP Problems", "2D DP Problems", "Advanced DP Patterns",
                "Greedy Algorithms", "Bit Manipulation", "Trie Data Structure", "Union Find",
                "Advanced Graph Algorithms", "String Algorithms", "Mathematical Algorithms", "System Design"
            ],
            "react": [
                "React Environment Setup", "JSX Syntax and Components", "Props and State Management",
                "Event Handling", "Conditional Rendering", "Lists and Keys", "Forms and Inputs",
                "Component Lifecycle", "useEffect Hook", "useState Hook", "Custom Hooks",
                "Context API", "React Router", "State Management with Redux", "HTTP Requests and APIs",
                "Error Boundaries", "Performance Optimization", "Code Splitting", "Testing with Jest",
                "Styled Components", "Material-UI Integration", "TypeScript with React", 
                "Next.js Fundamentals", "Server-side Rendering", "Static Site Generation"
            ],
            "python": [
                "Python Environment Setup", "Variables and Data Types", "Control Structures",
                "Functions and Scope", "Lists and Tuples", "Dictionaries and Sets", "String Methods",
                "File Handling", "Exception Handling", "Object-Oriented Programming", "Classes and Objects",
                "Inheritance and Polymorphism", "Modules and Packages", "Lambda Functions", "Decorators",
                "Generators and Iterators", "Regular Expressions", "Working with APIs", "Database Integration",
                "Web Scraping", "GUI Development", "Testing with pytest", "Virtual Environments", "Deployment"
            ]
        }
    
    def detect_subject_category(self, goal: str) -> str:
        goal_lower = goal.lower()
        
        for key in self.detailed_curricula.keys():
            if key in goal_lower:
                return key
        
        if any(keyword in goal_lower for keyword in ['algorithm', 'data structure', 'coding', 'leetcode']):
            return "dsa"
        elif any(keyword in goal_lower for keyword in ['python', 'django', 'flask']):
            return "python"
        elif any(keyword in goal_lower for keyword in ['react', 'jsx', 'frontend', 'component']):
            return "react"
        else:
            return "general"
    
    def parse_duration(self, duration: str) -> Dict[str, int]:
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
    
    def calculate_totals(self, duration_dict: Dict[str, int]) -> Dict[str, int]:
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
    
    def clean_json_response(self, response: str) -> str:
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
    
    def create_unique_daily_tasks(self, goal: str, category: str, num_days: int) -> List[str]:
        
        action_patterns = [
            "Set up and configure", "Learn fundamentals of", "Practice implementing", "Build mini-project with",
            "Debug and troubleshoot", "Research best practices for", "Review and optimize", "Create from scratch",
            "Experiment with different", "Test your knowledge of", "Document your learning about", "Refactor existing",
            "Study advanced concepts in", "Compare different approaches to", "Solve coding problems using",
            "Join community discussion about", "Write tutorial on", "Teach someone else about",
            "Create examples for", "Take assessment on", "Peer review code for", "Contribute to open source project using",
            "Profile and optimize", "Deploy application using", "Design algorithm for", "Benchmark performance of"
        ]
        
        if category in self.detailed_curricula:
            concepts = self.detailed_curricula[category]
        else:
            concepts = [f"{goal.replace('Learn ', '').replace('learn ', '')} fundamentals",
                       f"{goal.replace('Learn ', '').replace('learn ', '')} intermediate concepts",
                       f"{goal.replace('Learn ', '').replace('learn ', '')} advanced topics"]
        
        specific_items = [
            "basic syntax", "advanced features", "error handling", "optimization techniques",
            "debugging strategies", "design patterns", "real-world applications", "edge cases",
            "performance considerations", "best practices", "common pitfalls", "interview questions",
            "project structure", "code organization", "testing strategies", "documentation",
            "version control", "collaboration tools", "deployment methods", "monitoring"
        ]
        
        daily_tasks = []
        used_combinations = set()
        
        extended_concepts = concepts * ((num_days // len(concepts)) + 2)
        
        for day in range(num_days):
            for attempt in range(50):
                action_idx = (day + attempt) % len(action_patterns)
                concept_idx = (day + attempt * 2) % len(extended_concepts)
                specific_idx = (day + attempt * 3) % len(specific_items)
                
                action = action_patterns[action_idx]
                
                if day % 5 == 0:
                    task = f"{action} {extended_concepts[concept_idx].lower()}"
                elif day % 5 == 1:
                    task = f"{action} {specific_items[specific_idx]} in {goal.lower()}"
                elif day % 5 == 2:
                    task = f"{action} {extended_concepts[concept_idx].lower()} focusing on {specific_items[specific_idx]}"
                elif day % 5 == 3:
                    task = f"Master {extended_concepts[concept_idx].lower()} through {action.lower()}"
                else:
                    task = f"Apply {extended_concepts[concept_idx].lower()} to {specific_items[specific_idx]}"
                
                task_key = task.lower().replace(" ", "")
                if task_key not in used_combinations:
                    used_combinations.add(task_key)
                    daily_tasks.append(task)
                    break
            else:
                task = f"Advanced practice session #{day + 1} for {goal.lower()}"
                daily_tasks.append(task)
        
        return daily_tasks
    
    def create_intelligent_fallback_plan(self, goal: str, duration: str) -> Dict[str, Any]:
        duration_dict = self.parse_duration(duration)
        totals = self.calculate_totals(duration_dict)
        
        subject_category = self.detect_subject_category(goal)
        
        plan = {
            "goalTitle": goal,
            "totalDays": totals["total_days"],
            "monthlyTasks": [],
            "weeklyTasks": [],
            "dailyTasks": []
        }
        
        if totals["total_months"] > 0:
            monthly_themes = [
                ["Foundation and Environment Setup", "Basic Concepts and Syntax"],
                ["Intermediate Concepts and Patterns", "Hands-on Practice Projects"],
                ["Advanced Topics and Frameworks", "Real-world Applications"],
                ["Mastery and Optimization", "Portfolio and Interview Prep"],
                ["Specialization Areas", "Industry Best Practices"],
                ["Expert-level Challenges", "Teaching and Mentoring"]
            ]
            
            for month_num in range(totals["total_months"]):
                theme_idx = month_num % len(monthly_themes)
                plan["monthlyTasks"].append({
                    "label": f"Month {month_num + 1}",
                    "tasks": [
                        f"{monthly_themes[theme_idx][0]} for {goal}",
                        f"{monthly_themes[theme_idx][1]} in {goal}"
                    ],
                    "status": False
                })
        
        if totals["total_weeks"] > 0:
            if subject_category in self.detailed_curricula:
                weekly_concepts = self.detailed_curricula[subject_category]
            else:
                weekly_concepts = [f"Week {i+1} Advanced {goal} Topics" for i in range(totals["total_weeks"])]
            
            extended_weekly = weekly_concepts * ((totals["total_weeks"] // len(weekly_concepts)) + 1)
            
            for week_num in range(totals["total_weeks"]):
                concept_idx = week_num % len(extended_weekly)
                practice_type = ["exercises", "projects", "challenges", "implementations", "optimizations"][week_num % 5]
                
                plan["weeklyTasks"].append({
                    "label": f"Week {week_num + 1}",
                    "tasks": [
                        f"Master {extended_weekly[concept_idx].lower()}",
                        f"Complete {practice_type} for {extended_weekly[concept_idx].lower()}"
                    ],
                    "status": False
                })
        
        daily_tasks = self.create_unique_daily_tasks(goal, subject_category, totals["total_days"])
        
        for day_num, task in enumerate(daily_tasks):
            plan["dailyTasks"].append({
                "label": f"Day {day_num + 1}",
                "tasks": [task],
                "status": False
            })
        
        return plan
    
    def generate_learning_plan(self, goal: str, duration: str) -> Dict[str, Any]:
        
        print(f"Generating plan for goal: {goal}, duration: {duration}")
        
        duration_dict = self.parse_duration(duration)
        totals = self.calculate_totals(duration_dict)
        
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
                json_response = self.clean_json_response(raw_response)
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
                        return self.validate_plan_structure(plan)
                    else:
                        print(f"Plan structure invalid - Expected: {totals['total_days']} daily, {totals['total_weeks']} weekly, {totals['total_months']} monthly")
                        print(f"Got: {len(plan.get('dailyTasks', []))} daily, {len(plan.get('weeklyTasks', []))} weekly, {len(plan.get('monthlyTasks', []))} monthly")
                        
                except json.JSONDecodeError as e:
                    print(f"JSON parsing failed on attempt {attempt + 1}: {e}")
                    print(f"Problematic JSON: {json_response[:500]}")
                    
            except Exception as e:
                print(f"Error on attempt {attempt + 1}: {e}")
        
        print("All LLM attempts failed, using intelligent fallback")
        return self.create_intelligent_fallback_plan(goal, duration)
    
    def validate_plan_structure(self, plan: Dict[str, Any]) -> Dict[str, Any]:
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