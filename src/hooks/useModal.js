import { useState } from "react";

export const useMoal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [userSelected, setUserSelected] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);
  const setModalStatus = (newStatus) => setStatus(newStatus);
  const setModalSelected = (newCheck) => setUserSelected(newCheck);

  return {
    isOpen,
    toggleModal,
    status,
    setModalStatus,
    userSelected,
    setModalSelected,
  };
};
