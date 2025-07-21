import React, { useState } from 'react';
import { Brain, Zap, TrendingUp, Home, BarChart3, User, Target, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { logoutUser } from '@/store/auth';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
const UserHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const menuItems = [
    {
      icon: TrendingUp,
      label: 'Progress',
      path: '/user/update-progress',
      description: 'Update status',
    },
    {
      icon: Home,
      label: 'Home',
      path: '/user/add-task',
      description: 'Add new AI tasks',
    },
    {
      icon: BarChart3,
      label: 'Dashboard',
      path: '/user/dashboard',
      description: 'View analytics',
    },
    {
      icon: User,
      label: 'Profile',
      path: '/user/profile',
      description: 'Manage account',
    },
  ];
  const handleLogout = async()=>{
      try{
        const data = await dispatch(logoutUser())
        console.log(data.payload);
        if(data.payload.success)
        {
          toast.success(data.payload.message)
        }
        else{
            toast.error(data.payload.message)
        }
      }
      catch(err){
        toast.error(`something went wrong ${err}`)
      }
      
  }

  const isAITaskActive = location.pathname === '/user/add-task';
  const isManualTaskActive = location.pathname === '/user/add-manual';

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3" onClick={() => navigate('/')}>
            <div className="relative">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center transform rotate-12">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">AI TaskFlow</span>
              <div className="text-xs text-green-500 font-medium">Powered by AI</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 relative">
            <a
              onClick={() => navigate('/user/add-task')}
              className={`transition duration-300 cursor-pointer px-2 py-1 ${
                isAITaskActive ? 'text-green-500 font-semibold' : 'text-gray-600 hover:text-green-500'
              }`}
            >
              AI task
            </a>
            <a
              onClick={() => navigate('/user/add-manual')}
              className={`transition duration-300 cursor-pointer px-2 py-1 ${
                isManualTaskActive ? 'text-green-500 font-semibold' : 'text-gray-600 hover:text-green-500'
              }`}
            >
              Manual Task
            </a>
            <button
              className="bg-gradient-to-br from-green-500 to-green-600 hover:from-[#8FE877] hover:to-green-500 text-white font-bold w-10 h-10 rounded-full transition-all duration-200 text-sm flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 ring-2 ring-white/20"
              onClick={() => navigate('/user/profile')}
            >
              {user&&user.userName?.[0]?.toUpperCase()}
            </button>
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button className="bg-gradient-to-br from-green-500 to-green-600 hover:from-[#8FE877] hover:to-green-500 text-white font-bold w-10 h-10 rounded-full transition-all duration-200 text-sm flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 ring-2 ring-white/20">
                  {user &&user.userName?.[0]?.toUpperCase()}
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[320px] sm:w-[400px] bg-gradient-to-br from-white via-white to-[#66B539]/5 border-l border-green-500 z-[70] transition-all duration-500"
              >
                <SheetHeader className="pb-6 border-b border-[#66B539]/10">
                  <SheetTitle className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-[#8FE877] rounded-xl flex items-center justify-center transform rotate-12 shadow-lg shadow-[#66B539]/25">
                        <Brain className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-green-500 to-[#66B539] rounded-full animate-pulse shadow-sm"></div>
                    </div>
                      <span className="text-xl font-bold text-gray-900">{user&&user.userName}</span>
                   
                  </SheetTitle>
                </SheetHeader>

                {/* Sidebar Menu Items */}
                <nav className="flex flex-col gap-4 mt-6">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsMenuOpen(false);
                        }}
                        className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                          isActive
                            ? 'bg-green-500/10 text-green-600 font-semibold'
                            : 'text-gray-700 hover:text-green-500 hover:bg-green-500/5'
                        }`}
                      >
                        <div className="p-2 bg-green-500/10 rounded-md">
                          <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-green-500'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                {/* Quick Stats Section */}
                <div className="mt-8 p-4 bg-gradient-to-br from-gray-50 to-green-500/5 rounded-xl border border-gray-200/50">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>Quick Stats</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>Active Tasks</span>
                      <span className="font-semibold text-green-500">12</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Completed</span>
                      <span className="font-semibold text-gray-900">48</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>This Week</span>
                      <span className="font-semibold text-[#8FE877]">+15%</span>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-700 hover:text-green-500 hover:bg-green-500/5"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5 text-green-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
