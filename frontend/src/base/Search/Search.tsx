import React from 'react';
import Icon from '@base/Icon';
import { SearchIcon } from '@base/Icon/IconSet';
import { ISearchProps } from './Search.types';
import './Search.scss';

function Search(props: ISearchProps) {
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    props.onChange(value);
  };

  return (
    <div className="SearchContainer">
      <Icon icon={<SearchIcon />} />
      <div className="SearchInputContainer">
        <input
          type="text"
          placeholder="Search something..."
          onChange={handleChangeInput}
        />
      </div>
    </div>
  );
}

export default Search;
