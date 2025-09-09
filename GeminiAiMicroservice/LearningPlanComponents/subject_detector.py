# subject_detector.py
from curricula import DetailedCurricula


class SubjectDetector:
    def __init__(self):
        self.curricula = DetailedCurricula.get_curricula()
    
    def detect_subject_category(self, goal: str) -> str:
        goal_lower = goal.lower()
        
        # Direct keyword matching for all subjects
        for key in self.curricula.keys():
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