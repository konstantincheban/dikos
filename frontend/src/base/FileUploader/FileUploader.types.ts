import { FieldProps } from 'formik';

export type FileUploaderProps = React.InputHTMLAttributes<HTMLInputElement> &
  Partial<FieldProps> & {
    dragDropMode?: boolean;
  };

export type FileUploaderRef = {
  getValue: () => string;
};
