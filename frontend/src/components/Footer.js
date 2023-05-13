const Footer = ({ crop }) => {
  return (
    <footer className={`footer py-1 ${crop ? 'minus-240' : ''}`}>
      <div className="container">
        <div className="row">
          <div className="col py-4 text-center">
            <h3 className="text-white font-weight-light">
              Hotel Management System Based on Hybrid Recommendation System
            </h3>
            <p className="d-block text-white-50">copyright &copy; Iqra & Beenish <span className="d-block text-white mt-1">{new Date().toISOString().slice(0, 10)}</span> </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;