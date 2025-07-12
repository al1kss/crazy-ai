export interface ChatRequest {
  question: string;
  mode: 'naive' | 'local' | 'global' | 'hybrid';
}

export interface ChatResponse {
  answer: string;
  mode: string;
  status: string;
}

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
  icon?: JSX.Element;
  comingSoon?: boolean;
  onClick?: () => void;
}

export interface NavItem {
  name: string;
  href: string;
  icon?: JSX.Element;
}