const MessageBox = ({ msg, variant, children }) => {
  return (<div className={`alert alert-${variant || 'info'}`} > {msg} {children && children} </div >);
};

export default MessageBox;