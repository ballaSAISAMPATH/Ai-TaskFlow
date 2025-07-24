import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getGoalStats } from '@/store/task';
import { Target, CheckCircle, Clock, TrendingUp, Calendar, Award, BarChart3 } from 'lucide-react';

const DashBoard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await dispatch(getGoalStats({ user }));
        if (response.payload.success) {
          setStats(response.payload.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user, dispatch]);

  const StatCard = ({ icon: Icon, title, value, subtitle, progress }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon className="w-5 h-5 text-green-500" />
            <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {progress !== undefined && (
          <div className="text-right">
            <div className="text-lg font-semibold text-green-500">{progress}%</div>
            <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
              <div 
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const TaskBreakdownCard = ({ title, icon: Icon, data }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => {
          const percentage = value.total > 0 ? Math.round((value.completed / value.total) * 100) : 0;
          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                <span className="text-sm text-gray-600">{value.completed}/{value.total}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{percentage}% completed</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const GoalProgressCard = ({ goal }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-lg font-semibold text-gray-900 flex-1">{goal.goalTitle}</h4>
        {goal.isCompleted && (
          <Award className="w-6 h-6 text-green-500 flex-shrink-0" />
        )}
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{goal.completedTasks}/{goal.totalTasks} tasks</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full">
          <div 
            className={`h-full rounded-full transition-all ${
              goal.isCompleted ? 'bg-green-500' : 'bg-green-400'
            }`}
            style={{ width: `${goal.completionRate}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`text-sm px-2 py-1 rounded-full ${
          goal.isCompleted 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {goal.isCompleted ? 'Completed' : `${goal.completionRate}% Done`}
        </span>
        {goal.isCompleted && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Start creating goals to see your progress here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.userName || 'User'}! 👋
          </h1>
          <p className="text-gray-600">Here's your goal tracking overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Target}
            title="Total Goals"
            value={stats.totalGoals}
            subtitle={`${stats.completedGoals} completed`}
          />
          <StatCard
            icon={CheckCircle}
            title="Completed Goals"
            value={stats.completedGoals}
            subtitle={`${stats.totalGoals - stats.completedGoals} remaining`}
          />
          <StatCard
            icon={BarChart3}
            title="Total Tasks"
            value={stats.totalTasks}
            subtitle={`${stats.completedTasks} completed`}
          />
          <StatCard
            icon={TrendingUp}
            title="Overall Progress"
            value={`${stats.overallCompletionRate}%`}
            progress={stats.overallCompletionRate}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TaskBreakdownCard
            title="Daily Tasks"
            icon={Clock}
            data={{ daily: stats.taskBreakdown.daily }}
          />
          <TaskBreakdownCard
            title="Weekly Tasks"
            icon={Calendar}
            data={{ weekly: stats.taskBreakdown.weekly }}
          />
          <TaskBreakdownCard
            title="Monthly Tasks"
            icon={Calendar}
            data={{ monthly: stats.taskBreakdown.monthly }}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Goals Progress</h2>
          {stats.goalProgress.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.goalProgress.map((goal) => (
                <GoalProgressCard key={goal.goalId} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Goals Yet</h3>
              <p className="text-gray-600">Create your first goal to start tracking your progress!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;