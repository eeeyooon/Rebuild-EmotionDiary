function Modal({ handleModal, modalStatus, setModalCheck }) {
  return (
    <div className="Modal_Wrapper">
      <p className="Modal_Text">일기를 {modalStatus}하시겠습니까?</p>
      <div className="Modal_Btn_Wrapper">
        <button className="Modal_Btn" onClick={() => setModalCheck(true)}>
          {modalStatus}
        </button>
        <button
          className="Modal_Btn"
          onClick={() => {
            handleModal(false);
          }}
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default Modal;
