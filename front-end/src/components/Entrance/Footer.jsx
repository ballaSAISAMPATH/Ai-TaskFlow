import React from 'react';
import { Brain } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 bg-[#66B539] rounded-xl flex items-center justify-center transform rotate-12">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#66B539] rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  AI TaskFlow
                </span>
                <div className="text-xs text-[#66B539] font-medium">Powered by AI</div>
              </div>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              Experience the future of task management with AI that understands your workflow, 
              automatically prioritizes tasks, and helps you achieve more with intelligent automation.
            </p>
          </div>
          
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
              <Brain className="w-4 h-4 mr-2 text-[#66B539]" />
              AI Features
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-[#66B539] transition-colors duration-200">Smart Breakdown</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#66B539] transition-colors duration-200">Auto Prioritization</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#66B539] transition-colors duration-200">Smart Scheduling</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#66B539] transition-colors duration-200">AI Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-[#66B539] transition-colors duration-200">AI Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#66B539] transition-colors duration-200">Contact AI Support</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#66B539] transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#66B539] transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 AI TaskFlow. All rights reserved. Powered by advanced AI technology.
            </p>
            <div className="flex items-center mt-4 md:mt-0 space-x-2">
              <div className="w-2 h-2 bg-[#66B539] rounded-full animate-pulse"></div>
              <p className="text-[#66B539] text-sm font-medium">AI Status: Online</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;