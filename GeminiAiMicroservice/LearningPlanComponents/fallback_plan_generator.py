# fallback_plan_generator.py
import random
from typing import Dict, Any, List
from LearningPlanComponents.curricula import DetailedCurricula
from LearningPlanComponents.utils import DurationParser
from LearningPlanComponents.subject_detector import SubjectDetector
from LearningPlanComponents.task_generator import TaskGenerator


class FallbackPlanGenerator:
    def __init__(self):
        self.curricula = DetailedCurricula.get_curricula()
        self.duration_parser = DurationParser()
        self.subject_detector = SubjectDetector()
        self.task_generator = TaskGenerator()
    
    def create_intelligent_fallback_plan(self, goal: str, duration: str, user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        duration_dict = self.duration_parser.parse_duration(duration)
        totals = self.duration_parser.calculate_totals(duration_dict)
        
        subject_category = self.subject_detector.detect_subject_category(goal)
        
        if user_context is None:
            user_context = {
                "skill_level": "beginner",
                "learning_style": "practical",
                "daily_time": "1-2 hours",
                "specific_interests": [],
                "practical_goals": []
            }
        
        plan = {
            "goalTitle": goal,
            "totalDays": totals["total_days"],
            "monthlyTasks": [],
            "weeklyTasks": [],
            "dailyTasks": []
        }
        
        # Create monthly tasks with intelligent variation
        plan["monthlyTasks"] = self._create_dynamic_monthly_tasks(
            goal, subject_category, totals["total_months"], user_context
        )
        
        # Create weekly tasks with subject-specific focus
        plan["weeklyTasks"] = self._create_dynamic_weekly_tasks(
            goal, subject_category, totals["total_weeks"], user_context
        )
        
        # Create highly specific daily tasks
        plan["dailyTasks"] = self._create_dynamic_daily_tasks(
            goal, subject_category, totals["total_days"], user_context
        )
        
        return plan
    
    def _create_dynamic_monthly_tasks(self, goal: str, category: str, num_months: int, user_context: Dict) -> List[Dict]:
        monthly_tasks = []
        skill_level = user_context.get("skill_level", "beginner")
        
        monthly_templates = {
            "dsa": {
                "beginner": [
                    ["Master array and string fundamentals", "Solve 50+ basic problems with two-pointer and sliding window techniques"],
                    ["Conquer linked lists and stacks", "Build 5 data structures from scratch with comprehensive test suites"],
                    ["Tree and graph traversal mastery", "Implement BFS, DFS, and solve 30+ tree/graph problems"],
                    ["Dynamic programming foundation", "Master classic DP problems: knapsack, LIS, coin change variants"],
                    ["Advanced algorithms and optimization", "Study greedy algorithms, backtracking, and time complexity optimization"],
                    ["Interview preparation intensive", "Complete 200+ problems, mock interviews, and system design basics"]
                ],
                "intermediate": [
                    ["Advanced tree algorithms mastery", "Implement AVL trees, red-black trees, and solve complex tree problems"],
                    ["Graph algorithms specialization", "Master Dijkstra, Bellman-Ford, Floyd-Warshall, and network flow algorithms"],
                    ["Advanced dynamic programming", "Tackle complex DP: matrix chain multiplication, optimal BST, advanced optimization"],
                    ["System design and scalability", "Design distributed systems, caching strategies, and database optimization"],
                    ["Competitive programming mastery", "Participate in contests, solve Div1 problems, advanced mathematics integration"],
                    ["Teaching and mentoring excellence", "Create educational content, mentor beginners, contribute to open source"]
                ]
            },
            "react": {
                "beginner": [
                    ["React fundamentals and modern hooks", "Build 5 interactive applications using useState, useEffect, and custom hooks"],
                    ["State management and API integration", "Master Context API, Redux basics, and REST API consumption patterns"],
                    ["Advanced component patterns", "Learn render props, compound components, and performance optimization with React.memo"],
                    ["Routing and navigation mastery", "Implement complex routing with React Router, protected routes, and lazy loading"],
                    ["Testing and deployment pipeline", "Write comprehensive tests with Jest/RTL, setup CI/CD with Vercel/Netlify"],
                    ["Full-stack integration excellence", "Connect React with Node.js backends, implement authentication, and production deployment"]
                ]
            },
            "python": {
                "beginner": [
                    ["Python syntax and data structure mastery", "Build 10 CLI tools using lists, dictionaries, OOP principles with error handling"],
                    ["Web scraping and automation expertise", "Create scrapers with BeautifulSoup, Selenium, handle APIs, and schedule tasks"],
                    ["Data analysis and visualization", "Master pandas, numpy, matplotlib for real datasets, statistical analysis"],
                    ["Web development with Flask/Django", "Build complete web applications with databases, authentication, and deployment"],
                    ["Machine learning fundamentals", "Implement ML algorithms from scratch, use scikit-learn for real projects"],
                    ["Advanced Python and specialization", "Async programming, performance optimization, contribute to open source projects"]
                ]
            },
            "fitness": {
                "beginner": [
                    ["Foundation building and habit formation", "Establish consistent 4x/week workout routine with proper form assessment"],
                    ["Strength training progression", "Increase major lift weights by 20%, master compound movements with perfect technique"],
                    ["Cardiovascular endurance development", "Achieve 5K run under 30 minutes, implement HIIT protocols for fat loss"],
                    ["Nutrition optimization and meal prep", "Master macro counting, meal prep 80% of meals, achieve body composition goals"],
                    ["Advanced training methods", "Implement periodization, learn Olympic lifts, sport-specific training protocols"],
                    ["Fitness lifestyle integration", "Maintain peak fitness year-round, help others achieve goals, compete in events"]
                ]
            }
        }
        
        # Get appropriate templates or create generic ones
        if category in monthly_templates and skill_level in monthly_templates[category]:
            templates = monthly_templates[category][skill_level]
        else:
            # Generic templates based on learning phases
            subject = goal.replace("Learn ", "").replace("learn ", "").strip()
            templates = [
                [f"Master {subject} fundamentals and core principles", f"Build strong foundation with hands-on practice and real applications"],
                [f"Develop intermediate {subject} skills", f"Create portfolio projects demonstrating practical {subject} expertise"],
                [f"Achieve advanced {subject} proficiency", f"Tackle complex challenges and contribute to {subject} community"],
                [f"Specialize in {subject} advanced topics", f"Mentor others and establish expertise in specialized {subject} areas"],
                [f"Master-level {subject} application", f"Lead projects, teach others, and innovate within {subject} domain"],
                [f"Expert {subject} practitioner", f"Shape the field, publish content, and become recognized {subject} authority"]
            ]
        
        for month_num in range(num_months):
            template_idx = month_num % len(templates)
            template = templates[template_idx]
            
            # Add some variation to avoid repetition
            variation_suffix = ""
            if month_num >= len(templates):
                variation_suffix = f" (Advanced Phase {month_num // len(templates) + 1})"
            
            monthly_tasks.append({
                "label": f"Month {month_num + 1}",
                "tasks": [
                    template[0] + variation_suffix,
                    template[1] + variation_suffix
                ],
                "status": False
            })
        
        return monthly_tasks
    
    def _create_dynamic_weekly_tasks(self, goal: str, category: str, num_weeks: int, user_context: Dict) -> List[Dict]:
        weekly_tasks = []
        skill_level = user_context.get("skill_level", "beginner")
        learning_style = user_context.get("learning_style", "practical")
        
        weekly_task_generators = {
            "dsa": lambda week: self._generate_dsa_weekly_task(week, skill_level),
            "react": lambda week: self._generate_react_weekly_task(week, skill_level),
            "python": lambda week: self._generate_python_weekly_task(week, skill_level),
            "fitness": lambda week: self._generate_fitness_weekly_task(week, skill_level),
            "cooking": lambda week: self._generate_cooking_weekly_task(week, skill_level),
            "hindi": lambda week: self._generate_language_weekly_task(week, "Hindi", skill_level),
            "english": lambda week: self._generate_language_weekly_task(week, "English", skill_level)
        }
        
        for week_num in range(num_weeks):
            if category in weekly_task_generators:
                tasks = weekly_task_generators[category](week_num)
            else:
                tasks = self._generate_generic_weekly_task(goal, week_num, skill_level)
            
            weekly_tasks.append({
                "label": f"Week {week_num + 1}",
                "tasks": tasks,
                "status": False
            })
        
        return weekly_tasks
    
    def _create_dynamic_daily_tasks(self, goal: str, category: str, num_days: int, user_context: Dict) -> List[Dict]:
        # Use the enhanced task generator for daily tasks
        daily_task_list = self.task_generator.create_ultra_specific_daily_tasks(
            goal, category, num_days, user_context
        )
        
        daily_tasks = []
        for day_num, task in enumerate(daily_task_list):
            daily_tasks.append({
                "label": f"Day {day_num + 1}",
                "tasks": [task],
                "status": False
            })
        
        return daily_tasks
    
    # Weekly task generators for specific subjects
    def _generate_dsa_weekly_task(self, week_num: int, skill_level: str) -> List[str]:
        beginner_tasks = [
            ["Solve 15 array problems focusing on two-pointer technique with detailed explanations", "Implement dynamic array class with resize functionality and performance testing"],
            ["Master linked list operations: reverse, detect cycle, merge sorted lists with 20 problems", "Build stack and queue using linked lists with comprehensive test coverage"],
            ["Binary tree fundamentals: implement traversals, height calculation, path sum problems", "Practice 25 tree problems ranging from easy to medium difficulty with optimization"],
            ["Hash table mastery: collision handling, load factor optimization, solve 20 hashing problems", "Design custom hash table with linear probing and separate chaining methods"],
            ["Graph algorithms: BFS/DFS implementation, shortest path, cycle detection in 15 problems", "Build graph visualization tool showing algorithm execution step-by-step"],
            ["Dynamic programming foundations: solve classic problems (coin change, longest increasing subsequence)", "Implement memoization and tabulation approaches for 10 DP problems with complexity analysis"],
            ["Sorting and searching mastery: implement quicksort, mergesort, binary search variants", "Analyze time complexity empirically with datasets of varying sizes and document findings"],
            ["Advanced data structures: implement trie, segment tree, or disjoint set with applications", "Solve competitive programming problems using advanced structures with time optimization"]
        ]
        
        intermediate_tasks = [
            ["Solve 10 hard LeetCode problems with multiple solution approaches and time/space optimization", "Write detailed editorials explaining solution intuition and algorithm design choices"],
            ["Implement advanced tree algorithms: AVL rotations, red-black tree operations, B-tree basics", "Create comprehensive test suite covering all edge cases and performance benchmarks"],
            ["Master graph algorithms: Dijkstra's, Bellman-Ford, Floyd-Warshall with real-world applications", "Build network routing simulator demonstrating shortest path algorithms in action"],
            ["Advanced DP patterns: matrix chain multiplication, optimal binary search tree, interval DP", "Solve 15 hard DP problems from competitive programming with mathematical proof of correctness"],
            ["String algorithms deep dive: KMP, Rabin-Karp, suffix arrays, longest palindromic substring", "Implement text search engine with advanced string matching capabilities"],
            ["System design algorithms: consistent hashing, bloom filters, rate limiting, load balancing", "Design and simulate distributed system components with performance metrics and failure handling"]
        ]
        
        if skill_level == "intermediate" or skill_level == "advanced":
            return intermediate_tasks[week_num % len(intermediate_tasks)]
        else:
            return beginner_tasks[week_num % len(beginner_tasks)]
    
    def _generate_react_weekly_task(self, week_num: int, skill_level: str) -> List[str]:
        beginner_tasks = [
            ["Build weather app with API integration, loading states, error handling, and responsive design", "Master useState and useEffect hooks through hands-on component development"],
            ["Create todo application with CRUD operations, local storage persistence, and drag-drop functionality", "Implement custom hooks for data management and learn component composition patterns"],
            ["Develop e-commerce product catalog with search, filtering, sorting, and shopping cart", "Master useContext and useReducer for complex state management across components"],
            ["Build social media dashboard with user profiles, posts, comments, and real-time updates", "Integrate multiple APIs and implement infinite scrolling with intersection observer"],
            ["Create project management tool with task assignment, progress tracking, and team collaboration", "Master React Router for complex navigation and implement protected route patterns"],
            ["Build real-time chat application with WebSocket integration, message persistence, and notifications", "Implement advanced React patterns: render props, compound components, and performance optimization"]
        ]
        
        return beginner_tasks[week_num % len(beginner_tasks)]
    
    def _generate_python_weekly_task(self, week_num: int, skill_level: str) -> List[str]:
        beginner_tasks = [
            ["Build expense tracker CLI with CSV import/export, category analysis, and monthly reports", "Master file I/O, data structures, and create comprehensive error handling systems"],
            ["Create web scraper for job listings with pagination handling, data cleaning, and database storage", "Learn BeautifulSoup, requests, and implement rate limiting and robust parsing"],
            ["Develop password manager with encryption, secure storage, CLI interface, and backup system", "Master cryptography library, file security, and create user-friendly command-line interface"],
            ["Build weather API wrapper with caching, rate limiting, historical data, and visualization", "Implement API design patterns, data persistence, and create charts with matplotlib"],
            ["Create automated backup system for files with compression, scheduling, and cloud integration", "Master os module, threading, and implement cloud storage APIs (Google Drive/Dropbox)"],
            ["Build REST API for bookstore with authentication, CRUD operations, and comprehensive testing", "Learn Flask/Django, database ORM, JWT tokens, and write unit/integration tests"]
        ]
        
        return beginner_tasks[week_num % len(beginner_tasks)]
    
    def _generate_fitness_weekly_task(self, week_num: int, skill_level: str) -> List[str]:
        beginner_tasks = [
            ["Complete full-body strength circuit 3x: push-ups, squats, lunges with proper form assessment", "Track workout metrics and establish baseline strength measurements for progression"],
            ["Implement cardio routine: 20-minute HIIT sessions 2x, 30-minute steady-state walks 2x", "Monitor heart rate zones and document energy levels and recovery between sessions"],
            ["Master compound movements: perfect deadlift, squat, and bench press form with bodyweight", "Film exercises for form analysis and gradually add resistance based on technique mastery"],
            ["Design weekly meal prep plan with macro tracking and 7 healthy recipes under 400 calories", "Calculate nutritional needs and prepare all meals in advance with portion control"],
            ["Focus on flexibility and mobility: daily 15-minute yoga routine and weekly flexibility assessment", "Document progress in range of motion and address specific muscle tightness areas"],
            ["Build cardiovascular endurance: work toward 5K run completion with interval training plan", "Follow structured couch-to-5K program with weekly distance and time improvements"]
        ]
        
        return beginner_tasks[week_num % len(beginner_tasks)]
    
    def _generate_cooking_weekly_task(self, week_num: int, skill_level: str) -> List[str]:
        beginner_tasks = [
            ["Master knife skills: julienne, dice, chiffonade techniques with 5 different vegetables daily", "Practice food safety protocols and proper cutting board usage with speed improvement"],
            ["Learn 5 mother sauces: béchamel, velouté, espagnole, hollandaise, tomato with variations", "Create sauce derivatives and understand emulsification, reduction, and thickening techniques"],
            ["Perfect egg cookery: master 8 techniques from scrambled to poached with temperature control", "Understand protein coagulation and practice precise timing for consistent results"],
            ["Bread making fundamentals: knead yeast dough, understand fermentation, bake 3 bread types", "Learn gluten development, proofing techniques, and troubleshoot common bread failures"],
            ["Explore international cuisines: cook authentic dishes from 5 countries with traditional techniques", "Research cultural food contexts and master spice combinations and cooking methods"],
            ["Advanced protein preparation: butcher whole chicken, cook fish with skin, perfect steak doneness", "Learn meat/fish anatomy, proper seasoning timing, and temperature control methods"]
        ]
        
        return beginner_tasks[week_num % len(beginner_tasks)]
    
    def _generate_language_weekly_task(self, week_num: int, language: str, skill_level: str) -> List[str]:
        beginner_tasks = [
            [f"Master 50 essential {language} vocabulary words with pronunciation and usage examples", f"Practice writing simple sentences using new vocabulary with proper grammar structure"],
            [f"Learn fundamental {language} grammar: verb conjugations, noun cases, sentence structure", f"Complete 50 grammar exercises and create personal grammar reference guide"],
            [f"Practice {language} conversation: record 5-minute daily speaking sessions on varied topics", f"Join online {language} conversation groups and participate in structured discussions"],
            [f"Read {language} content daily: children's books, news articles, social media posts", f"Summarize reading materials and identify 20 new words weekly with context usage"],
            [f"Write in {language}: diary entries, short stories, emails with increasing complexity", f"Get writing feedback from native speakers and focus on common error correction"],
            [f"Consume {language} media: movies, podcasts, music with comprehension exercises", f"Create vocabulary lists from media consumption and practice shadowing techniques"]
        ]
        
        return beginner_tasks[week_num % len(beginner_tasks)]
    
    def _generate_generic_weekly_task(self, goal: str, week_num: int, skill_level: str) -> List[str]:
        subject = goal.replace("Learn ", "").replace("learn ", "").replace("prepare for ", "").strip()
        
        generic_patterns = [
            [f"Research and practice 3 core {subject} techniques with hands-on application", f"Document learning progress and create reference materials for future review"],
            [f"Build practical project demonstrating {subject} skills with real-world application", f"Share project with community for feedback and iterate based on suggestions"],
            [f"Connect with 2 {subject} professionals through networking and informational interviews", f"Apply insights from professional discussions to refine {subject} learning approach"],
            [f"Teach someone else a {subject} concept you've learned through tutorial or presentation", f"Create educational content explaining {subject} fundamentals to solidify understanding"],
            [f"Participate in {subject} community events, forums, or competitions for practical experience", f"Contribute to {subject} discussions and help other learners with questions and challenges"],
            [f"Review and consolidate {subject} knowledge through comprehensive practice and portfolio creation", f"Prepare materials showcasing {subject} expertise for professional or academic applications"]
        ]
        
        return generic_patterns[week_num % len(generic_patterns)]