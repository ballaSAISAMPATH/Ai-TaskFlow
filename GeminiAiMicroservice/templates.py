# templates.py

def get_enhanced_personalized_prompt(goal: str, duration: str, total_days: int, total_weeks: int, total_months: int, 
                                    subject_category: str, user_context: dict, attempt_number: int = 1) -> str:
    """Generate highly personalized and dynamic learning plan prompt"""
    
    # Base personalized prompt
    base_prompt = f"""
You are an expert learning coach creating a HIGHLY PERSONALIZED learning plan.

LEARNING GOAL: {goal}
DURATION: {duration} ({total_days} days, {total_weeks} weeks, {total_months} months)
SUBJECT CATEGORY: {subject_category}

USER PROFILE:
- Current Skill Level: {user_context.get('skill_level', 'beginner')}
- Learning Style: {user_context.get('learning_style', 'practical')}
- Available Time: {user_context.get('daily_time', '1-2 hours')} per day
- Specific Interests: {', '.join(user_context.get('specific_interests', ['general application']))}
- Practical Goals: {', '.join(user_context.get('practical_goals', ['skill development']))}

CRITICAL REQUIREMENTS:
1. Create EXACTLY {total_days} daily tasks, {total_weeks} weekly tasks, and {total_months} monthly tasks
2. Each task must be HYPER-SPECIFIC and actionable for {user_context.get('skill_level', 'beginner')} level
3. NO generic phrases like "learn basics", "study fundamentals", "practice concepts"
4. Every task must include specific deliverables, metrics, or outcomes
5. Tasks should build progressively based on {user_context.get('learning_style', 'practical')} learning style
6. Consider {user_context.get('daily_time', '1-2 hours')} daily time constraint

SPECIFICITY EXAMPLES FOR {subject_category.upper()}:
{get_subject_specific_examples(subject_category, user_context)}

PERSONALIZATION REQUIREMENTS:
- Adapt difficulty to {user_context.get('skill_level', 'beginner')} level
- Focus on {user_context.get('learning_style', 'practical')} learning approach
- Include tasks that align with: {', '.join(user_context.get('specific_interests', []))}
- Design tasks achievable in {user_context.get('daily_time', '1-2 hours')} daily time slots
- Connect learning to practical goals: {', '.join(user_context.get('practical_goals', []))}

TASK STRUCTURE REQUIREMENTS:
Daily Tasks: Each must be a single, specific action with clear completion criteria
Weekly Tasks: Each should have 2-3 specific sub-tasks that group daily activities
Monthly Tasks: Each should have 2-4 major milestone tasks representing significant progress

JSON FORMAT (EXACT STRUCTURE REQUIRED):
{{
    "goalTitle": "{goal}",
    "totalDays": {total_days},
    "monthlyTasks": [
        {{"label": "Month 1", "tasks": ["Specific milestone task 1", "Specific milestone task 2"], "status": false}}
    ],
    "weeklyTasks": [
        {{"label": "Week 1", "tasks": ["Specific weekly task 1", "Specific weekly task 2"], "status": false}}
    ],
    "dailyTasks": [
        {{"label": "Day 1", "tasks": ["One specific daily task with clear completion criteria"], "status": false}}
    ]
}}

AVOID AT ALL COSTS:
- "Learn the basics of..."
- "Study fundamentals..."
- "Practice concepts..."
- "Understand principles..."
- "Get familiar with..."
- "Review materials..."
- Any generic or vague language

MAKE IT ULTRA-SPECIFIC:
- Include exact numbers, tools, resources
- Specify what will be built, created, or accomplished
- Define measurable outcomes
- Reference specific techniques, methods, or approaches
- Connect to real-world applications
"""

    # Add retry-specific adjustments
    if attempt_number > 1:
        base_prompt += f"""

RETRY ATTEMPT #{attempt_number}:
The previous attempt failed. Make this response even MORE SPECIFIC and DETAILED.
- Add specific tool names, version numbers, exact quantities
- Include precise time estimates for each task
- Specify exact deliverables and success metrics
- Use domain-specific terminology appropriately
- Make every task immediately actionable without additional research
"""

    return base_prompt


