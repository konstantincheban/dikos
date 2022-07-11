import {
  ICategoryItem,
  ITagEditorProps,
  ITagEditorSingleModeProps,
  TagItemType,
  ITagItemProps,
} from './TagEditor.types';
import './TagEditor.scss';
import Input from '@base/Input';
import { ChangeEvent, createRef, Fragment, useEffect, useState } from 'react';
import { Option } from '@base/Select';
import { classMap } from '@shared/utils';
import { CloseIcon } from '@base/Icon/IconSet';
import Icon from '@base/Icon';
import { FieldProps } from 'formik';

const CategoryTitle = (props: { label: string }) => {
  return <div className="CategoryTitle">{props.label}</div>;
};

const TagItem = (props: ITagItemProps) => {
  const keyValueRenderer = () => {
    return <>
      <span className="TagKey">{props.keyProp}</span>
      <span className="TagValue">{props.valueProp}</span>
    </>
  }

  const singleTagRenderer = () => {
    return <>
      <span className="TagKey">{props.keyProp}</span>
    </>
  }

  return (
    <div className="TagItem">
      {props.valueProp ? keyValueRenderer() : singleTagRenderer()}
      <button
        className="RemoveTag"
        onClick={() => props.onRemove(props.keyProp)}
      >
        <Icon size={15} icon={<CloseIcon />} />
      </button>
    </div>
  );
};

function TagEditor(props: (ITagEditorProps | ITagEditorSingleModeProps) & Partial<FieldProps>) {
  const {
    categories: categoriesProps,
    tags: tagsProps,
    singleTagMode,
    maxTagsCount,
    field,
    form,
    placeholder,
    onChange
  } = props;
  const [collapsedList, setCollapsedList] = useState(true);
  const [categoriesList, setCategoriesList] = useState<ICategoryItem[]>();
  const [currentTagKey, setCurrentTagKey] = useState('');
  const [currentTagValue, setCurrentTagValue] = useState('');
  const [tagsState, setTagsState] = useState<TagItemType[]>([]);

  const inputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (categoriesProps) setCategoriesList(categoriesProps);
  }, [categoriesProps]);

  useEffect(() => {
    if (tagsProps?.length) setTags(tagsProps);
  }, [tagsProps]);

  useEffect(() => {
    if (onChange) onChange(tagsState);
    if (form && field && tagsState) setToFieldValue(getControlValue(tagsState));
  }, [tagsState]);

  // ---------- Control Functionality ----------- //

  const setToFieldValue = (value: string | null | undefined) => {
    if (form && field && value) {
      form.setFieldValue(field.name, value);
    }
  };

  const getControlValue = (tagsState: TagItemType[]) => tagsState.map(tag => tag.key).join(' ');

  // ---------- Control Functionality ----------- //

  const isDisabledActions = () => tagsState.length >= (maxTagsCount ?? 1);

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
    // use key instead of values in the single tag mode
    if (singleTagMode) setCurrentTagKey(value);
    else setCurrentTagValue(parseAttributeValue(value));
  };

  // -------  STRATEGY SPECIFIC --------- //

  const parseAttributeValue = (value: string) => {
    if (value.includes(':')) return value.split(':')[1];
    return '';
  };

  const computedFilterValue = () => {
    if (currentTagKey && !singleTagMode) return `${currentTagKey}:${currentTagValue}`;
    if (currentTagKey && singleTagMode) return `${currentTagKey}`;
    return '';
  };

  const handleCreateTag = (e: React.KeyboardEvent) => {
    const { key } = e;
    if (isDisabledActions()) return null;
    if (key === 'Enter') {
      if (currentTagKey && currentTagValue && !singleTagMode) {
        const updateTags = [
          ...tagsState,
          { key: currentTagKey, value: currentTagValue },
        ];
        setTags(updateTags);
        setCurrentTagKey('');
        setCurrentTagValue('');
      } else if (singleTagMode && currentTagKey) {
        setTags([{ key: currentTagKey }]);
        setCurrentTagKey('');
      }

      setCollapsedList(true);
    }
    if (key === 'ArrowDown') setCollapsedList(false);
  };

  // -------  STRATEGY SPECIFIC --------- //

  const handleBlur = (e: React.FocusEvent) => {
    const currentTarget = e.currentTarget;
    // Give browser time to focus the next element
    requestAnimationFrame(() => {
      // Check if the new focused element is a child of the original container
      if (!currentTarget.contains(document.activeElement)) {
        setCollapsedList(true);
      }
    });
  };

  const handleRemoveTag = (value: string) => {
    const updateTags = tagsState.filter((tag) => tag.key !== value);
    setTags(updateTags);
  };

  const setTags = (tags: TagItemType[]) => {
    setTagsState(tags);
    filterAttributeList(tags);
  };

  const filterAttributeList = (tags: TagItemType[]) => {
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
    <div
      className="TagEditorContainer"
      onBlur={handleBlur}
    >
      <Input
        ref={inputRef}
        value={computedFilterValue()}
        placeholder={placeholder ?? "Filter by attributes ..."}
        disabled={isDisabledActions()}
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
                collapsed={collapsedList}
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
