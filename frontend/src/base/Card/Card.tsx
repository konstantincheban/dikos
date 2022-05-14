import { classMap } from '@shared/utils';
import React from 'react';
import './Card.scss';
import { ICardProps } from './Card.types';

function Card(props: React.PropsWithChildren<ICardProps>) {
  const { className, children, onClick } = props;
  return (
    <div
      onClick={onClick}
      className={classMap(
        { [className as string]: !!className },
        'CardContainer',
      )}
    >
      {children}
    </div>
  );
}

export default Card;
