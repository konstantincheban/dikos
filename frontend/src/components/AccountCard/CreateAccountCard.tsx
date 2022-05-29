import Card from '@base/Card';
import Icon from '@base/Icon';
import { OutlinedPlusIcon } from '@base/Icon/IconSet';
import { classMap } from '@shared/utils';
import { ICreateAccountCardProps } from './AccountCard.types';
import './CreateAccountCard.scss';

function CreateAccountCard(props: ICreateAccountCardProps) {
  const { className, onClick } = props;
  return (
    <Card
      className={classMap(
        { [className as string]: !!className },
        'CreationCart',
      )}
      onClick={onClick}
    >
      <span>Create New Account</span>
      <Icon size={45} icon={<OutlinedPlusIcon />} />
    </Card>
  );
}

export default CreateAccountCard;
