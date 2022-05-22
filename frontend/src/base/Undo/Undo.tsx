import './Undo.scss';

interface IUndoProps {
  entryName?: string;
  onUndo: () => void;
  closeToast?: () => void;
}

const Undo = ({ onUndo, closeToast, entryName }: IUndoProps) => {
  const handleClick = () => {
    onUndo();
    closeToast && closeToast();
  };

  return (
    <div className="UndoContainer">
      <span>{`Entry${
        entryName ? ` - ${entryName}` : ''
      } will be removed`}</span>
      <button onClick={handleClick}>Undo</button>
    </div>
  );
};

export default Undo;
