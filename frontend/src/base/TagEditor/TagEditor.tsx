import {
  ICategoryItem,
  ITagEditorProps,
  ITagItem,
  ITagItemProps,
} from './TagEditor.types';
import './TagEditor.scss';
import Input from '@base/Input';
import { ChangeEvent, createRef, Fragment, useEffect, useState } from 'react';
import { Option } from '@base/Select';
import { classMap } from '@shared/utils';
import { CloseIcon } from '@base/Icon/IconSet';
import Icon from '@base/Icon';

const CategoryTitle = (props: { label: string }) => {
  return <div className="CategoryTitle">{props.label}</div>;
};

const TagItem = (props: ITagItemProps) => {
  return (
    <div className="TagItem">
      <span className="TagKey">{props.keyProp}</span>
      <span className="TagValue">{props.valueProp}</span>
      <button
        className="RemoveTag"
        onClick={() => props.onRemove(props.keyProp)}
      >
        <Icon size={15} icon={<CloseIcon />} />
      </button>
    </div>
  );
};

function TagEditor(props: ITagEditorProps) {
  const { categories: categoriesProps, tags: tagsProps, onChange } = props;
  const [collapsedList, setCollapsedList] = useState(true);
  const [categoriesList, setCategoriesList] = useState<ICategoryItem[]>();
  const [currentTagKey, setCurrentTagKey] = useState('');
  const [currentTagValue, setCurrentTagValue] = useState('');
  const [tagsState, setTagsState] = useState<ITagItem[]>([]);

  const inputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (categoriesProps) setCategoriesList(categoriesProps);
    // if (tagsProps) setTags(tagsProps);
  }, [categoriesProps]);

  useEffect(() => {
    if (tagsProps?.length) setTags(tagsProps);
  }, [tagsProps]);

  useEffect(() => {
    onChange(tagsState);
  }, [tagsState]);

  const toggleCategoriesList = () => {
    setCollapsedList(!collapsedList);
  };

  const handleSelectAttribute = (value: string) => {
    setCurrentTagKey(value);
    setCollapsedList(true);
    inputRef?.current?.focus();
  };

  const handleChangeValue = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    setCurrentTagValue(parseAttributeValue(value));
  };

  const parseAttributeValue = (value: string) => {
    if (value.includes(':')) return value.split(':')[1];
    return '';
  };

  const computedFilterValue = () => {
    if (currentTagKey) return `${currentTagKey}:${currentTagValue}`;
    return '';
  };

  const handleCreateTag = (e: React.KeyboardEvent) => {
    const { key } = e;
    if (key === 'Enter' && currentTagKey && currentTagValue) {
      const updateTags = [
        ...tagsState,
        { key: currentTagKey, value: currentTagValue },
      ];
      setTags(updateTags);
      setCurrentTagKey('');
      setCurrentTagValue('');
    }
    if (key === 'ArrowDown') setCollapsedList(false);
  };

  const handleRemoveTag = (value: string) => {
    const updateTags = tagsState.filter((tag) => tag.key !== value);
    setTags(updateTags);
  };

  const setTags = (tags: ITagItem[]) => {
    setTagsState(tags);
    filterAttributeList(tags);
  };

  const filterAttributeList = (tags: ITagItem[]) => {
    const filteredAttributes = categoriesProps.reduce((acc, category) => {
      const attributes = category.attributes.filter(
        (category) => !tags.some((tag) => tag.key === category.value),
      );

      acc.push({
        ...category,
        attributes,
      });
      return acc;
    }, [] as ICategoryItem[]);
    setCategoriesList(filteredAttributes);
  };

  return (
    <div className="TagEditorContainer">
      <Input
        ref={inputRef}
        value={computedFilterValue()}
        placeholder="Filter by attributes ..."
        onClick={toggleCategoriesList}
        onChange={handleChangeValue}
        onKeyDown={handleCreateTag}
        aria-haspopup="listbox"
        aria-expanded={!collapsedList}
      />
      <div className="TagsContainer">
        {tagsState.map((tag) => (
          <TagItem
            key={tag.key}
            keyProp={tag.key}
            valueProp={tag.value}
            onRemove={handleRemoveTag}
          />
        ))}
      </div>
      <ul
        className={classMap({ collapsed: collapsedList }, 'OptionsContainer')}
        role="listbox"
      >
        {categoriesList?.map(({ label, attributes }) => (
          <Fragment
            key={`${label}_${attributes.map((item) => item.value).join('&')}`}
          >
            <CategoryTitle label={label} />
            {attributes.map((attr) => (
              <Option
                key={attr.value}
                {...attr}
                onSelect={handleSelectAttribute}
              />
            ))}
          </Fragment>
        ))}
      </ul>
    </div>
  );
}

export default TagEditor;