def get_subject_specific_examples(subject_category: str, user_context: dict) -> str:
    """Get tailored examples based on subject and user context"""
    
    skill_level = user_context.get('skill_level', 'beginner')
    learning_style = user_context.get('learning_style', 'practical')
    
    examples = {
        "dsa": {
            "beginner": {
                "practical": """
- "Solve Array Problem #1: Two Sum using hash map approach, implement in Python, test with 5 different inputs"
- "Build a simple linked list class with insert(), delete(), display() methods and create test cases for edge conditions"
- "Implement binary search algorithm from scratch, compare performance with linear search using 1000+ element arrays"
- "Create a stack using Python lists, then use it to solve the Valid Parentheses problem with 10 test cases"
- "Design and implement a basic hash table with collision handling using separate chaining method"
""",
                "theoretical": """
- "Study and document time complexity of 5 sorting algorithms with mathematical proofs and comparison charts"
- "Analyze space complexity of recursive vs iterative solutions for factorial, Fibonacci, and tree traversal"
- "Create visual diagrams explaining how bubble sort works step-by-step with 10-element array example"
- "Research and compare different collision resolution techniques in hash tables with pros/cons analysis"
- "Write detailed explanation of why quicksort average case is O(n log n) with mathematical derivation"
"""
            },
            "intermediate": {
                "practical": """
- "Solve 5 medium-difficulty tree problems: validate BST, lowest common ancestor, serialize/deserialize, path sum variations"
- "Implement advanced graph algorithms: Dijkstra's shortest path and A* search for pathfinding applications"
- "Build a complete trie data structure and use it to solve word search, auto-complete, and spell checker problems"
- "Create dynamic programming solutions for 0/1 knapsack, longest common subsequence, and edit distance problems"
- "Design and implement a LRU cache using doubly linked list and hash map with O(1) operations"
"""
            }
        },
        "react": {
            "beginner": {
                "practical": """
- "Create a counter app with increment/decrement buttons using useState hook, style with CSS modules"
- "Build a todo list with add/delete functionality, local storage persistence, and input validation"
- "Develop a weather dashboard fetching OpenWeatherMap API data with loading states and error handling"
- "Create a multi-step registration form with validation, progress indicator, and form state management"
- "Build a simple e-commerce product catalog with filtering, search, and cart functionality using useContext"
""",
                "project-based": """
- "Build a complete personal portfolio website with React Router, responsive design, and contact form integration"
- "Create a social media dashboard aggregating Twitter and Instagram APIs with real-time updates"
- "Develop a task management app with drag-and-drop functionality using react-beautiful-dnd library"
- "Build a real-time chat application using Socket.io with rooms, typing indicators, and message persistence"
- "Create a data visualization dashboard using D3.js integration showing COVID-19 statistics with interactive charts"
"""
            }
        },
        "python": {
            "beginner": {
                "practical": """
- "Build a expense tracker CLI that reads CSV files, categorizes expenses, and generates monthly reports with charts"
- "Create a web scraper for job listings using BeautifulSoup, handle pagination, save to JSON with error handling"
- "Develop a password manager with encryption using cryptography library, secure file storage, and CLI interface"
- "Build a weather API wrapper class with caching, rate limiting, and data validation using requests library"
- "Create a file organizer script that sorts downloads folder by file type, date, and size with progress bars"
"""
            }
        },
        "hindi": {
            "beginner": {
                "practical": """
- "Practice writing 30 Devanagari characters daily with stroke order, pronunciation, and 2 example words each"
- "Learn 15 essential greetings and introductions, practice with native speaker via HelloTalk app for 20 minutes"
- "Master 25 family relationship terms, create family tree with Hindi labels, practice with audio recordings"
- "Watch 10-minute Bollywood movie clip, identify 20 new words, create flashcards with context sentences"
- "Practice daily routine vocabulary: write 100-word paragraph about your morning routine in Hindi with proper verb forms"
"""
            }
        },
        "fitness": {
            "beginner": {
                "practical": """
- "Complete 20-minute full-body workout: 3 sets of 10 push-ups, 15 squats, 30-second plank, track form and progress"
- "Walk 5000 steps daily, track with fitness app, note energy levels and mood changes in workout journal"
- "Learn proper form for 5 basic exercises using YouTube tutorials, practice with bodyweight, film yourself for form check"
- "Create meal prep plan with 1500 calories, 30% protein, log everything in MyFitnessPal for accuracy tracking"
- "Do 15-minute morning stretching routine targeting hip flexors, hamstrings, and shoulders with mobility assessment"
"""
            }
        },
        "cooking": {
            "beginner": {
                "practical": """
- "Master knife skills: practice julienne cuts with 2 carrots, dice 1 onion perfectly, chiffonade 5 basil leaves"
- "Cook perfect scrambled eggs using 3 different techniques: French, American, and Gordon Ramsay's method"
- "Bake basic white bread from scratch understanding gluten development, proper kneading, and fermentation timing"
- "Prepare homemade pasta dough, roll by hand, create 3 shapes: fettuccine, ravioli, and gnocchi"
- "Learn mother sauces: make béchamel, velouté, and hollandaise from scratch with proper consistency and seasoning"
"""
            }
        }
    }
    
    # Get specific examples based on subject, skill level, and learning style
    if subject_category in examples:
        subject_examples = examples[subject_category]
        if skill_level in subject_examples:
            level_examples = subject_examples[skill_level]
            if learning_style in level_examples:
                return level_examples[learning_style]
            else:
                # Return first available style for the skill level
                return list(level_examples.values())[0]
        else:
            # Return beginner examples if skill level not found
            beginner_examples = subject_examples.get('beginner', {})
            if learning_style in beginner_examples:
                return beginner_examples[learning_style]
            else:
                return list(beginner_examples.values())[0] if beginner_examples else ""
    
    # Generic examples for unknown subjects
    return f"""
- "Research and identify 5 specific tools/resources used by professionals in {subject_category}"
- "Complete hands-on tutorial creating tangible deliverable relevant to {subject_category}"
- "Practice core skill for 45 minutes with specific technique, document progress and challenges"
- "Build mini-project applying 3 key concepts learned, share with community for feedback"
- "Connect with 2 professionals in {subject_category} field via LinkedIn, ask specific questions about daily work"
"""


# Legacy support - keeping the old function for backward compatibility
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
"""

def get_enhanced_prompt(goal: str, duration: str, total_days: int, total_weeks: int, total_months: int) -> str:
    """Legacy function - redirects to new personalized prompt"""
    return get_enhanced_personalized_prompt(
        goal, duration, total_days, total_weeks, total_months,
        "general", {"skill_level": "beginner", "learning_style": "practical"}, 1
    )