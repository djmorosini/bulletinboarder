import React from 'react';
import ReactDOM from 'react-dom';
import VerticalList2 from './Components/VerticalList2';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<VerticalList2 />, div);
  ReactDOM.unmountComponentAtNode(div);
});
