# task_generator.py
import random
from typing import List, Dict, Any
from LearningPlanComponents.curricula import DetailedCurricula


class TaskGenerator:
    def __init__(self):
        self.curricula = DetailedCurricula.get_curricula()
    
    def create_ultra_specific_daily_tasks(self, goal: str, category: str, num_days: int, user_context: Dict[str, Any]) -> List[str]:
        """Create ultra-specific, actionable daily tasks that avoid generic language"""
        
        skill_level = user_context.get('skill_level', 'beginner')
        learning_style = user_context.get('learning_style', 'practical')
        daily_time = user_context.get('daily_time', '1-2 hours')
        
        if category in self.curricula:
            return self._create_curriculum_specific_tasks(goal, category, num_days, user_context)
        else:
            return self._create_intelligent_generic_tasks(goal, num_days, user_context)
    
    def _create_curriculum_specific_tasks(self, goal: str, category: str, num_days: int, user_context: Dict) -> List[str]:
        """Create tasks based on detailed curriculum knowledge"""
        
        skill_level = user_context.get('skill_level', 'beginner')
        
        task_generators = {
            'dsa': self._generate_dsa_tasks,
            'react': self._generate_react_tasks,
            'python': self._generate_python_tasks,
            'hindi': self._generate_hindi_tasks,
            'english': self._generate_english_tasks,
            'photography': self._generate_photography_tasks,
            'music': self._generate_music_tasks,
            'fitness': self._generate_fitness_tasks,
            'weight_loss': self._generate_weight_loss_tasks,
            'cooking': self._generate_cooking_tasks,
            'gate': self._generate_gate_tasks,
            'jee': self._generate_jee_tasks,
            'upsc': self._generate_upsc_tasks
        }
        
        if category in task_generators:
            return task_generators[category](num_days, skill_level)
        else:
            return self._create_intelligent_generic_tasks(goal, num_days, user_context)
    
    def _generate_dsa_tasks(self, num_days: int, skill_level: str) -> List[str]:
        beginner_tasks = [
            # Week 1-2: Arrays and Strings
            "Solve Two Sum problem using hash map approach, implement in Python with 5 test cases including edge cases",
            "Implement dynamic array class with resize(), insert(), delete() methods and test with 1000 elements",
            "Solve Best Time to Buy and Sell Stock using single pass algorithm with profit tracking",
            "Create string reversal function using two-pointer technique, compare performance with built-in methods",
            "Solve Contains Duplicate problem using set-based approach, analyze time/space complexity trade-offs",
            "Implement sliding window maximum algorithm for arrays, test with windows of different sizes",
            "Solve Longest Substring Without Repeating Characters using sliding window and hash set",
            "Build string compression algorithm that reduces 'aabcccccaaa' to 'a2b1c5a3' with character counting",
            "Solve Valid Anagram using character frequency counting and ASCII array optimization",
            "Implement merge intervals algorithm for overlapping time ranges with sorting optimization",
            
            # Week 3-4: Linked Lists and Stacks
            "Build singly linked list class with insert(), delete(), search(), display() methods and null checks",
            "Solve Reverse Linked List iteratively and recursively, compare approaches and memory usage",
            "Implement stack using Python list with push(), pop(), peek(), isEmpty() and size tracking",
            "Solve Valid Parentheses problem using stack, handle multiple bracket types: ()[]{}",
            "Create queue using two stacks, implement enqueue() and dequeue() with amortized O(1)",
            "Solve Merge Two Sorted Lists recursively with proper null handling and edge cases",
            "Implement linked list cycle detection using Floyd's tortoise-hare algorithm",
            "Build palindrome checker for linked lists using reverse and two-pointer comparison",
            "Create LRU cache using doubly linked list and hash map with O(1) operations",
            "Solve Remove Nth Node From End using two-pointer technique with single pass",
            
            # Week 5-6: Trees and Binary Search
            "Implement binary tree with insert(), delete(), search() methods and in/pre/post-order traversals",
            "Solve Maximum Depth of Binary Tree using recursive DFS and iterative BFS approaches",
            "Build binary search algorithm with iterative and recursive implementations, test with sorted arrays",
            "Implement binary search tree validation checking left < root < right property recursively",
            "Solve Same Tree comparison using recursive traversal and node value checking",
            "Create binary tree level-order traversal using queue-based BFS algorithm",
            "Implement lowest common ancestor finder for binary search trees with path comparison",
            "Solve invert binary tree problem using recursive swapping and iterative queue approach",
            "Build diameter of binary tree calculator using recursive height computation",
            "Implement serialize and deserialize binary tree using preorder traversal string",
            
            # Week 7-8: Hash Tables and Graphs
            "Build hash table from scratch with separate chaining collision resolution and load factor monitoring",
            "Solve Group Anagrams using hash map with sorted string keys and anagram clustering",
            "Implement graph using adjacency list representation with add vertex/edge methods",
            "Solve Number of Islands using DFS grid traversal with visited cell tracking",
            "Build breadth-first search for graphs with queue-based level exploration and path reconstruction",
            "Implement depth-first search with recursive and iterative approaches using stack",
            "Solve course scheduling using topological sorting and cycle detection in directed graphs",
            "Create word ladder solver using BFS with word transformation and distance tracking",
            "Implement union-find data structure with path compression and union by rank optimization",
            "Solve clone graph problem using DFS with hash map for node mapping and deep copying"
        ]
        
        intermediate_tasks = [
            "Solve 3Sum problem using two-pointer technique with duplicate handling and O(n²) optimization",
            "Implement advanced AVL tree with rotation operations and automatic balancing maintenance",
            "Build segment tree for range sum queries with lazy propagation and update operations",
            "Solve maximum subarray using Kadane's algorithm with negative number handling optimization",
            "Implement trie data structure for prefix matching with word search and auto-completion",
            "Solve coin change using dynamic programming with bottom-up and memoization approaches",
            "Build Dijkstra's shortest path algorithm using priority queue and adjacency list graph",
            "Implement advanced string matching using KMP algorithm with failure function computation",
            "Solve N-Queens problem using backtracking with pruning and solution counting optimization",
            "Build red-black tree with insertion, deletion, and color property maintenance"
        ]
        
        if skill_level in ["intermediate", "advanced"]:
            tasks = intermediate_tasks * (num_days // len(intermediate_tasks) + 1)
        else:
            tasks = beginner_tasks * (num_days // len(beginner_tasks) + 1)
        
        # Add progression and variation
        final_tasks = []
        for i in range(num_days):
            base_task = tasks[i % len(tasks)]
            if i > len(tasks):
                # Add complexity for repeated cycles
                cycle = i // len(tasks)
                base_task += f" (Optimization Round {cycle + 1}: focus on time/space complexity improvement)"
            final_tasks.append(base_task)
        
        return final_tasks[:num_days]
    
    def _generate_react_tasks(self, num_days: int, skill_level: str) -> List[str]:
        beginner_tasks = [
            "Create counter component with increment/decrement buttons using useState hook and CSS modules styling",
            "Build todo list with add/delete functionality, input validation, and localStorage persistence",
            "Develop weather app fetching OpenWeatherMap API data with loading spinner and error handling",
            "Create user registration form with validation, password strength checker, and submission handling",
            "Build shopping cart component with add/remove items, quantity updates, and price calculation",
            "Implement image gallery with thumbnail navigation, modal view, and keyboard controls",
            "Create search filter for product list with real-time filtering and highlighted results",
            "Build timer component with start/stop/reset functionality and custom time input",
            "Develop expense tracker with category selection, amount validation, and monthly summaries",
            "Create responsive navbar with hamburger menu, dropdown items, and active state highlighting",
            
            "Implement useEffect hook for API data fetching with cleanup and dependency management",
            "Build custom hook for form handling with validation, error messages, and submission state",
            "Create context provider for theme switching with dark/light modes and localStorage persistence",
            "Develop infinite scroll component using Intersection Observer API and lazy loading",
            "Build drag and drop task organizer using HTML5 drag API with visual feedback",
            "Implement modal component with portal rendering, ESC key closing, and backdrop clicking",
            "Create autocomplete search with debouncing, API suggestions, and keyboard navigation",
            "Build file upload component with drag-drop, progress bar, and file type validation",
            "Develop multi-step wizard with progress indicator, form validation, and data persistence",
            "Create responsive data table with sorting, filtering, pagination, and row selection"
        ]
        
        return self._distribute_tasks(beginner_tasks, num_days)
    
    def _generate_python_tasks(self, num_days: int, skill_level: str) -> List[str]:
        beginner_tasks = [
            "Build expense tracker CLI that reads CSV files, categorizes transactions, and generates monthly reports with matplotlib charts",
            "Create web scraper for job listings using BeautifulSoup, handle pagination, and export results to JSON with error logging",
            "Develop password manager with cryptography encryption, secure file storage, and command-line interface with masked input",
            "Build weather API wrapper class with requests, implement caching with TTL, and add rate limiting with decorators",
            "Create file organizer script that sorts downloads by type/date, shows progress bars, and handles duplicate files",
            "Implement URL shortener service using Flask, SQLite database, and custom short code generation algorithm",
            "Build email automation tool using smtplib, read recipients from CSV, support HTML templates with personalization",
            "Create log file analyzer that parses Apache/Nginx logs, identifies patterns, and generates statistics with pandas",
            "Develop backup utility with compression using zipfile, schedule with APScheduler, and cloud upload integration",
            "Build REST API for book library using FastAPI, implement CRUD operations with SQLAlchemy ORM",
            
            "Create web crawler that follows robots.txt, implements breadth-first traversal, and stores data in MongoDB",
            "Build machine learning model for house price prediction using scikit-learn, pandas, and feature engineering",
            "Develop real-time chat server using WebSockets with asyncio, message broadcasting, and user management",
            "Create automated testing suite using pytest, implement fixtures, mocking, and coverage reporting",
            "Build image processing tool using Pillow for batch resizing, watermarking, and format conversion with progress tracking",
            "Implement distributed task queue using Celery, Redis broker, and background job processing with monitoring",
            "Create data visualization dashboard using Streamlit, connect to SQL database, and implement interactive charts",
            "Build OAuth2 authentication system using FastAPI-Security, JWT tokens, and role-based access control",
            "Develop cryptocurrency price tracker with WebSocket connections, real-time alerts, and historical data storage",
            "Create automated deployment script using fabric3, implement rolling updates, health checks, and rollback capability"
        ]
        
        return self._distribute_tasks(beginner_tasks, num_days)
    
    def _generate_fitness_tasks(self, num_days: int, skill_level: str) -> List[str]:
        beginner_tasks = [
            "Complete 20-minute full-body workout: 3 sets of 10 push-ups, 15 bodyweight squats, 30-second plank hold",
            "Walk 5000 steps tracking pace and heart rate, document energy levels and mood changes in fitness journal",
            "Learn proper squat form using bodyweight, practice 3 sets of 12 reps with 90-second rest between sets",
            "Complete 15-minute morning stretching routine focusing on hip flexors, hamstrings, and shoulder mobility",
            "Do 10-minute HIIT workout: 30 seconds jumping jacks, 30 seconds rest, repeat 10 rounds with intensity tracking",
            "Practice push-up progressions: wall push-ups to knee push-ups, aim for 2 sets of 8-12 reps",
            "Complete bodyweight strength circuit: lunges, glute bridges, modified planks for 12 minutes total",
            "Take 30-minute nature walk exploring new route, focus on maintaining steady breathing and posture",
            "Learn basic yoga poses: downward dog, child's pose, warrior I with 30-second holds each",
            "Do core strengthening workout: dead bugs, bird dogs, side planks for 8 minutes with proper form",
            
            "Increase daily step count to 7500 steps with interval walking: 5 minutes brisk, 2 minutes moderate pace",
            "Complete strength training: bodyweight squats, push-ups, lunges with 3 sets of 10-15 reps each",
            "Practice balance exercises: single-leg stands, heel-to-toe walking for 10 minutes with stability focus",
            "Do 20-minute flexibility session targeting tight muscle groups identified in previous mobility assessment",
            "Complete cardio workout: stair climbing or step-ups for 15 minutes with heart rate monitoring",
            "Learn resistance band exercises: bicep curls, lateral raises, rows with proper tension and form",
            "Take active recovery walk focusing on deep breathing and stress relief for 25 minutes minimum",
            "Practice functional movements: sit-to-stand, carrying objects, reaching overhead with proper mechanics",
            "Complete circuit training: rotate through 5 exercises for 45 seconds each with 15-second transitions",
            "Do evening relaxation routine: gentle stretches, deep breathing, and muscle tension release exercises"
        ]
        
        return self._distribute_tasks(beginner_tasks, num_days)
    
    def _generate_cooking_tasks(self, num_days: int, skill_level: str) -> List[str]:
        basic_tasks = [
            "Master knife skills: practice julienne cuts with 2 carrots, dice 1 onion uniformly, and chiffonade 5 basil leaves",
            "Cook perfect scrambled eggs using French technique: low heat, constant stirring, finish with butter and herbs",
            "Bake basic white bread from scratch: knead dough for 10 minutes, understand gluten development and proofing times",
            "Prepare homemade pasta dough with 400g flour and 4 eggs, roll by hand, and create fettuccine noodles",
            "Learn mother sauces: make béchamel with proper roux technique, season correctly, and achieve smooth consistency",
            "Roast whole chicken at 425°F: proper trussing, seasoning under skin, temperature monitoring to 165°F internal",
            "Master rice cooking: absorption method with 1:2 ratio, bring to boil then simmer 18 minutes covered",
            "Create compound butter with herbs: soften butter, fold in minced garlic and parsley, shape and chill",
            "Learn proper searing technique: preheat pan, oil at smoke point, don't move protein for 3-4 minutes",
            "Make hollandaise sauce from scratch: emulsify egg yolks with warm butter, maintain temperature below 140°F"
        ]
        
        return self._distribute_tasks(basic_tasks, num_days)
    
    # Additional generators for other subjects...
    def _generate_hindi_tasks(self, num_days: int, skill_level: str) -> List[str]:
        tasks = [
            "Practice writing 25 Devanagari characters with proper stroke order, pronounce each 3 times aloud",
            "Learn 15 family relationship terms in Hindi with cultural context, create family tree with Hindi labels",
            "Have 5-minute conversation about daily routine using present tense verbs and basic vocabulary",
            "Watch Bollywood movie scene without subtitles, identify 20 new words and create flashcards with usage",
            "Read simple Hindi children's story aloud, summarize plot in both Hindi and English writing",
            "Practice Hindi numbers 1-100 with pronunciation, solve basic math problems using Hindi numerals",
            "Learn 20 common Hindi verbs with all tense conjugations, practice in example sentences",
            "Write 100-word paragraph about your hobbies in Hindi using vocabulary learned this week"
        ]
        return self._distribute_tasks(tasks, num_days)
    
    def _generate_photography_tasks(self, num_days: int, skill_level: str) -> List[str]:
        tasks = [
            "Take 30 photos using rule of thirds composition, practice with different subjects and lighting conditions",
            "Shoot golden hour portraits using natural light only, experiment with backlighting and rim lighting effects",
            "Create street photography series documenting daily life in your neighborhood using decisive moment technique",
            "Practice manual mode: shoot same subject at f/1.4, f/4, f/8 to understand depth of field effects",
            "Edit 15 RAW photos in Lightroom: adjust exposure, contrast, vibrance with consistent style development"
        ]
        return self._distribute_tasks(tasks, num_days)
    
    def _distribute_tasks(self, task_pool: List[str], num_days: int) -> List[str]:
        """Distribute tasks across days with intelligent repetition and progression"""
        if num_days <= len(task_pool):
            return task_pool[:num_days]
        
        # For longer durations, add progression and variation
        final_tasks = []
        for i in range(num_days):
            base_task = task_pool[i % len(task_pool)]
            
            if i >= len(task_pool):
                # Add progression markers for repeated cycles
                cycle = i // len(task_pool)
                progression_modifiers = [
                    " (Advanced Version: increase complexity and add optimization focus)",
                    " (Mastery Level: teach concept to someone else and create tutorial)",
                    " (Expert Application: integrate with previous learnings and real-world scenario)",
                    " (Innovation Phase: modify technique and create original approach)"
                ]
                modifier = progression_modifiers[min(cycle, len(progression_modifiers) - 1)]
                base_task += modifier
            
            final_tasks.append(base_task)
        
        return final_tasks
    
    def _create_intelligent_generic_tasks(self, goal: str, num_days: int, user_context: Dict) -> List[str]:
        """Create intelligent generic tasks for unknown subjects"""
        
        subject = goal.replace("Learn ", "").replace("learn ", "").replace("prepare for ", "").strip()
        skill_level = user_context.get('skill_level', 'beginner')
        
        # Learning progression phases
        phase_templates = {
            'research': f"Research {subject} fundamentals: identify 5 key concepts, find 3 authoritative learning resources, create study roadmap",
            'foundation': f"Master {subject} basics: complete beginner tutorial, practice core technique for 45 minutes, document key learnings",
            'application': f"Apply {subject} knowledge: build mini-project demonstrating understanding, test with real-world scenario",
            'practice': f"Intensive {subject} practice: complete 3 challenging exercises, focus on weak areas identified yesterday",
            'creation': f"Create original {subject} content: build something new combining multiple concepts, document process and challenges",
            'teaching': f"Teach {subject} concept: explain yesterday's learning to someone else, create tutorial or guide",
            'community': f"Engage {subject} community: participate in forum discussion, help beginner, share your project",
            'reflection': f"Reflect on {subject} progress: review week's learnings, identify improvements, plan advanced topics"
        }
        
        phases = list(phase_templates.keys())
        tasks = []
        
        for day in range(num_days):
            phase = phases[day % len(phases)]
            base_task = phase_templates[phase]
            
            # Add progression for repeated cycles
            if day >= len(phases):
                cycle = day // len(phases)
                base_task += f" (Advanced Cycle {cycle + 1}: increase depth and complexity)"
            
            tasks.append(base_task)
        
        return tasks