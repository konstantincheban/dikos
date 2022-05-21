export type EditAccountActionConfig = {
  type: 'edit';
  label: string;
  handler: (accountId: string) => void;
};

export type DeleteAccountActionConfig = {
  type: 'delete';
  label: string;
  handler: (accountId: string) => void;
};

export type AccountActions =
  | EditAccountActionConfig
  | DeleteAccountActionConfig;
