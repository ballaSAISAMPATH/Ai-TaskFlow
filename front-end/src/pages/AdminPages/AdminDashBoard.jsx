import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '@/store/admin';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Users, Target, MessageSquare, TrendingUp, Calendar, CheckCircle, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const SkeletonBase = ({ className = '', width, height, rounded = false }) => (
  <div
    className={`bg-gray-200 animate-pulse ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
    style={{ width, height }}
  />
);

const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBase
        key={i}
        className="h-4"
        width={i === lines - 1 ? '75%' : '100%'}
      />
    ))}
  </div>
);

const SkeletonMetric = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <SkeletonBase className="h-4 mb-2" width="60%" />
        <SkeletonBase className="h-6 mb-2" width="80%" />
        <SkeletonBase className="h-4" width="40%" />
      </div>
      <div className="bg-gray-200 p-3 rounded-xl">
        <SkeletonBase className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
    </div>
  </div>
);

const SkeletonChart = ({ className = '', height = 300 }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 ${className}`}>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
      <SkeletonBase className="h-6 mb-2 sm:mb-0" width="200px" />
      <SkeletonBase className="h-4" width="150px" />
    </div>
    <div className="flex items-end space-x-2" style={{ height }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonBase
          key={i}
          className="flex-1 rounded-t"
          height={`${Math.random() * 80 + 20}%`}
        />
      ))}
    </div>
  </div>
);

