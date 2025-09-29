"use client";

import { Target, BookOpen, Zap } from "lucide-react";

const StatisticsSection = () => {
  return (
    <div className="mt-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Practice Statistics</h3>
        <p className="text-muted-foreground">
          Track your progress across different topics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
          <Target className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            500+
          </div>
          <div className="text-sm text-muted-foreground">Total Questions</div>
        </div>
        <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-xl">
          <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            9
          </div>
          <div className="text-sm text-muted-foreground">Topics Available</div>
        </div>
        <div className="text-center p-6 bg-purple-50 dark:bg-purple-950/20 rounded-xl">
          <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            ∞
          </div>
          <div className="text-sm text-muted-foreground">Practice Sessions</div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;
