export interface IModalProps {
  close: () => void;
  /**
   * Open modal window with specific options
   *
   * Props:
   * @param {IModalOptions} options - @see {@link IModalOptions}
   * @example ```{ title: 'Test', actionsAlignment: 'left' (right by default) }```
   * @param {Element} renderer - Modal Content Component
   * @example <div className="content">I'm inside</div>
   * @param {IModalActionConfig[]} actions (optional) - Modal actions config. By default using the cancel button to close the modal
   * @example ```[{ id: 'idButton', label: 'Button', secondary: true, handler: (e, closeModal) => ... }]```
   */
  open: (props: IModalOpenProps) => void;
  /**
   * Update Actions config by id
   * @example ```[{ id: 'idButton', disabled: true }]```
   */
  updateActionsState: (updateAction: UpdateActionsConfigType) => void;
}

export interface IModalOpenProps {
  options: IModalOptions;
  renderer: React.ReactElement;
  actions?: IModalActionConfig[];
}

export interface IModalOptions {
  title: string;
  actionsAlignment?: 'left' | 'center' | 'right';
  closeOnBackdrop?: boolean;
}

export interface IModalActionConfig {
  readonly id: string;
  label: string;
  secondary?: boolean;
  disruptive?: boolean;
  disabled?: boolean;
  handler: (
    e: React.MouseEvent,
    closeModal: () => void,
    formData?: unknown,
  ) => void;
}

export type UpdateActionsConfigType = Pick<
  IModalActionConfig,
  'disabled' | 'id'
>[];
