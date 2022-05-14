import { ErrorMessage } from 'formik';
import './FieldErrorMessage.scss';

interface IFieldErrorMessageProps {
  name: string;
}

const FieldErrorMessage = (
  props: IFieldErrorMessageProps,
): React.ReactElement => {
  return (
    <ErrorMessage
      {...props}
      render={(msg) => <span className="error-msg">{msg}</span>}
    />
  );
};

export default FieldErrorMessage;
