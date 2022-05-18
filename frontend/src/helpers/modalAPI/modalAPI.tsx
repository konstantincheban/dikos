import Modal from '@base/Modal';
import { IModalProps } from '@base/Modal/Modal.types';
import React, { createContext, createRef, useContext } from 'react';

const ModalAPIContext = createContext({
  modalRef: createRef<IModalProps>(),
});

/**
 * ModalAPI - progressive way to control Modals
 *
 * Use ```modalRef.current.${action}```:
 *
 * - ```open(options: IModalProps)```
 * - ```close()```
 */
export const useModalAPI = () => useContext(ModalAPIContext);

export const ModalAPIProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const modalRef = createRef<IModalProps>();

  return (
    <ModalAPIContext.Provider
      value={{
        modalRef,
      }}
    >
      <Modal ref={modalRef} />
      {children}
    </ModalAPIContext.Provider>
  );
};
