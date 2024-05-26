import { Modal } from "flowbite-react";
import { useSelector } from 'react-redux';

export default function MediumModal({ openModal, setOpenModal, children }) {
  const { theme } = useSelector((state) => state.theme);

  return (
    <>
      <Modal show={openModal} size="md" onClose={()=> {setOpenModal(false)}} popup className={theme}>
        <Modal.Header />
        <Modal.Body>
          { children }
        </Modal.Body>
      </Modal>
    </>
  );
}