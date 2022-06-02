export interface ICardProps {
  className?: string;
  titleRenderer?: () => React.ReactElement;
  onClick?: () => void;
}
