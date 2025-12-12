'use client';

import { Home, BookOpen, MessageSquare, Settings,Calculator, ChevronLeft, ChevronRight, Users, FileText, Briefcase, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/store/useAuth';

const navItems = [
  { name: 'Dashboard', icon: Home, href: '/home' },
  { name: 'Quizzes', icon: MessageSquare, href: '/home/quizz' },
  { name: 'Aptitude Practice', icon: Calculator, href: '/home/aptitude' },
  { name: 'Resume Analyzer', icon: Users, href: '/home/resume' },
  { name: 'Latest Articles', icon: FileText, href: '/home/articles' },
  { name: 'Help & Support', icon: HelpCircle, href: '/home/help' },
  { name: 'Openings', icon: BookOpen, href: '/home/openings' },
  { name: 'Study Material', icon: Settings, href: '/home/study' },
  { name: 'Mock Interviews', icon: Briefcase, href: '/home/mockinterview' },
];

const SideBar = ({ isCollapsed, onToggleCollapse, activeItem = '/home' }) => {
  const currUser  = useAuth((state) => state.getUserInfo());
  return (
    <div className={cn(
      'h-screen bg-background border-r flex flex-col transition-all duration-300 ease-in-out fixed top-0 left-0 z-40',
      isCollapsed ? 'w-20' : 'w-60'
    )}>
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && <h1 className="text-xl font-bold">PlacementPrep</h1>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleCollapse}
          className="ml-auto hover:bg-accent hover:text-accent-foreground"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <Button
                  variant={activeItem === item.href ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start transition-colors hover:bg-accent hover:text-accent-foreground',
                    isCollapsed ? 'justify-center px-2' : 'px-4',
                    activeItem === item.href && 'bg-accent/80 font-medium'
                  )}
                >
                  <item.icon className={cn('h-5 w-5 flex-shrink-0', !isCollapsed && 'mr-3')} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className={cn(
        'p-4 border-t flex items-center',
        isCollapsed ? 'justify-center' : 'justify-between',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      )}>
        {!isCollapsed ? (
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
              <span className="text-sm font-medium">
                {currUser?.user?.fullname ? currUser.user.fullname.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">
                {currUser?.user?.fullname || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">Free Plan</p>
            </div>
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium">U</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;