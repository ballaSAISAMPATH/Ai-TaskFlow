import json
import re
from typing import Dict, Any, List, Tuple
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
        
        # Enhanced detailed curricula with specific, actionable tasks
        self.detailed_curricula = {
            "dsa": {
                "topics": [
                    "Arrays and String Manipulation", "Two Pointers and Sliding Window", "Linked Lists Operations",
                    "Stacks and Queues", "Recursion and Backtracking", "Binary Trees Fundamentals",
                    "Binary Search Trees", "Tree Traversals", "Heaps and Priority Queues", "Hash Tables",
                    "Graph Representation", "Graph Traversals (BFS/DFS)", "Shortest Path Algorithms",
                    "Dynamic Programming Basics", "1D DP Problems", "2D DP Problems", "Advanced DP Patterns",
                    "Greedy Algorithms", "Bit Manipulation", "Trie Data Structure", "Union Find",
                    "Advanced Graph Algorithms", "String Algorithms", "Mathematical Algorithms", "System Design"
                ],
                "practical_tasks": [
                    "Solve 3 easy array problems on LeetCode focusing on two-pointer technique",
                    "Implement a hash table from scratch using separate chaining",
                    "Build a binary search tree with insert, delete, and search operations",
                    "Create a graph class and implement BFS/DFS traversal algorithms",
                    "Solve the classic 0/1 Knapsack problem using dynamic programming",
                    "Implement Dijkstra's algorithm for shortest path finding",
                    "Code a trie data structure for autocomplete functionality",
                    "Practice 5 medium-level recursion problems with backtracking",
                    "Build a min-heap and max-heap with heapify operations",
                    "Solve string matching problems using KMP algorithm"
                ],
                "projects": [
                    "Build a simple text editor with undo/redo using stacks",
                    "Create a maze solver using BFS algorithm",
                    "Implement a basic compiler's symbol table using hash tables",
                    "Build a family tree application using tree data structures"
                ]
            },
            "react": {
                "topics": [
                    "React Environment Setup", "JSX Syntax and Components", "Props and State Management",
                    "Event Handling", "Conditional Rendering", "Lists and Keys", "Forms and Inputs",
                    "Component Lifecycle", "useEffect Hook", "useState Hook", "Custom Hooks",
                    "Context API", "React Router", "State Management with Redux", "HTTP Requests and APIs",
                    "Error Boundaries", "Performance Optimization", "Code Splitting", "Testing with Jest",
                    "Styled Components", "Material-UI Integration", "TypeScript with React", 
                    "Next.js Fundamentals", "Server-side Rendering", "Static Site Generation"
                ],
                "practical_tasks": [
                    "Build a counter app with increment/decrement functionality using useState",
                    "Create a todo list with add, delete, and mark complete features",
                    "Implement a weather app that fetches data from OpenWeatherMap API",
                    "Build a product catalog with search and filter functionality",
                    "Create a multi-step form with validation and progress indicator",
                    "Develop a shopping cart with add/remove items and total calculation",
                    "Build a blog interface with post creation and comment system",
                    "Implement user authentication with login/logout functionality",
                    "Create a dashboard with charts using recharts library",
                    "Build a real-time chat interface using WebSocket connection"
                ],
                "projects": [
                    "Build a complete e-commerce storefront with product listing and checkout",
                    "Create a social media dashboard with post feeds and interactions",
                    "Develop a project management tool with task boards and team collaboration",
                    "Build a personal finance tracker with expense categorization and reports"
                ]
            },
            "python": {
                "topics": [
                    "Python Environment Setup", "Variables and Data Types", "Control Structures",
                    "Functions and Scope", "Lists and Tuples", "Dictionaries and Sets", "String Methods",
                    "File Handling", "Exception Handling", "Object-Oriented Programming", "Classes and Objects",
                    "Inheritance and Polymorphism", "Modules and Packages", "Lambda Functions", "Decorators",
                    "Generators and Iterators", "Regular Expressions", "Working with APIs", "Database Integration",
                    "Web Scraping", "GUI Development", "Testing with pytest", "Virtual Environments", "Deployment"
                ],
                "practical_tasks": [
                    "Build a personal expense tracker that reads/writes CSV files",
                    "Create a web scraper for job listings using BeautifulSoup",
                    "Develop a password manager with encryption using cryptography library",
                    "Build a REST API for a bookstore using Flask and SQLAlchemy",
                    "Create a data analysis script for sales data using pandas",
                    "Implement a file organizer that sorts files by type and date",
                    "Build a weather CLI app that fetches data from weather APIs",
                    "Create a basic chatbot using natural language processing",
                    "Develop a stock price analyzer with visualization using matplotlib",
                    "Build a automated email sender for newsletters using smtplib"
                ],
                "projects": [
                    "Create a complete blog system with user management and post CRUD operations",
                    "Build a inventory management system for small businesses",
                    "Develop a machine learning model for house price prediction",
                    "Create a social media automation tool for content scheduling"
                ]
            },
            "javascript": {
                "topics": [
                    "JavaScript Fundamentals", "ES6+ Features", "DOM Manipulation", "Event Handling",
                    "Asynchronous Programming", "Promises and Async/Await", "Fetch API", "Local Storage",
                    "Object-Oriented Programming", "Functional Programming", "Closures and Scope",
                    "Prototypes and Inheritance", "Modules", "Error Handling", "Testing with Jest"
                ],
                "practical_tasks": [
                    "Build a interactive calculator with keyboard support",
                    "Create a image carousel with auto-play and manual navigation",
                    "Develop a quiz application with timer and score tracking",
                    "Build a expense tracker that persists data in localStorage",
                    "Create a drag-and-drop task board interface",
                    "Implement a search autocomplete feature with debouncing",
                    "Build a photo gallery with lightbox functionality",
                    "Create a real-time clock with multiple timezone support",
                    "Develop a form validator with custom validation rules",
                    "Build a memory card game with flip animations"
                ],
                "projects": [
                    "Create a complete note-taking application with rich text editing",
                    "Build a music player with playlist management",
                    "Develop a browser-based drawing application",
                    "Create a budget planning tool with visual charts"
                ]
            }
        }
    
    def detect_subject_category(self, goal: str) -> str:
        goal_lower = goal.lower()
        
        # Direct keyword matching
        for key in self.detailed_curricula.keys():
            if key in goal_lower:
                return key
        
        # Context-based detection
        if any(keyword in goal_lower for keyword in ['algorithm', 'data structure', 'coding', 'leetcode', 'competitive programming']):
            return "dsa"
        elif any(keyword in goal_lower for keyword in ['python', 'django', 'flask', 'fastapi', 'pandas']):
            return "python"
        elif any(keyword in goal_lower for keyword in ['react', 'jsx', 'frontend', 'component', 'nextjs']):
            return "react"
        elif any(keyword in goal_lower for keyword in ['javascript', 'js', 'nodejs', 'express', 'dom']):
            return "javascript"
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
    
    def create_progressive_daily_tasks(self, goal: str, category: str, num_days: int) -> List[str]:
        """Create progressive, specific daily tasks based on the learning goal"""
        
        if category == "general":
            return self.create_general_tasks(goal, num_days)
        
        curriculum = self.detailed_curricula[category]
        topics = curriculum["topics"]
        practical_tasks = curriculum["practical_tasks"]
        projects = curriculum.get("projects", [])
        
        daily_tasks = []
        
        # Phase-based learning approach
        foundation_phase = max(1, num_days // 4)  # First 25% - fundamentals
        building_phase = max(1, num_days // 3)    # Next 33% - practical application
        advanced_phase = max(1, num_days // 4)    # Next 25% - advanced concepts
        project_phase = num_days - foundation_phase - building_phase - advanced_phase  # Final phase - projects
        
        day_counter = 0
        
        # Foundation Phase
        for day in range(foundation_phase):
            if day < len(topics):
                topic = topics[day]
                daily_tasks.append(f"Learn and understand {topic.lower()} - read documentation and watch tutorials")
            else:
                topic_idx = day % len(topics)
                daily_tasks.append(f"Review and practice {topics[topic_idx].lower()} with hands-on exercises")
            day_counter += 1
        
        # Building Phase - Practical Tasks
        for day in range(building_phase):
            if day < len(practical_tasks):
                daily_tasks.append(practical_tasks[day])
            else:
                task_idx = day % len(practical_tasks)
                daily_tasks.append(f"Enhance previous work: {practical_tasks[task_idx].lower()}")
            day_counter += 1
        
        # Advanced Phase
        for day in range(advanced_phase):
            topic_idx = (day + len(topics) // 2) % len(topics)
            advanced_aspects = ["optimization", "edge cases", "scalability", "best practices", "performance"]
            aspect = advanced_aspects[day % len(advanced_aspects)]
            daily_tasks.append(f"Master advanced {aspect} in {topics[topic_idx].lower()}")
            day_counter += 1
        
        # Project Phase
        for day in range(project_phase):
            if day < len(projects):
                daily_tasks.append(f"Work on project: {projects[day]}")
            elif day < len(projects) * 2:
                project_idx = (day - len(projects)) % len(projects)
                daily_tasks.append(f"Refine and add features to: {projects[project_idx]}")
            else:
                daily_tasks.append(f"Create portfolio documentation and deploy your {category} projects")
        
        return daily_tasks
    
    def create_general_tasks(self, goal: str, num_days: int) -> List[str]:
        """Create tasks for subjects not in our detailed curriculum"""
        
        # Extract the main subject from the goal
        subject = goal.replace("Learn ", "").replace("learn ", "").strip()
        
        learning_phases = [
            f"Research and understand what {subject} is and its applications",
            f"Set up development environment and tools for {subject}",
            f"Learn basic syntax and fundamental concepts of {subject}",
            f"Practice simple exercises and tutorials in {subject}",
            f"Build your first small project using {subject}",
            f"Study intermediate concepts and design patterns in {subject}",
            f"Implement a medium-complexity project with {subject}",
            f"Learn advanced features and optimization techniques",
            f"Contribute to open-source {subject} projects or create your own",
            f"Build a portfolio project showcasing your {subject} skills"
        ]
        
        # Distribute phases across available days
        tasks_per_phase = max(1, num_days // len(learning_phases))
        daily_tasks = []
        
        for phase_idx, base_task in enumerate(learning_phases):
            for day_in_phase in range(tasks_per_phase):
                if len(daily_tasks) >= num_days:
                    break
                    
                if day_in_phase == 0:
                    daily_tasks.append(base_task)
                else:
                    variations = [
                        f"Continue {base_task.lower()} - focus on practical application",
                        f"Deepen your understanding: {base_task.lower()}",
                        f"Practice and reinforce: {base_task.lower()}",
                        f"Apply what you learned: {base_task.lower()}"
                    ]
                    daily_tasks.append(variations[day_in_phase % len(variations)])
        
        # Fill remaining days if needed
        while len(daily_tasks) < num_days:
            remaining_days = num_days - len(daily_tasks)
            if remaining_days > 5:
                daily_tasks.append(f"Work on capstone project: comprehensive {subject} application")
            else:
                daily_tasks.append(f"Review, practice, and prepare for next steps in {subject}")
        
        return daily_tasks[:num_days]
    
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
        
        # Create monthly tasks with specific themes
        if totals["total_months"] > 0:
            if subject_category in self.detailed_curricula:
                curriculum = self.detailed_curricula[subject_category]
                topics = curriculum["topics"]
                
                monthly_themes = [
                    ["Foundation and Setup", "Basic Concepts and Syntax"],
                    ["Core Concepts and Patterns", "Hands-on Practice Projects"],
                    ["Advanced Topics and Frameworks", "Real-world Applications"],
                    ["Mastery and Optimization", "Portfolio and Interview Prep"],
                    ["Specialization Areas", "Industry Best Practices"],
                    ["Expert-level Challenges", "Teaching and Mentoring"]
                ]
                
                for month_num in range(totals["total_months"]):
                    theme_idx = month_num % len(monthly_themes)
                    
                    # Use specific topics from curriculum
                    topics_for_month = topics[month_num * 4:(month_num + 1) * 4] if month_num * 4 < len(topics) else topics[-4:]
                    
                    plan["monthlyTasks"].append({
                        "label": f"Month {month_num + 1}",
                        "tasks": [
                            f"Master {', '.join(topics_for_month[:2]).lower()}",
                            f"Build projects using {', '.join(topics_for_month[2:]).lower()}"
                        ],
                        "status": False
                    })
            else:
                # Generic monthly structure for unknown subjects
                subject = goal.replace("Learn ", "").replace("learn ", "").strip()
                plan["monthlyTasks"].append({
                    "label": "Month 1",
                    "tasks": [
                        f"Master fundamentals and core concepts of {subject}",
                        f"Complete beginner-level projects in {subject}"
                    ],
                    "status": False
                })
        
        # Create weekly tasks with curriculum-specific content
        if totals["total_weeks"] > 0:
            if subject_category in self.detailed_curricula:
                curriculum = self.detailed_curricula[subject_category]
                topics = curriculum["topics"]
                practical_tasks = curriculum["practical_tasks"]
                
                for week_num in range(totals["total_weeks"]):
                    # Alternate between learning topics and practical application
                    if week_num % 2 == 0 and week_num // 2 < len(topics):
                        topic = topics[week_num // 2]
                        plan["weeklyTasks"].append({
                            "label": f"Week {week_num + 1}",
                            "tasks": [
                                f"Learn and understand {topic.lower()}",
                                f"Complete exercises and tutorials on {topic.lower()}"
                            ],
                            "status": False
                        })
                    elif (week_num - 1) // 2 < len(practical_tasks):
                        task = practical_tasks[(week_num - 1) // 2]
                        plan["weeklyTasks"].append({
                            "label": f"Week {week_num + 1}",
                            "tasks": [
                                task,
                                f"Test, debug and refine your implementation"
                            ],
                            "status": False
                        })
                    else:
                        # Fallback for extra weeks
                        plan["weeklyTasks"].append({
                            "label": f"Week {week_num + 1}",
                            "tasks": [
                                f"Advanced practice and portfolio building",
                                f"Review and consolidate your {goal.lower()} knowledge"
                            ],
                            "status": False
                        })
        
        # Create daily tasks using the enhanced progressive system
        daily_tasks = self.create_progressive_daily_tasks(goal, subject_category, totals["total_days"])
        
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