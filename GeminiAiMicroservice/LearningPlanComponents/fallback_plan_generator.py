# fallback_plan_generator.py
from typing import Dict, Any
from curricula import DetailedCurricula
from utils import DurationParser
from subject_detector import SubjectDetector
from task_generator import TaskGenerator


class FallbackPlanGenerator:
    def __init__(self):
        self.curricula = DetailedCurricula.get_curricula()
        self.duration_parser = DurationParser()
        self.subject_detector = SubjectDetector()
        self.task_generator = TaskGenerator()
    
    def create_intelligent_fallback_plan(self, goal: str, duration: str) -> Dict[str, Any]:
        duration_dict = self.duration_parser.parse_duration(duration)
        totals = self.duration_parser.calculate_totals(duration_dict)
        
        subject_category = self.subject_detector.detect_subject_category(goal)
        
        plan = {
            "goalTitle": goal,
            "totalDays": totals["total_days"],
            "monthlyTasks": [],
            "weeklyTasks": [],
            "dailyTasks": []
        }
        
        # Create monthly tasks with subject-appropriate themes
        if totals["total_months"] > 0:
            if subject_category in self.curricula:
                curriculum = self.curricula[subject_category]
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
            if subject_category in self.curricula:
                curriculum = self.curricula[subject_category]
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
        daily_tasks = self.task_generator.create_progressive_daily_tasks(goal, subject_category, totals["total_days"])
        
        for day_num, task in enumerate(daily_tasks):
            plan["dailyTasks"].append({
                "label": f"Day {day_num + 1}",
                "tasks": [task],
                "status": False
            })
        
        return plan