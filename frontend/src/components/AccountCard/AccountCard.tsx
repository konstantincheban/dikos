import { IAccountCardProps } from './AccountCard.types';
import './AccountCard.scss';
import Card from '@base/Card';
import { classMap } from '@shared/utils';

function AccountCard(props: IAccountCardProps) {
  const { name, description, ballance, currency, className, onClick } = props;
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
        <span>{ballance}</span>
      </div>
      <div className="AccountCurrency">
        <span>{currency}</span>
      </div>
    </Card>
  );
}

export default AccountCard;
