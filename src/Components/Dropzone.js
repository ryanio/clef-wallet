import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { white } from 'ansi-colors';

export default function Dropzone(props) {
  const dropzoneStyle = {
    border: '2px dashed #0087F7',
    borderRadius: 5,
    background: 'white',
    padding: 50,
    textAlign: 'center',
    fontSize: 17,
    color: '#444',
    cursor: 'pointer'
  };
  const dropzoneActiveDragStyle = {
    background: '#0087F7',
    borderColor: '#fff',
    color: '#fff'
  };
  const onDrop = useCallback(props.onDrop, [props.onDrop]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop
  });
  return (
    <div
      {...getRootProps()}
      style={{
        ...dropzoneStyle,
        ...(isDragActive ? dropzoneActiveDragStyle : null)
      }}
    >
      <input {...getInputProps()} directory="" webkitdirectory="" type="file" />
      {isDragActive ? (
        <p>Drop here...</p>
      ) : (
        <p>Drag and drop a file or folder here, or click to browse.</p>
      )}
    </div>
  );
}

Dropzone.propTypes = {
  onDrop: PropTypes.func.isRequired
};
