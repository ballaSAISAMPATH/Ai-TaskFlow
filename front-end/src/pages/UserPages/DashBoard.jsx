import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getGoalStats } from '@/store/task';
import { fetchDashboardAnalytics, selectDashboardAnalytics } from '@/store/user-dashboard';
import { Target, CheckCircle, Clock, TrendingUp, Calendar, Award, BarChart3, LineChart } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashBoard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const analytics = useSelector(selectDashboardAnalytics);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await dispatch(getGoalStats({ user }));
        if (response.payload.success) {
          setStats(response.payload.data);
        }
        if (user?.id) {
          dispatch(fetchDashboardAnalytics(user.id));
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

const getProgressChartData = () => {
  
  let analyticsData = null;
  
  if (analytics?.data?.dailyAnalytics) {
    analyticsData = analytics.data.dailyAnalytics;
  } else if (analytics?.data && Array.isArray(analytics.data)) {
    analyticsData = analytics.data;
  } else if (analytics?.dailyAnalytics) {
    analyticsData = analytics.dailyAnalytics;
  } else if (Array.isArray(analytics)) {
    analyticsData = analytics;
  }
  
  
  if (!analyticsData || analyticsData.length === 0) {
    console.log('No analytics data found');
    return [];
  }
  
  return analyticsData.map(day => {
    const shiftedDate = new Date(day.date);
    shiftedDate.setDate(shiftedDate.getDate());

    return {
      date: shiftedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completed: day.completedTasks, 
      goals: day.completedGoals,
      tasks: day.completedTasks
    };
  });
};

  const getTaskTypeData = () => {
    if (!stats) return [];
    const { taskBreakdown } = stats;
    return [
      { name: 'Daily', completed: taskBreakdown.daily.completed, total: taskBreakdown.daily.total, color: '#10B981' },
      { name: 'Weekly', completed: taskBreakdown.weekly.completed, total: taskBreakdown.weekly.total, color: '#10B981' },
      { name: 'Monthly', completed: taskBreakdown.monthly.completed, total: taskBreakdown.monthly.total, color: '#10B981' }
    ];
  };

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

  const ProgressChart = () => {
    const data = getProgressChartData();
    
    
    if (data.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <LineChart className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Progress Over Time</h3>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>No progress data available</p>
              <p className="text-sm mt-1">Analytics loading state: {analytics.loading ? 'Loading...' : 'Loaded'}</p>
              <p className="text-sm">Analytics error: {analytics.error || 'None'}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <LineChart className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">Progress Over Time</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10B981' }}
              name="Completed Tasks"
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const TaskTypesProgressChart = () => {
    const taskTypeData = getTaskTypeData();
    
    if (taskTypeData.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Task Types Progress</h3>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>No task data available</p>
            </div>
          </div>
        </div>
      );
    }
    
    const getTaskTypeIcon = (taskType) => {
      switch (taskType) {
        case 'Daily':
          return Clock;
        case 'Weekly':
          return Calendar;
        case 'Monthly':
          return Calendar;
        default:
          return BarChart3;
      }
    };
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">Task Types Progress</h3>
        </div>
        <div className="space-y-6">
          {taskTypeData.map((item, index) => {
            const percentage = item.total > 0 
              ? Math.round((item.completed / item.total) * 100) 
              : (item.total === 0 && item.completed === 0) ? 100 : 0;
            const IconComponent = getTaskTypeIcon(item.name);
            return (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{percentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300 ease-out"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Completed: {item.completed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span>Total: {item.total}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
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

        {/* Stats Cards */}
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

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ProgressChart />
            <TaskTypesProgressChart />
          </div>
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