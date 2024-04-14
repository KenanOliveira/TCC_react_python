import React from 'react';

function Message({ type, message, onClose }) {
  return (
    <div className={`alert ${type === 'error' ? 'alert-danger' : 'alert-success'} fade show alert-dismissible`} style={{width: '100%'}} role="alert">
      {message}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
}

export default Message;