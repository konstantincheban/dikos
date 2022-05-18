import Button from '@base/Button';
import Icon from '@base/Icon';
import { PageNotFoundIcon } from '@base/Icon/IconSet';
import { Link } from 'react-router-dom';
import './PageNotFound.scss';

function PageNotFound() {
  return (
    <div className="PageNotFoundContainer">
      <Icon size={200} icon={<PageNotFoundIcon />} />
      <div className="InfoContent">
        <div className="Title">404</div>
        <div className="Description">Looks like this page is missing</div>
        <div className="ActionContainer">
          <span className="WhyNot">Anyway, why do not try again by going</span>
          <Button>
            <Link to="/">Go To Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