const SkeletonRadialChart = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 ${className}`}>
    <SkeletonBase className="h-6 mb-4" width="150px" />
    <div className="flex flex-col items-center">
      <div className="w-48 h-48 mb-4 flex items-center justify-center">
        <SkeletonBase className="w-32 h-32" rounded={true} />
      </div>
      <SkeletonBase className="h-8 mb-2" width="80px" />
      <SkeletonBase className="h-4" width="120px" />
    </div>
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, dashboardLoading, dashboardError } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (dashboardError) {
    return (
      <div className="min-h-screen bg-white p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-red-500 rounded-lg p-4">
            <p className="text-red-500">Error: {dashboardError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (dashboardLoading || !dashboardStats) {
    return (
      <div className="min-h-screen bg-white p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <SkeletonBase className="h-8 mb-2" width="250px" />
              <SkeletonBase className="h-4" width="350px" />
            </div>
            <div className="bg-gray-200 rounded-lg p-4 animate-pulse">
              <SkeletonBase className="h-3 mb-1" width="80px" />
              <SkeletonBase className="h-4" width="120px" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonMetric key={index} />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            <SkeletonChart className="xl:col-span-2" />
            <SkeletonRadialChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <SkeletonChart height={280} />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <SkeletonBase className="h-6 mb-4 sm:mb-6" width="150px" />
              <div className="flex flex-col items-center justify-center h-64">
                <SkeletonBase className="h-16 mb-4" width="120px" />
                <SkeletonBase className="h-4 mb-4" width="80px" />
                <div className="flex justify-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <SkeletonBase key={star} className="w-6 h-6" />
                  ))}
                </div>
                <SkeletonBase className="h-4" width="150px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    totalUsers,
    totalGoals,
    totalFeedback,
    completedGoals,
    newUsers,
    averageRating,
    totalRatings,
    monthlyUserData,
    goalCompletionData
  } = dashboardStats;

  const formattedUserData = monthlyUserData.map((item, index) => ({
    month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en', { month: 'short', year: '2-digit' }),
    users: item.count,
    growth: index > 0 ? ((item.count - monthlyUserData[index - 1].count) / monthlyUserData[index - 1].count * 100).toFixed(1) : 0
  }));

  const formattedGoalData = goalCompletionData.map(item => ({
    month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en', { month: 'short', year: '2-digit' }),
    total: item.totalGoals,
    completed: item.completedGoals,
    completionRate: ((item.completedGoals / item.totalGoals) * 100).toFixed(1),
    incomplete: item.totalGoals - item.completedGoals
  }));

  const userGrowth = monthlyUserData.length > 1 ? 
    ((monthlyUserData[monthlyUserData.length - 1].count - monthlyUserData[monthlyUserData.length - 2].count) / monthlyUserData[monthlyUserData.length - 2].count * 100).toFixed(1) : 0;

  const goalGrowth = goalCompletionData.length > 1 ? 
    ((goalCompletionData[goalCompletionData.length - 1].totalGoals - goalCompletionData[goalCompletionData.length - 2].totalGoals) / goalCompletionData[goalCompletionData.length - 2].totalGoals * 100).toFixed(1) : 0;

  const completionGrowth = goalCompletionData.length > 1 ? 
    ((goalCompletionData[goalCompletionData.length - 1].completedGoals - goalCompletionData[goalCompletionData.length - 2].completedGoals) / goalCompletionData[goalCompletionData.length - 2].completedGoals * 100).toFixed(1) : 0;

  const statCards = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: Users,
      trend: `${userGrowth > 0 ? '+' : ''}${userGrowth}%`,
      trendUp: userGrowth >= 0
    },
    {
      title: 'Active Goals',
      value: totalGoals.toLocaleString(),
      icon: Target,
      trend: `${goalGrowth > 0 ? '+' : ''}${goalGrowth}%`,
      trendUp: goalGrowth >= 0
    },
    {
      title: 'Completed Goals',
      value: completedGoals.toLocaleString(),
      icon: CheckCircle,
      trend: `${completionGrowth > 0 ? '+' : ''}${completionGrowth}%`,
      trendUp: completionGrowth >= 0
    },
    {
      title: 'User Reviews',
      value: totalFeedback.toLocaleString(),
      icon: MessageSquare,
      trend: `${totalRatings}`,
      trendUp: true
    },
    {
      title: 'New Users (30d)',
      value: newUsers.toLocaleString(),
      icon: TrendingUp,
      trend: 'This month',
      trendUp: true
    },
    {
      title: 'Avg Rating',
      value: `${averageRating.toFixed(1)}/5.0`,
      icon: Activity,
      trend: `${totalRatings} ratings`,
      trendUp: averageRating >= 4.0
    }
  ];

  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  const pieData = [
    { name: 'Completed', value: completedGoals, fill: '#10b981' },
    { name: 'In Progress', value: totalGoals - completedGoals, fill: '#d1fae5' }
  ];

  const COLORS = ['#10b981', '#d1fae5'];

  return (
    <div className="min-h-screen bg-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg">
            <div className="text-xs opacity-80">Last updated</div>
            <div className="text-sm font-medium">{new Date().toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-green-600 p-4 sm:p-6 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <div className={`flex items-center text-sm font-medium text-green-600 ${stat.trendUp ? 'opacity-100' : 'opacity-60'}`}>
                      {typeof stat.trend === 'string' && stat.trend.includes('%') ? (
                        stat.trendUp ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />
                      ) : null}
                      {stat.trend}
                    </div>
                  </div>
                </div>
                <div className="bg-green-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-green-600 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
              <h3 className="text-lg font-semibold text-gray-900">User Growth Trend</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2 sm:mt-0">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span>Monthly Registrations</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={formattedUserData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" tick={{fill: '#10b981'}} />
                <YAxis axisLine={false} tickLine={false} className="text-xs" tick={{fill: '#10b981'}} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #10b981', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 6px -1px rgb(16 185 129 / 0.1)',
                    color: '#10b981'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="url(#userGradient)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-green-500 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-green-500 mb-4">Goal Completion</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #10b981', 
                        borderRadius: '12px', 
                        boxShadow: '0 4px 6px -1px rgb(16 185 129 / 0.1)',
                        color: '#10b981'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{completionRate.toFixed(1)}%</div>
                    <div className="text-xs text-green-600 opacity-80">Complete</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 w-full">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-green-700">Completed</span>
                  </div>
                  <span className="text-sm font-bold text-green-700">{completedGoals.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-200 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-green-700">In Progress</span>
                  </div>
                  <span className="text-sm font-bold text-green-700">{(totalGoals - completedGoals).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-green-500 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-green-500 mb-4 sm:mb-6">Goal Completion Trends</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={formattedGoalData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" tick={{fill: '#10b981'}} />
                <YAxis axisLine={false} tickLine={false} className="text-xs" tick={{fill: '#10b981'}} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #10b981', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 6px -1px rgb(16 185 129 / 0.1)',
                    color: '#10b981'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                  name="Total Goals"
                  strokeDasharray="5 5"
                  opacity={0.6}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
                  name="Completed Goals"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-green-500 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-green-500 mb-4 sm:mb-6">User Satisfaction</h3>
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl font-bold text-green-500 mb-2">{averageRating.toFixed(1)}</div>
                <div className="text-green-500 opacity-80 mb-4">out of 5.0</div>
                <div className="flex justify-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'text-green-500' : 'text-green-500 opacity-30'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-sm text-green-500 opacity-80">
                  Based on {totalRatings.toLocaleString()} total ratings
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;