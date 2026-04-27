export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

export type ModuleId = 'home' | 'welfare' | 'realization' | 'roles' | 'education' | 'importance' | 'tasks' | 'millionaire' | 'trajectory';

export interface UserState {
  xp: number;
  level: number;
  completedModules: string[];
  achievements: string[];
  name: string;
  goal: string;
}
