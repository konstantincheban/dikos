import {
  IModalActionConfig,
  IModalOpenProps,
  IModalOptions,
  UpdateActionsConfigType,
} from './Modal.types';
import './Modal.scss';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import Button from '@base/Button';
import { classMap, setGlobalCSSVariable } from '@shared/utils';

const Modal = forwardRef(function Modal(props: unknown, ref) {
  // Default configurations for the Modal
  const defaultModalOptions: IModalOptions = {
    title: 'ModalTitle',
    actionsAlignment: 'right',
  };
  const defaultActions: IModalActionConfig[] = [
    {
      id: 'defaultCancel',
      label: 'Cancel',
      secondary: true,
      handler: (e, closeModal) => closeModal(),
    },
  ];
  const ANIMATION_DURATION = 300;

  const [showState, setShowState] = useState(false);
  const [modalOptions, setModalOptions] = useState(defaultModalOptions);
  const [actions, setActions] = useState(defaultActions);
  const [renderer, setRenderer] = useState<IModalOpenProps['renderer']>(<></>);

  const [fadeOut, setFadeOut] = useState(false);

  useImperativeHandle(ref, () => ({
    close() {
      closeModal();
    },
    open(props: IModalOpenProps) {
      const { renderer, options, actions } = props;
      setRenderer(renderer);
      setModalOptions(getModalOptions(options));
      setActions([...defaultActions, ...(actions ?? [])]);
      setShowState(true);
    },
    updateActionsState(updateActions: UpdateActionsConfigType) {
      const updatedActionsConfig = mergeActionConfigs(actions, updateActions);
      setActions(updatedActionsConfig);
    },
  }));

  useEffect(() => {
    setGlobalCSSVariable(
      '--modal-animation-duration',
      `${ANIMATION_DURATION}ms`,
    );
  }, []);

  useEffect(() => {
    if (!showState) setFadeOut(false);
  }, [showState]);

  const closeModal = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowState(false);
      setRenderer(<></>);
    }, ANIMATION_DURATION);
  };

  const getModalOptions = (options: IModalOptions) => ({
    ...defaultModalOptions,
    ...options,
  });

  const mergeActionConfigs = (
    actions: IModalActionConfig[],
    updateActions: UpdateActionsConfigType,
  ): IModalActionConfig[] => {
    return actions.map((actionConfig) => {
      // find existing action config by id
      const newActionConfig = updateActions.find(
        (item) => item.id === actionConfig.id,
      );
      // merge configs if there is one
      if (newActionConfig) {
        return {
          ...actionConfig,
          ...newActionConfig,
        };
      }
      return actionConfig;
    });
  };

  const handleActionClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    handler: IModalActionConfig['handler'],
  ) => {
    handler(e, closeModal);
  };

  const renderActions = () => {
    const { actionsAlignment } = modalOptions;
    return (
      <div
        className={classMap(
          { [actionsAlignment as string]: !!actionsAlignment },
          'ModalActions',
        )}
      >
        {actions.map((actionConfig, index) => (
          <Button
            key={`${actionConfig.label}_${index}`}
            secondary={actionConfig.secondary}
            disruptive={actionConfig.disruptive}
            disabled={actionConfig.disabled}
            className="ModalAction"
            onClick={(e) => handleActionClick(e, actionConfig.handler)}
          >
            <span>{actionConfig.label}</span>
          </Button>
        ))}
      </div>
    );
  };

  if (showState) {
    const { title } = modalOptions;
    return (
      <div className={classMap({ FadeOutDown: !!fadeOut }, 'ModalOverlay')}>
        <div className="ModalWrapper">
          <div className="ModalContainer">
            <div className="ModalTitle">{title}</div>
            <button className="ModalCloseButton" onClick={() => closeModal()}>
              &times;
            </button>
            <div className="ModalContent">{renderer}</div>
            {renderActions()}
          </div>
        </div>
      </div>
    );
  } else return null;
});

export default Modal;
