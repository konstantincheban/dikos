import { IAccountCardProps } from './AccountCard.types';
import './AccountCard.scss';
import Card from '@base/Card';
import { classMap } from '@shared/utils';
import { DeleteIcon, EditIcon } from '@base/Icon/IconSet';
import { AccountActions } from '@components/AccountsView/AccountsView.types';
import Icon from '@base/Icon';

function AccountCard(props: IAccountCardProps) {
  const {
    _id,
    name,
    description,
    ballance,
    currency,
    className,
    actions,
    onClick,
  } = props;

  const getActionIconByType = (type: string): React.ReactElement => {
    if (type === 'edit') return <EditIcon />;
    if (type === 'delete') return <DeleteIcon />;
    return <></>;
  };

  const renderAction = (action: AccountActions) => {
    const { label, type, handler } = action;
    return (
      <div
        key={type}
        title={label}
        className="AccountCardAction"
        onClick={() => handler(_id)}
      >
        <Icon size={24} icon={getActionIconByType(type)} />
      </div>
    );
  };

  return (
    <Card
      className={classMap(
        { [className as string]: !!className },
        'AccountCard',
      )}
      onClick={onClick}
    >
      <div className="AccountTitle">
        <span>{name}</span>
      </div>
      <div className="AccountDescription">
        <span>{description}</span>
      </div>
      <div className="AccountBallance">
        <span>{ballance ?? 0}</span>
      </div>
      <div className="AccountCurrency">
        <span>{currency}</span>
      </div>
      <div className="AccountCardActionsContainer">
        {actions?.map((action) => renderAction(action))}
      </div>
    </Card>
  );
}

export default AccountCard;
