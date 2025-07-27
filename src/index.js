import React from 'react';
import ReactDOM from 'react-dom/client'; // 또는 'react-dom'
import './index.css'; // 필요하다면 CSS 파일을 임포트
import LibraryComparisonDemo from './LibraryComparisonDemo'; // 생성한 컴포넌트 임포트

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LibraryComparisonDemo />
  </React.StrictMode>
);
