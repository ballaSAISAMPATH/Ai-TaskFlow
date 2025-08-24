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
        
        # Comprehensive curricula covering all major learning categories
        self.detailed_curricula = {
            # Programming & Tech
            "dsa": {
                "topics": ["Arrays and String Manipulation", "Two Pointers and Sliding Window", "Linked Lists Operations", "Stacks and Queues", "Recursion and Backtracking", "Binary Trees Fundamentals", "Binary Search Trees", "Tree Traversals", "Heaps and Priority Queues", "Hash Tables", "Graph Representation", "Graph Traversals (BFS/DFS)", "Shortest Path Algorithms", "Dynamic Programming Basics", "1D DP Problems", "2D DP Problems", "Advanced DP Patterns", "Greedy Algorithms", "Bit Manipulation", "Trie Data Structure", "Union Find", "Advanced Graph Algorithms", "String Algorithms", "Mathematical Algorithms", "System Design"],
                "practical_tasks": ["Solve 3 easy array problems on LeetCode focusing on two-pointer technique", "Implement a hash table from scratch using separate chaining", "Build a binary search tree with insert, delete, and search operations", "Create a graph class and implement BFS/DFS traversal algorithms", "Solve the classic 0/1 Knapsack problem using dynamic programming", "Implement Dijkstra's algorithm for shortest path finding", "Code a trie data structure for autocomplete functionality", "Practice 5 medium-level recursion problems with backtracking", "Build a min-heap and max-heap with heapify operations", "Solve string matching problems using KMP algorithm"],
                "projects": ["Build a simple text editor with undo/redo using stacks", "Create a maze solver using BFS algorithm", "Implement a basic compiler's symbol table using hash tables", "Build a family tree application using tree data structures"]
            },
            "react": {
                "topics": ["React Environment Setup", "JSX Syntax and Components", "Props and State Management", "Event Handling", "Conditional Rendering", "Lists and Keys", "Forms and Inputs", "Component Lifecycle", "useEffect Hook", "useState Hook", "Custom Hooks", "Context API", "React Router", "State Management with Redux", "HTTP Requests and APIs", "Error Boundaries", "Performance Optimization", "Code Splitting", "Testing with Jest", "Styled Components", "Material-UI Integration", "TypeScript with React", "Next.js Fundamentals", "Server-side Rendering", "Static Site Generation"],
                "practical_tasks": ["Build a counter app with increment/decrement functionality using useState", "Create a todo list with add, delete, and mark complete features", "Implement a weather app that fetches data from OpenWeatherMap API", "Build a product catalog with search and filter functionality", "Create a multi-step form with validation and progress indicator", "Develop a shopping cart with add/remove items and total calculation", "Build a blog interface with post creation and comment system", "Implement user authentication with login/logout functionality", "Create a dashboard with charts using recharts library", "Build a real-time chat interface using WebSocket connection"],
                "projects": ["Build a complete e-commerce storefront with product listing and checkout", "Create a social media dashboard with post feeds and interactions", "Develop a project management tool with task boards and team collaboration", "Build a personal finance tracker with expense categorization and reports"]
            },
            "python": {
                "topics": ["Python Environment Setup", "Variables and Data Types", "Control Structures", "Functions and Scope", "Lists and Tuples", "Dictionaries and Sets", "String Methods", "File Handling", "Exception Handling", "Object-Oriented Programming", "Classes and Objects", "Inheritance and Polymorphism", "Modules and Packages", "Lambda Functions", "Decorators", "Generators and Iterators", "Regular Expressions", "Working with APIs", "Database Integration", "Web Scraping", "GUI Development", "Testing with pytest", "Virtual Environments", "Deployment"],
                "practical_tasks": ["Build a personal expense tracker that reads/writes CSV files", "Create a web scraper for job listings using BeautifulSoup", "Develop a password manager with encryption using cryptography library", "Build a REST API for a bookstore using Flask and SQLAlchemy", "Create a data analysis script for sales data using pandas", "Implement a file organizer that sorts files by type and date", "Build a weather CLI app that fetches data from weather APIs", "Create a basic chatbot using natural language processing", "Develop a stock price analyzer with visualization using matplotlib", "Build a automated email sender for newsletters using smtplib"],
                "projects": ["Create a complete blog system with user management and post CRUD operations", "Build a inventory management system for small businesses", "Develop a machine learning model for house price prediction", "Create a social media automation tool for content scheduling"]
            },
            
            # Languages
            "hindi": {
                "topics": ["Devanagari Script Basics", "Vowels (स्वर) and Consonants (व्यंजन)", "Matras and Conjunct Characters", "Basic Vocabulary - Family and Body Parts", "Numbers and Time", "Common Verbs and Actions", "Present Tense Conjugation", "Past Tense Formation", "Future Tense Usage", "Questions and Negation", "Postpositions and Sentence Structure", "Formal vs Informal Speech", "Cultural Context and Idioms", "Reading Simple Stories", "Conversation Practice", "Advanced Grammar Rules", "Literary Hindi", "Regional Variations", "Business Hindi", "Hindi Cinema and Culture"],
                "practical_tasks": ["Practice writing 50 Devanagari characters with proper stroke order", "Learn and memorize 20 family relationship terms in Hindi", "Create flashcards for 100 most common Hindi words with pronunciation", "Practice conjugating 10 essential verbs in present tense", "Have a 5-minute conversation about daily routine in Hindi", "Read a simple Hindi children's story and summarize it", "Watch a Bollywood movie scene and identify 20 new vocabulary words", "Write a short paragraph about your hobbies in Hindi", "Practice listening to Hindi news for 10 minutes and note key points", "Compose and sing a simple Hindi song or poem"],
                "projects": ["Create a Hindi vocabulary journal with 500+ words", "Record yourself telling your life story in Hindi (10 minutes)", "Write and illustrate a children's book in Hindi", "Start a Hindi language learning blog or vlog"]
            },
            "english": {
                "topics": ["Grammar Fundamentals", "Parts of Speech", "Sentence Structure", "Tenses and Verb Forms", "Vocabulary Building", "Reading Comprehension", "Writing Skills", "Speaking and Pronunciation", "Listening Skills", "Idioms and Phrases", "Formal vs Informal English", "Business English", "Academic Writing", "Creative Writing", "Public Speaking", "Debate and Discussion", "Literature Appreciation", "Poetry and Prose", "Critical Thinking", "Communication Skills"],
                "practical_tasks": ["Read one English article daily and summarize key points", "Practice pronunciation using tongue twisters and difficult words", "Write a 500-word essay on a current topic", "Join online English conversation groups for 30 minutes", "Learn 10 new vocabulary words daily with example sentences", "Record yourself reading a news article and analyze pronunciation", "Write business emails for different scenarios", "Practice giving 5-minute presentations on various topics", "Complete grammar exercises focusing on common mistakes", "Watch English movies with subtitles and note new expressions"],
                "projects": ["Write a short story or novel chapter", "Create a podcast episode in English", "Deliver a 15-minute presentation on your expertise area", "Start an English language blog"]
            },
            
            # Creative Arts
            "photography": {
                "topics": ["Camera Basics and Types", "Exposure Triangle (Aperture, Shutter, ISO)", "Composition Rules and Techniques", "Lighting Fundamentals", "Portrait Photography", "Landscape Photography", "Street Photography", "Macro Photography", "Night Photography", "Color Theory in Photography", "Black and White Photography", "Post-Processing Basics", "Adobe Lightroom Essentials", "Photoshop for Photographers", "Equipment and Gear", "Photo Storytelling", "Commercial Photography", "Wedding Photography", "Photography Business", "Portfolio Development"],
                "practical_tasks": ["Take 50 photos practicing rule of thirds and leading lines", "Shoot a portrait session using natural light only", "Create a photo series documenting a day in your neighborhood", "Practice manual mode photography in different lighting conditions", "Edit 20 RAW photos using Lightroom with consistent style", "Shoot a golden hour landscape session focusing on composition", "Take macro photos of everyday objects using extension tubes or close-up filters", "Create a black and white photo essay on a social theme", "Practice long exposure photography for water and cloud movement", "Photograph the same subject in 10 different ways"],
                "projects": ["Create a 30-photo portfolio showcasing different styles", "Document a local event or festival through photography", "Start a photography challenge (365 project or weekly themes)", "Organize and exhibit your work in a local gallery or online platform"]
            },
            "music": {
                "topics": ["Music Theory Basics", "Notes, Scales, and Keys", "Rhythm and Time Signatures", "Intervals and Chords", "Melody and Harmony", "Instrument Techniques", "Ear Training", "Sight Reading", "Composition Basics", "Song Structure", "Recording Techniques", "Music Production", "Performance Skills", "Stage Presence", "Music Genres and Styles", "Music History", "Improvisation", "Ensemble Playing", "Music Business", "Teaching Music"],
                "practical_tasks": ["Practice scales daily for 15 minutes on your chosen instrument", "Learn to play 3 songs in different genres completely", "Compose a simple 8-bar melody using pentatonic scale", "Record yourself playing and analyze rhythm accuracy", "Practice sight-reading simple melodies for 10 minutes daily", "Jam with other musicians (online or in-person) once per week", "Learn 10 basic chord progressions and their variations", "Write lyrics for an original song", "Practice ear training with interval recognition exercises", "Perform one song publicly (open mic, video, or for friends)"],
                "projects": ["Compose and record an original song from start to finish", "Learn an entire album by your favorite artist", "Start a band or collaborate with other musicians", "Create a music teaching curriculum for beginners"]
            },
            
            # Exam Preparation
            "gate": {
                "topics": ["GATE Exam Pattern and Syllabus", "Engineering Mathematics", "General Aptitude", "Core Subject Fundamentals", "Previous Year Questions Analysis", "Time Management Strategies", "Mock Test Practice", "Weak Area Identification", "Formula Sheets Creation", "Numerical Problem Solving", "Theory Questions Mastery", "Calculator Usage Optimization", "Stress Management", "Revision Strategies", "Online Test Practice", "Answer Writing Techniques", "Negative Marking Strategies", "Last Month Preparation", "Exam Day Guidelines", "Result Analysis"],
                "practical_tasks": ["Solve 50 previous year GATE questions from each major topic", "Take a full-length mock test weekly and analyze performance", "Create formula sheets for Engineering Mathematics and core subjects", "Practice numerical problems with time constraints (2 minutes per problem)", "Solve 20 general aptitude questions daily", "Review and analyze mistakes from previous tests", "Practice calculator usage for complex calculations under time pressure", "Study one complete topic daily with theory and numerical problems", "Create and practice from your own question bank", "Join online test series and compete with other aspirants"],
                "projects": ["Create a comprehensive study plan with daily targets", "Develop a question bank with solutions for difficult topics", "Mentor junior students preparing for GATE", "Document your complete GATE preparation journey"]
            },
            "jee": {
                "topics": ["JEE Main and Advanced Pattern", "Physics Concepts and Applications", "Chemistry Theory and Numericals", "Mathematics Problem Solving", "Organic Chemistry Mechanisms", "Inorganic Chemistry Facts", "Calculus and Coordinate Geometry", "Mechanics and Thermodynamics", "Electrochemistry and Solutions", "Trigonometry and Complex Numbers", "Modern Physics", "Previous Year Analysis", "Mock Test Strategy", "Time Management", "Error Analysis", "Formula Memorization", "Conceptual Clarity", "Problem-Solving Speed", "Exam Psychology", "Result Analysis"],
                "practical_tasks": ["Solve 30 JEE problems daily (10 from each subject)", "Take subject-wise tests weekly and analyze weak areas", "Memorize important formulas using spaced repetition", "Practice drawing chemical structures and mechanisms quickly", "Solve complete physics numericals with proper steps", "Review NCERT textbooks and solve all exercises", "Practice mental math and approximation techniques", "Create and solve your own problems for difficult concepts", "Time yourself while solving previous year papers", "Teach concepts to classmates or younger students"],
                "projects": ["Create a comprehensive formula book with derivations", "Develop a peer study group with structured learning", "Document common mistakes and their solutions", "Create video explanations for difficult concepts"]
            },
            "upsc": {
                "topics": ["UPSC Syllabus and Exam Pattern", "Current Affairs and News Analysis", "Indian Polity and Constitution", "Indian Economy and Budget", "Geography - Physical and Human", "Indian History - Ancient to Modern", "Science and Technology Updates", "Environment and Ecology", "International Relations", "Ethics and Integrity", "Essay Writing Skills", "Answer Writing Practice", "Prelims Test Practice", "Mains Answer Structure", "Interview Preparation", "Optional Subject Mastery", "Public Administration", "Sociology", "Literature", "Medical Science"],
                "practical_tasks": ["Read 3 newspapers daily and create current affairs notes", "Write one 250-word essay daily on diverse topics", "Practice 100 prelims questions daily from different subjects", "Analyze and answer 5 mains questions weekly", "Study one complete topic from NCERT daily", "Create mind maps for complex topics like Indian economy", "Practice answer writing within word limits and time constraints", "Review government policies and their implications", "Study international events and their impact on India", "Practice mock interviews with diverse panels"],
                "projects": ["Create a comprehensive current affairs magazine", "Develop a study group with structured discussions", "Write detailed notes on complete UPSC syllabus", "Mentor other UPSC aspirants through online platforms"]
            },
            
            # Professional Skills
            "fitness": {
                "topics": ["Exercise Physiology", "Workout Planning", "Strength Training", "Cardiovascular Fitness", "Flexibility and Mobility", "Nutrition Basics", "Weight Management", "Injury Prevention", "Recovery and Rest", "Goal Setting", "Progress Tracking", "Equipment Usage", "Home Workouts", "Gym Etiquette", "Mental Health Benefits", "Sport-Specific Training", "Functional Fitness", "Balance and Coordination", "Endurance Building", "Lifestyle Integration"],
                "practical_tasks": ["Complete a 30-minute full-body workout targeting all major muscle groups", "Track daily food intake and calculate macronutrient ratios", "Learn proper form for 10 essential exercises (squats, push-ups, deadlifts, etc.)", "Complete a 5km run/walk and track time improvement", "Practice yoga or stretching routine for flexibility", "Plan and prep healthy meals for the entire week", "Measure body composition and fitness metrics monthly", "Try a new fitness activity (dance, martial arts, swimming)", "Complete a high-intensity interval training (HIIT) session", "Practice meditation or mindfulness for mental fitness"],
                "projects": ["Design a 12-week personal fitness transformation program", "Train for and complete a local 5K or 10K race", "Create and share fitness content on social media", "Achieve a specific fitness goal (pull-ups, marathon, weight loss)"]
            },
            "weight_loss": {
                "topics": ["Caloric Deficit Fundamentals", "Macronutrient Balance", "Meal Planning and Prep", "Portion Control Techniques", "Healthy Food Substitutions", "Cardio Exercise Planning", "Strength Training for Fat Loss", "Metabolism and BMR Understanding", "Hydration and Weight Loss", "Sleep Quality Impact", "Stress Management", "Progress Tracking Methods", "Plateaus and Solutions", "Sustainable Lifestyle Changes", "Emotional Eating Management", "Social Situations Navigation", "Long-term Maintenance", "Body Composition vs Scale Weight", "Supplementation Basics", "Medical Considerations"],
                "practical_tasks": ["Calculate your daily caloric needs and create a 500-calorie deficit plan", "Track all food intake for 7 days using a nutrition app with accurate weighing", "Plan and prep 21 healthy meals for the week with proper portion sizes", "Complete 4 cardio sessions this week: 2 HIIT and 2 steady-state sessions", "Learn to read nutrition labels and identify hidden calories in processed foods", "Replace 3 high-calorie foods with healthier alternatives in your regular diet", "Create a strength training routine targeting all major muscle groups 3x per week", "Establish a consistent sleep schedule of 7-9 hours to support weight loss", "Practice mindful eating techniques during 3 meals to improve portion awareness", "Take body measurements and progress photos in addition to weighing yourself"],
                "projects": ["Lose 1-2 pounds per week consistently for your target duration", "Create a personalized cookbook with 50 healthy, low-calorie recipes", "Document your weight loss journey through photos and measurements", "Build sustainable habits that maintain weight loss long-term"]
            },
            "cooking": {
                "topics": ["Kitchen Safety and Hygiene", "Basic Cooking Techniques", "Knife Skills", "Understanding Ingredients", "Flavor Pairing", "International Cuisines", "Baking Fundamentals", "Meal Planning", "Nutrition and Health", "Food Storage", "Kitchen Equipment", "Recipe Development", "Presentation Skills", "Cost-Effective Cooking", "Dietary Restrictions", "Preservation Techniques", "Fermentation", "Grilling and BBQ", "Dessert Making", "Professional Cooking"],
                "practical_tasks": ["Master knife skills by practicing julienne, dice, and chiffonade cuts", "Cook one dish from a different cuisine each week", "Bake bread from scratch using only basic ingredients", "Learn to cook perfect rice, pasta, and eggs using different methods", "Create a week's worth of meal prep in one cooking session", "Practice cooking without recipes using taste and intuition", "Learn food safety by properly storing and handling different ingredients", "Cook a complete three-course meal for friends or family", "Master one cooking technique thoroughly (grilling, braising, sautéing)", "Create your own spice blends and seasoning mixtures"],
                "projects": ["Document family recipes with photos and stories", "Start a cooking blog or YouTube channel", "Cater a small event or dinner party", "Complete a culinary challenge (30 recipes in 30 days)"]
            }
        }
    
    def detect_subject_category(self, goal: str) -> str:
        goal_lower = goal.lower()
        
        # Direct keyword matching for all subjects
        for key in self.detailed_curricula.keys():
            if key in goal_lower:
                return key
        
        # Context-based detection for programming
        if any(keyword in goal_lower for keyword in ['algorithm', 'data structure', 'coding', 'leetcode', 'competitive programming']):
            return "dsa"
        elif any(keyword in goal_lower for keyword in ['python', 'django', 'flask', 'fastapi', 'pandas']):
            return "python"
        elif any(keyword in goal_lower for keyword in ['react', 'jsx', 'frontend', 'component', 'nextjs']):
            return "react"
        
        # Context-based detection for languages
        elif any(keyword in goal_lower for keyword in ['हिंदी', 'hindi', 'devanagari']):
            return "hindi"
        elif any(keyword in goal_lower for keyword in ['english', 'grammar', 'vocabulary', 'speaking', 'writing']):
            return "english"
        
        # Context-based detection for creative arts
        elif any(keyword in goal_lower for keyword in ['photo', 'camera', 'photography', 'portrait', 'landscape']):
            return "photography"
        elif any(keyword in goal_lower for keyword in ['music', 'instrument', 'guitar', 'piano', 'singing', 'composition']):
            return "music"
        
        # Context-based detection for exams
        elif any(keyword in goal_lower for keyword in ['gate', 'graduate aptitude test', 'engineering entrance']):
            return "gate"
        elif any(keyword in goal_lower for keyword in ['jee', 'joint entrance', 'iit', 'nit']):
            return "jee"
        elif any(keyword in goal_lower for keyword in ['upsc', 'civil services', 'ias', 'ips', 'public service']):
            return "upsc"
        
        # Context-based detection for lifestyle
        elif any(keyword in goal_lower for keyword in ['fitness', 'workout', 'exercise', 'gym', 'health']):
            return "fitness"
        elif any(keyword in goal_lower for keyword in ['weight loss', 'lose weight', 'losing weight', 'weight reduction', 'fat loss', 'slim down', 'get lean']):
            return "weight_loss"
        elif any(keyword in goal_lower for keyword in ['cooking', 'recipe', 'chef', 'culinary', 'baking']):
            return "cooking"
        
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
        
        # Foundation Phase - Learning core concepts
        for day in range(foundation_phase):
            if day < len(topics):
                topic = topics[day]
                if category in ["hindi", "english"]:
                    daily_tasks.append(f"Master {topic.lower()} with writing practice and pronunciation drills")
                elif category in ["photography", "music"]:
                    daily_tasks.append(f"Learn and practice {topic.lower()} with hands-on exercises")
                elif category in ["gate", "jee", "upsc"]:
                    daily_tasks.append(f"Study {topic.lower()} thoroughly with notes and solve practice questions")
                elif category in ["fitness", "cooking"]:
                    daily_tasks.append(f"Learn and implement {topic.lower()} with practical application")
                else:
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
                daily_tasks.append(f"Enhance and expand on: {practical_tasks[task_idx].lower()}")
            day_counter += 1
        
        # Advanced Phase - Mastery and refinement
        for day in range(advanced_phase):
            topic_idx = (day + len(topics) // 2) % len(topics)
            if category in ["hindi", "english"]:
                advanced_aspects = ["fluency", "cultural context", "advanced grammar", "literature", "business communication"]
                aspect = advanced_aspects[day % len(advanced_aspects)]
                daily_tasks.append(f"Master advanced {aspect} in {topics[topic_idx].lower()}")
            elif category in ["photography", "music"]:
                advanced_aspects = ["professional techniques", "creative expression", "technical mastery", "artistic vision", "commercial application"]
                aspect = advanced_aspects[day % len(advanced_aspects)]
                daily_tasks.append(f"Develop {aspect} in {topics[topic_idx].lower()}")
            elif category in ["gate", "jee", "upsc"]:
                advanced_aspects = ["complex problems", "time optimization", "accuracy improvement", "conceptual depth", "application skills"]
                aspect = advanced_aspects[day % len(advanced_aspects)]
                daily_tasks.append(f"Master {aspect} in {topics[topic_idx].lower()}")
            else:
                advanced_aspects = ["optimization", "edge cases", "scalability", "best practices", "performance"]
                aspect = advanced_aspects[day % len(advanced_aspects)]
                daily_tasks.append(f"Master advanced {aspect} in {topics[topic_idx].lower()}")
            day_counter += 1
        
        # Project Phase - Real-world application
        for day in range(project_phase):
            if day < len(projects):
                daily_tasks.append(f"Work on project: {projects[day]}")
            elif day < len(projects) * 2:
                project_idx = (day - len(projects)) % len(projects)
                daily_tasks.append(f"Refine and add advanced features to: {projects[project_idx]}")
            else:
                if category in ["hindi", "english"]:
                    daily_tasks.append(f"Create advanced {category} content and teach others")
                elif category in ["photography", "music"]:
                    daily_tasks.append(f"Develop your unique {category} style and showcase your portfolio")
                elif category in ["gate", "jee", "upsc"]:
                    daily_tasks.append(f"Take full mock exams and analyze performance for final preparation")
                else:
                    daily_tasks.append(f"Create portfolio documentation and showcase your {category} expertise")
        
        return daily_tasks
    
    def create_general_tasks(self, goal: str, num_days: int) -> List[str]:
        """Create tasks for subjects not in our detailed curriculum"""
        
        # Extract the main subject from the goal
        subject = goal.replace("Learn ", "").replace("learn ", "").replace("prepare for ", "").strip()
        
        # Generic learning phases that work for any subject
        learning_phases = [
            f"Research and understand what {subject} involves and its practical applications",
            f"Gather essential resources, tools, and materials needed for {subject}",
            f"Learn fundamental concepts and basic principles of {subject}",
            f"Practice beginner exercises and follow structured tutorials for {subject}",
            f"Apply knowledge by working on a simple real-world project in {subject}",
            f"Study intermediate concepts and explore different approaches in {subject}",
            f"Implement a medium-complexity project demonstrating your {subject} skills",
            f"Learn advanced techniques and study expert-level practices in {subject}",
            f"Contribute to community projects or create original content in {subject}",
            f"Build a comprehensive portfolio showcasing your {subject} expertise"
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
                        f"Continue {base_task.lower()} with focused practice sessions",
                        f"Deepen understanding: {base_task.lower()} through different perspectives",
                        f"Apply and test knowledge: {base_task.lower()} in new scenarios",
                        f"Review and reinforce: {base_task.lower()} with peer discussions"
                    ]
                    daily_tasks.append(variations[day_in_phase % len(variations)])
        
        # Fill remaining days if needed
        while len(daily_tasks) < num_days:
            remaining_days = num_days - len(daily_tasks)
            if remaining_days > 5:
                daily_tasks.append(f"Work on capstone project: comprehensive {subject} application with real-world impact")
            else:
                daily_tasks.append(f"Consolidate learning, create study materials, and prepare to teach {subject} to others")
        
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
        
        # Create monthly tasks with subject-appropriate themes
        if totals["total_months"] > 0:
            if subject_category in self.detailed_curricula:
                curriculum = self.detailed_curricula[subject_category]
                topics = curriculum["topics"]
                
                # Subject-specific monthly themes
                if subject_category in ["hindi", "english"]:
                    monthly_themes = [
                        ["Script and Basic Vocabulary", "Grammar Fundamentals"],
                        ["Conversation and Listening Skills", "Reading Comprehension"],
                        ["Writing Skills and Advanced Grammar", "Cultural Context"],
                        ["Fluency Development", "Literature and Media"],
                        ["Professional Communication", "Advanced Composition"],
                        ["Mastery and Teaching Skills", "Native-level Proficiency"]
                    ]
                elif subject_category in ["photography", "music"]:
                    monthly_themes = [
                        ["Equipment and Technical Basics", "Fundamental Techniques"],
                        ["Creative Exploration", "Style Development"],
                        ["Advanced Techniques", "Professional Skills"],
                        ["Portfolio Development", "Commercial Applications"],
                        ["Artistic Mastery", "Teaching and Mentoring"],
                        ["Industry Integration", "Personal Brand Building"]
                    ]
                elif subject_category in ["gate", "jee", "upsc"]:
                    monthly_themes = [
                        ["Syllabus Analysis and Foundation", "Basic Concept Building"],
                        ["Topic-wise Mastery", "Practice and Problem Solving"],
                        ["Mock Tests and Time Management", "Weak Area Improvement"],
                        ["Advanced Problem Solving", "Revision and Consolidation"],
                        ["Final Preparation", "Stress Management"],
                        ["Last-minute Revision", "Exam Strategy Refinement"]
                    ]
                else:
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
                    
                    # Use specific topics from curriculum
                    topics_for_month = topics[month_num * 4:(month_num + 1) * 4] if month_num * 4 < len(topics) else topics[-4:]
                    
                    plan["monthlyTasks"].append({
                        "label": f"Month {month_num + 1}",
                        "tasks": [
                            f"Focus on {monthly_themes[theme_idx][0].lower()} - {', '.join(topics_for_month[:2]).lower()}",
                            f"Master {monthly_themes[theme_idx][1].lower()} - {', '.join(topics_for_month[2:]).lower()}"
                        ],
                        "status": False
                    })
            else:
                # Generic monthly structure for unknown subjects
                subject = goal.replace("Learn ", "").replace("learn ", "").replace("prepare for ", "").strip()
                for month_num in range(totals["total_months"]):
                    if month_num == 0:
                        plan["monthlyTasks"].append({
                            "label": f"Month {month_num + 1}",
                            "tasks": [
                                f"Build strong foundation in {subject} fundamentals and core concepts",
                                f"Establish consistent practice routine and gather essential resources"
                            ],
                            "status": False
                        })
                    elif month_num == totals["total_months"] - 1:
                        plan["monthlyTasks"].append({
                            "label": f"Month {month_num + 1}",
                            "tasks": [
                                f"Achieve mastery-level proficiency in {subject}",
                                f"Create portfolio and prepare to teach or mentor others"
                            ],
                            "status": False
                        })
                    else:
                        plan["monthlyTasks"].append({
                            "label": f"Month {month_num + 1}",
                            "tasks": [
                                f"Advance your {subject} skills through challenging projects and exercises",
                                f"Apply {subject} knowledge to real-world scenarios and problems"
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
                        if subject_category in ["hindi", "english"]:
                            plan["weeklyTasks"].append({
                                "label": f"Week {week_num + 1}",
                                "tasks": [
                                    f"Master {topic.lower()} through reading, writing, and speaking practice",
                                    f"Apply {topic.lower()} in real conversations and practical exercises"
                                ],
                                "status": False
                            })
                        elif subject_category in ["photography", "music"]:
                            plan["weeklyTasks"].append({
                                "label": f"Week {week_num + 1}",
                                "tasks": [
                                    f"Learn and practice {topic.lower()} with hands-on creative exercises",
                                    f"Create original work showcasing your understanding of {topic.lower()}"
                                ],
                                "status": False
                            })
                        elif subject_category in ["gate", "jee", "upsc"]:
                            plan["weeklyTasks"].append({
                                "label": f"Week {week_num + 1}",
                                "tasks": [
                                    f"Study {topic.lower()} comprehensively with detailed notes",
                                    f"Solve practice questions and mock tests on {topic.lower()}"
                                ],
                                "status": False
                            })
                        else:
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
                                f"Review, refine and document your work"
                            ],
                            "status": False
                        })
                    else:
                        # Fallback for extra weeks
                        if subject_category in ["gate", "jee", "upsc"]:
                            plan["weeklyTasks"].append({
                                "label": f"Week {week_num + 1}",
                                "tasks": [
                                    f"Take comprehensive mock exams and analyze performance",
                                    f"Focus on weak areas and final revision for exam preparation"
                                ],
                                "status": False
                            })
                        else:
                            plan["weeklyTasks"].append({
                                "label": f"Week {week_num + 1}",
                                "tasks": [
                                    f"Advanced practice and portfolio building in {goal.lower()}",
                                    f"Review and consolidate your {goal.lower()} knowledge"
                                ],
                                "status": False
                            })
            else:
                # Generic weekly structure for unknown subjects
                subject = goal.replace("Learn ", "").replace("learn ", "").replace("prepare for ", "").strip()
                for week_num in range(totals["total_weeks"]):
                    week_themes = [
                        ["Foundation building", "Basic practice"],
                        ["Skill development", "Hands-on application"],
                        ["Advanced concepts", "Complex projects"],
                        ["Mastery refinement", "Portfolio creation"],
                        ["Expert application", "Teaching others"],
                        ["Professional integration", "Continuous improvement"]
                    ]
                    theme_idx = week_num % len(week_themes)
                    theme = week_themes[theme_idx]
                    
                    plan["weeklyTasks"].append({
                        "label": f"Week {week_num + 1}",
                        "tasks": [
                            f"{theme[0]} in {subject} with focused study sessions",
                            f"{theme[1]} through practical exercises and real-world scenarios"
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