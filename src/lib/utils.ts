export interface ChatRequest {
  question: string;
  mode: 'naive' | 'local' | 'global' | 'hybrid';
}

export interface ChatResponse {
  answer: string;
  mode: string;
  status: string;
}

// Component Props
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  comingSoon?: boolean;
  onClick?: () => void;
}

// App State
export interface AppState {
  currentModel: 'fire-safety' | 'general' | 'physics' | 'custom';
  chatHistory: ChatResponse[];
  isLoading: boolean;
}

// Navigation
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}