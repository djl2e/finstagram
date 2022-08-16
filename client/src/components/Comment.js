import React, { useState } from 'react';
import ReactQuill from 'react-quill';

function Comment() {
  const [value, setValue] = useState('');

  return <ReactQuill theme="bubble" value={value} onChange={setValue} />;
}

export default Comment;
