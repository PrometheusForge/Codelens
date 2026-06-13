import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          Welcome to <span className="text-emerald-500">CodeLens</span>
        </h1>
        
        <p className="text-xl text-gray-400 leading-relaxed">
          Advanced code evaluation and real-time analytics. Level up your development workflow with intelligent insights and interactive challenges.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            to="/dashboard" 
            className="px-8 py-3 text-lg font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors duration-200 w-full sm:w-auto"
          >
            Go to Dashboard
          </Link>
          <Link 
            to="/challenges" 
            className="px-8 py-3 text-lg font-semibold text-gray-300 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200 w-full sm:w-auto"
          >
            View Challenges
          </Link>
        </div>
      </div>
      
      {/* Dynamic visual elements or automated stats can be injected here later */}
    </div>
  );
};

export default Home;