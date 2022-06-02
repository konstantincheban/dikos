import { classMap } from '@shared/utils';
import React from 'react';
import './Card.scss';
import { ICardProps } from './Card.types';

function Card(props: React.PropsWithChildren<ICardProps>) {
  const { className, children, onClick, titleRenderer } = props;
  return (
    <div
      onClick={onClick}
      className={classMap(
        { [className as string]: !!className },
        'CardContainer',
      )}
    >
      {titleRenderer ? <div className="CardTitle">{titleRenderer()}</div> : ''}
      {children}
    </div>
  );
}

export default Card;
