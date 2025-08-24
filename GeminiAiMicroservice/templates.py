from langchain.prompts import PromptTemplate

LEARNING_PLAN_PROMPT = """
You are an expert learning plan generator. Create a detailed, progressive, and practical learning plan for the given goal and duration.

Goal: {goal}
Duration: {duration}
Total Days: {total_days}
Total Weeks: {total_weeks}
Total Months: {total_months}

IMPORTANT REQUIREMENTS:
1. Create EXACTLY {total_days} daily tasks, {total_weeks} weekly tasks, and {total_months} monthly tasks
2. Make each task specific, actionable, and progressive
3. Avoid generic phrases like "learn fundamentals" or "study basics"
4. Include specific projects, exercises, and practical applications
5. Each task should build upon previous tasks
6. Use concrete examples and real-world applications

TASK SPECIFICITY GUIDELINES:
- Instead of "Learn arrays", use "Implement dynamic array resizing and practice with 3 LeetCode problems"
- Instead of "Study React basics", use "Build a todo app with add/delete functionality using useState and event handlers"
- Instead of "Practice Python", use "Create a web scraper for job listings using BeautifulSoup and requests"
- Instead of "Learn databases", use "Design and implement a user authentication system with SQLite"

For the subject matter, focus on:
- Hands-on coding exercises with specific goals
- Real projects that demonstrate skills
- Industry-relevant tools and practices
- Problem-solving scenarios
- Portfolio-building activities

Return the response in this exact JSON format:
{{
    "goalTitle": "{goal}",
    "totalDays": {total_days},
    "monthlyTasks": [
        {{
            "label": "Month 1",
            "tasks": ["Specific task 1", "Specific task 2"],
            "status": false
        }}
    ],
    "weeklyTasks": [
        {{
            "label": "Week 1", 
            "tasks": ["Specific weekly task 1", "Specific weekly task 2"],
            "status": false
        }}
    ],
    "dailyTasks": [
        {{
            "label": "Day 1",
            "tasks": ["One specific, actionable daily task"],
            "status": false
        }}
    ]
}}

Make sure:
- Each daily task is unique and progressive
- Weekly tasks group related daily activities
- Monthly tasks represent major milestones
- All tasks are specific and avoid generic "study" or "learn" language
- Tasks include actual projects, coding exercises, or concrete deliverables
"""

SUBJECT_SPECIFIC_EXAMPLES = {
    "dsa": """
Example good daily tasks for DSA:
- "Solve 3 array problems focusing on two-pointer technique: Container With Most Water, Trapping Rain Water, and 3Sum"
- "Implement a hash table from scratch with separate chaining and test with collision scenarios"
- "Build a binary search tree class with insert, delete, and find operations, then solve 5 BST problems"
- "Create a graph adjacency list representation and implement DFS to detect cycles in directed graphs"
- "Master dynamic programming with the classic 0/1 Knapsack problem and 3 similar optimization problems"
""",
    
    "react": """
Example good daily tasks for React:
- "Build a weather app component that fetches data from OpenWeatherMap API and displays current conditions"
- "Create a multi-step form with validation: user details, preferences, and confirmation with progress indicator"
- "Implement a shopping cart with add/remove items, quantity updates, and persistent storage using localStorage"
- "Build a real-time chat interface using WebSocket connections and manage message state with useReducer"
- "Create a dashboard with interactive charts using recharts library and filter data by date ranges"
""",
    
    "python": """
Example good daily tasks for Python:
- "Build a personal expense tracker that reads CSV files, categorizes expenses, and generates monthly reports"
- "Create a web scraper for job listings using BeautifulSoup, handle pagination, and save results to JSON"
- "Develop a password manager CLI tool with encryption using cryptography library and secure storage"
- "Build a REST API for a bookstore using Flask, implement CRUD operations, and add JWT authentication"
- "Create a data analysis script for sales data using pandas, generate visualizations with matplotlib"
"""
}

def get_enhanced_prompt(goal: str, duration: str, total_days: int, total_weeks: int, total_months: int) -> str:
    """Get enhanced prompt with subject-specific examples"""
    
    # Detect subject and add specific examples
    goal_lower = goal.lower()
    subject_examples = ""
    
    if any(keyword in goal_lower for keyword in ['algorithm', 'data structure', 'dsa', 'coding', 'leetcode']):
        subject_examples = SUBJECT_SPECIFIC_EXAMPLES["dsa"]
    elif any(keyword in goal_lower for keyword in ['react', 'jsx', 'frontend', 'component']):
        subject_examples = SUBJECT_SPECIFIC_EXAMPLES["react"]
    elif any(keyword in goal_lower for keyword in ['python', 'django', 'flask']):
        subject_examples = SUBJECT_SPECIFIC_EXAMPLES["python"]
    
    enhanced_prompt = LEARNING_PLAN_PROMPT.format(
        goal=goal,
        duration=duration,
        total_days=total_days,
        total_weeks=total_weeks,
        total_months=total_months
    )
    
    if subject_examples:
        enhanced_prompt += f"\n\nSUBJECT-SPECIFIC EXAMPLES:\n{subject_examples}"
        enhanced_prompt += "\n\nUse similar specific, actionable language for all tasks in your response."
    
    return enhanced_prompt