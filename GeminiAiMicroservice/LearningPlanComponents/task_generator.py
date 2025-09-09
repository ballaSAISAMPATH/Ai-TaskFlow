# task_generator.py
from typing import List, Dict, Any
from curricula import DetailedCurricula


class TaskGenerator:
    def __init__(self):
        self.curricula = DetailedCurricula.get_curricula()
    
    def create_progressive_daily_tasks(self, goal: str, category: str, num_days: int) -> List[str]:
        """Create progressive, specific daily tasks based on the learning goal"""
        
        if category == "general":
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
        self.create_general_tasks(goal, num_days)
        
        curriculum = self.curricula[category]
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
        
        return