// These two containers are siblings in the DOM
import React from 'react'
import ReactDOM from 'react-dom'

interface ModelLayoutProps {
  children: React.ReactNode,
  close: () => void
}

const ModalLayout = ({ children, close }: ModelLayoutProps): JSX.Element => (
  <div className="modal">
    <div className="modal-content">
      <img className="icon" src="/images/x.png" alt="Close Modal" onClick={close} />
      {children}
    </div>
  </div>
)

const Modal = ({ children, close }: ModelLayoutProps): React.ReactPortal => ReactDOM.createPortal(
  <ModalLayout close={close}>{children}</ModalLayout>,
  document.body,
)

export default Modal
