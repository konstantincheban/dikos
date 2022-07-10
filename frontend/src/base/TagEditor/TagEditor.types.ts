export type TagItemType = ITagItem | ISingleTagItem;

export interface ITagEditorProps {
  categories: ICategoryItem[];
  singleTagMode: false;
  maxTagsCount?: number;
  placeholder?: string;
  tags?: ITagItem[];
  onChange: (tags: TagItemType[]) => void;
}

export interface ITagEditorSingleModeProps {
  categories: ICategoryItem[];
  singleTagMode: true;
  maxTagsCount?: number;
  placeholder?: string;
  tags?: ISingleTagItem[];
  onChange: (tags: TagItemType[]) => void;
}

export interface ITagItemProps {
  keyProp: string;
  valueProp?: string;
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

export interface ISingleTagItem {
  key: string;
  value?: string;
}

