export interface IAccountCardProps {
  name: string;
  description: string;
  currency: string;
  ballance: number;
  className?: string;
  onClick?: () => void;
}
