import {
  IModalActionConfig,
  IModalOpenProps,
  IModalOptions,
  UpdateActionsConfigType,
} from './Modal.types';
import './Modal.scss';
import React, {
  forwardRef,
  LegacyRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Button from '@base/Button';
import { classMap, setGlobalCSSVariable } from '@shared/utils';
import { CloseIcon } from '@base/Icon/IconSet';
import Icon from '@base/Icon';

const Modal = forwardRef(function Modal(props: unknown, ref) {
  // Default configurations for the Modal
  const defaultModalOptions: IModalOptions = {
    title: 'ModalTitle',
    actionsAlignment: 'right',
    closeOnBackdrop: true,
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

  const wrapperRef = useRef<HTMLDivElement>();

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
      setTimeout(() => wrapperRef?.current?.focus(), 300);
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

  const handleModalKeydown = (evt: React.KeyboardEvent) => {
    const { key } = evt;
    if (key === 'Escape') closeModal();
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
    const { title, closeOnBackdrop } = modalOptions;
    return (
      <div
        className={classMap({ FadeOutDown: !!fadeOut }, 'ModalOverlay')}
        onClick={() => closeOnBackdrop && closeModal()}
      >
        <div
          ref={wrapperRef as LegacyRef<HTMLDivElement>}
          tabIndex={0}
          className="ModalWrapper"
          onKeyDown={handleModalKeydown}
          onClick={(evt) => evt.stopPropagation()}
        >
          <div className="ModalContainer">
            <div className="ModalTitle">{title}</div>
            <button className="ModalCloseButton" onClick={() => closeModal()}>
              <Icon icon={<CloseIcon />} />
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
