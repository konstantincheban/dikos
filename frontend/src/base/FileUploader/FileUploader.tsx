import { FileUploaderProps } from './FileUploader.types';
import './FileUploader.scss';
import Button from '@base/Button';
import React, {
  forwardRef,
  LegacyRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

const FileUploader = forwardRef(function FileUploader(
  { dragDropMode, field, form, meta, ...props }: FileUploaderProps,
  ref,
) {
  const inputRef = useRef<HTMLInputElement>();
  const dropAreaRef = useRef<HTMLDivElement>();
  const [file, setFile] = useState<File | null>();

  useEffect(() => {
    // Field Mode
    setToFieldValue(file);
  }, [file]);

  const setToFieldValue = (value: File | null | undefined) => {
    if (form && field && file) {
      form.setFieldValue(field.name, value);
    }
  };

  useImperativeHandle(ref, () => ({
    getValue: () => file,
  }));

  const highlightDropArea = () => {
    dropAreaRef.current?.classList.add('highlight');
  };

  const unHighlightDropArea = () => {
    dropAreaRef.current?.classList.remove('highlight');
  };

  const handleSelectFile = (e: React.MouseEvent) => {
    e.preventDefault();
    inputRef?.current?.click();
  };

  const handleChangeSelectedFile = () => {
    unHighlightDropArea();
    const files = inputRef?.current?.files;
    if (files?.length && inputRef?.current?.files?.length) {
      const fileData = new DataTransfer();
      fileData.items.add(files[0]);
      inputRef.current.files = fileData.files;
      setFile(files[0]);
    }
  };

  const getFileInfoLabel = () => {
    return file ? file.name : 'No File chosen';
  };

  return (
    <div className="FileUploaderContainer">
      <div className="FileUploaderManager">
        <Button
          secondary
          size="small"
          className="FileUploaderButton"
          onClick={handleSelectFile}
        >
          <span>Select File</span>
        </Button>
        <input
          {...props}
          type="file"
          className="FileUploaderInput"
          ref={inputRef as LegacyRef<HTMLInputElement>}
          onChange={handleChangeSelectedFile}
        />
        <span className="FileUploaderInfo">{getFileInfoLabel()}</span>
      </div>
      {dragDropMode ? (
        <div
          ref={dropAreaRef as LegacyRef<HTMLDivElement>}
          className="FileUploaderDragDropPlace"
        >
          <input
            title={getFileInfoLabel()}
            className="DropArea"
            type="file"
            onChange={handleChangeSelectedFile}
            onDragEnter={highlightDropArea}
            onDragLeave={unHighlightDropArea}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          ></input>
          <span className="DropMessage">Drag & Drop file here ...</span>
        </div>
      ) : (
        ''
      )}
    </div>
  );
});

export default FileUploader;
