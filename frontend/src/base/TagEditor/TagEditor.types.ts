export interface ITagEditorProps {
  categories: ICategoryItem[];
  tags?: ITagItem[];
  onChange: (tags: ITagItem[]) => void;
}

export interface ITagItemProps {
  keyProp: string;
  valueProp: string;
  onRemove: (value: string) => void;
}

export interface ICategoryItem {
  label: string;
  attributes: AttributeItem[];
}

export type AttributeItem = {
  label: string;
  value: string;
};

export interface ITagItem {
  key: string;
  value: string;
}
