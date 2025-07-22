from pydantic import BaseModel

class LearningPlanRequest(BaseModel):
    goal: str
    duration: str

class TaskItem(BaseModel):
    label: str
    tasks: list[str]
    status: bool = False

class LearningPlanResponse(BaseModel):
    goalTitle: str
    totalDays: int
    monthlyTasks: list[TaskItem]
    weeklyTasks: list[TaskItem]
    dailyTasks: list[TaskItem]