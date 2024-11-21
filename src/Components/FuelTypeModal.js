import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// import { textString } from '../assets/TextStrings';
import { getTextString } from "../assets/TextStrings";



const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker overlay for better contrast
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(10px)', // Blur effect for the background

  },
  content: {
    backgroundColor: '#fff',
    borderRadius: '12px', // Increased border-radius for a more modern look
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)', // Enhanced shadow for a more pronounced effect
    padding: '30px', // Increased padding for more spacious content
    width: '400px', // Increased width for a larger modal
    textAlign: 'center',
    position: 'relative',
  },
  header: {
    fontSize: '1.75em', // Larger header text
    marginBottom: '20px',
    color: '#333', // Slightly darker color for better readability
  },
  button: {
    backgroundColor: '#007bff',
    border: 'none',
    color: '#fff',
    padding: '12px 24px', // Larger padding for buttons
    margin: '10px', // Increased margin for spacing between buttons
    borderRadius: '6px', // Slightly larger border-radius
    cursor: 'pointer',
    fontSize: '1.1em', // Larger font size for better readability
    transition: 'background-color 0.3s ease, transform 0.2s ease', // Added transform transition for hover effect
  },
  buttonCancel: {
    backgroundColor: '#dc3545',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)', // Slightly scale up on hover
  },
};

function FuelTypeModal({ isOpen, onClose, onSelectFuelType }) {
  const { isArabicLanguage } = useSelector((state) => state.auth);   
  const textString = getTextString(isArabicLanguage);

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <h2 style={modalStyles.header}>{textString.fueltypeTxt}</h2>
        <button
          style={modalStyles.button}
          onClick={() => onSelectFuelType('petrol')}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = modalStyles.buttonHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = modalStyles.button.backgroundColor}
          onFocus={(e) => e.currentTarget.style.backgroundColor = modalStyles.buttonHover.backgroundColor}
          onBlur={(e) => e.currentTarget.style.backgroundColor = modalStyles.button.backgroundColor}
        >
         {textString.petrolTxt}
        </button>
        <button
          style={modalStyles.button}
          onClick={() => onSelectFuelType('diesel')}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = modalStyles.buttonHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = modalStyles.button.backgroundColor}
          onFocus={(e) => e.currentTarget.style.backgroundColor = modalStyles.buttonHover.backgroundColor}
          onBlur={(e) => e.currentTarget.style.backgroundColor = modalStyles.button.backgroundColor}
        >
          {textString.dieselTxt}
        </button>
       {/*  <button
          style={{ ...modalStyles.button, ...modalStyles.buttonCancel }}
          onClick={onClose}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = modalStyles.buttonHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = modalStyles.buttonCancel.backgroundColor}
          onFocus={(e) => e.currentTarget.style.backgroundColor = modalStyles.buttonHover.backgroundColor}
          onBlur={(e) => e.currentTarget.style.backgroundColor = modalStyles.buttonCancel.backgroundColor}
        >
          Cancel
        </button>
        */}
      </div>
    </div>
  );
}

FuelTypeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectFuelType: PropTypes.func.isRequired,
};

export default FuelTypeModal;
 