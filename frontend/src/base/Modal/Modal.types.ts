export interface IModalProps {
  close: () => {};
  /**
   * Open modal window with specific options
   *
   * Props:
   * @param {IModalOptions} options - @see {@link IModalOptions}
   * @example ```{ title: 'Test', actionsAlignment: 'left' (right by default) }```
   * @param {Element} renderer - Modal Content Component
   * @example <div className="content">I'm inside</div>
   * @param {IModalActionConfig[]} actions (optional) - Modal actions config. By default using the cancel button to close the modal
   * @example ```[{ label: 'Button', secondary: true, handler: (e, closeModal) => ... }]```
   */
  open: (props: IModalOpenProps) => {};
}

export interface IModalOpenProps {
  options: IModalOptions;
  renderer: React.ReactElement;
  actions?: IModalActionConfig[];
}

export interface IModalOptions {
  title: string;
  actionsAlignment?: 'left' | 'center' | 'right';
}

export interface IModalActionConfig {
  label: string;
  secondary?: Boolean;
  disruptive?: Boolean;
  handler: (e: React.MouseEvent, closeModal: () => any) => any;
}