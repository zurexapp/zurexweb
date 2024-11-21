import React from 'react';
import { Modal } from 'react-bootstrap'; // Assuming you're using react-bootstrap for Modals
import closeIcon from '../assets/ShieldFail.png'; // Adjust the path based on where closeIcon is located

const PlayStoreLinks = ({ show, handleClose, logo, textString, appStore1, appStore2 }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <button onClick={handleClose} className="custbutton">
          <img src={closeIcon} alt="close" />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="modalBtnContainers">
          <img src={logo} className="topLogoPagediv" alt="logo" />
          <p
            style={{
              fontSize: "1.813rem",
              lineHeight: "2.5rem",
              fontWeight: "bold",
              textAlign: "center",
              color: "#003978",
            }}
            className="paraModalWlal"
          >
            {textString.downloadAppTxtNew}
          </p>
          <div className="borderedDiv">
          <a href="https://apps.apple.com/in/app/zurex/id6642669628" target="_blank" rel="noopener noreferrer">
            <img src={appStore1} alt="App Store" />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.aczurex.app" target="_blank" rel="noopener noreferrer">
            <img src={appStore2} alt="Play Store" />
          </a>
        </div>
        
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PlayStoreLinks;
