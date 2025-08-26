import React from 'react';

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="flex flex-col items-center space-y-6">
        
        {/* Animated Logo Container */}
        <div className="relative flex items-center justify-center">
          {/* Central Logo Circle */}
          <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
            <div className="text-white font-bold text-sm tracking-wider">
              CRM MED
            </div>
            {/* Inner glow effect */}
            <div className="absolute inset-2 bg-gradient-to-br from-blue-400 to-transparent rounded-full opacity-30"></div>
          </div>
          
          {/* Orbiting Dots */}
          <div className="absolute w-32 h-32 animate-spin" style={{animationDuration: '3s'}}>
            {/* Dot 1 */}
            <div className="absolute w-4 h-4 bg-blue-400 rounded-full top-0 left-1/2 transform -translate-x-1/2 shadow-lg animate-pulse"></div>
            {/* Dot 2 */}
            <div className="absolute w-3 h-3 bg-blue-500 rounded-full top-6 right-6 shadow-lg animate-pulse" style={{animationDelay: '0.5s'}}></div>
            {/* Dot 3 */}
            <div className="absolute w-5 h-5 bg-indigo-400 rounded-full right-0 top-1/2 transform -translate-y-1/2 shadow-lg animate-pulse" style={{animationDelay: '1s'}}></div>
            {/* Dot 4 */}
            <div className="absolute w-3 h-3 bg-blue-600 rounded-full bottom-6 right-6 shadow-lg animate-pulse" style={{animationDelay: '1.5s'}}></div>
            {/* Dot 5 */}
            <div className="absolute w-4 h-4 bg-indigo-500 rounded-full bottom-0 left-1/2 transform -translate-x-1/2 shadow-lg animate-pulse" style={{animationDelay: '2s'}}></div>
            {/* Dot 6 */}
            <div className="absolute w-3 h-3 bg-blue-400 rounded-full bottom-6 left-6 shadow-lg animate-pulse" style={{animationDelay: '2.5s'}}></div>
            {/* Dot 7 */}
            <div className="absolute w-5 h-5 bg-indigo-600 rounded-full left-0 top-1/2 transform -translate-y-1/2 shadow-lg animate-pulse" style={{animationDelay: '3s'}}></div>
            {/* Dot 8 */}
            <div className="absolute w-3 h-3 bg-blue-500 rounded-full top-6 left-6 shadow-lg animate-pulse" style={{animationDelay: '0.2s'}}></div>
          </div>
          
          {/* Outer Ring Animation */}
          <div className="absolute w-36 h-36 border-2 border-blue-200 rounded-full animate-ping opacity-20"></div>
          <div className="absolute w-40 h-40 border border-indigo-200 rounded-full animate-ping opacity-10" style={{animationDelay: '1s'}}></div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading Status */}
        <p className="text-gray-500 text-sm font-light animate-pulse">
          Инициализация системы...
        </p>
      </div>
    </div>
  );
}

export default LoadingSkeleton;