export type KeyValueType = {
  [key: string]: string;
};

export type Error = {
  message: string;
};

export interface IModalFormRef {
  submitForm: () => void;
}
