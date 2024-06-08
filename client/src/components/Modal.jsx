import { Modal } from "flowbite-react";
import { useSelector } from 'react-redux';

export default function ModalBox({ openModal, setOpenModal, setModalContent=null, children }) {
  const { theme } = useSelector((state) => state.theme);
  const handleOnClose = (e) => {
    e.preventDefault();
    setOpenModal(false); 
    if(setModalContent) setModalContent('login');
  }
  return (
    <>
      <Modal show={openModal} size="md" onClose={handleOnClose} popup className={theme}>
        <Modal.Header />
        <Modal.Body>
          { children }
        </Modal.Body>
      </Modal>
    </>
  );
}