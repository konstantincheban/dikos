import './Loader.scss';

function Loader() {
  return (
    <div className="LoaderContainer">
      <div className="fancy-spinner">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}

export default Loader;
