import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import companies from './data/companies.json';

const Breakpoints = ({ modelState }) => {
  return <>Screen: {useMedia(`(max-width: 768px)`) ? 'small' : 'wide'}</>;
};

const DroppableItem = ({
  componentName,
  label,
  onAddDragMouseDown,
  componentOptions,
}) => {
  const Component = () => {
    return <div>ITEM</div>;
  };
  return (
    <div
      onMouseDown={onAddDragMouseDown({
        name: label,
        component: Component,
      })}
      onTouchStart={onAddDragMouseDown({
        name: label,
        component: Component,
      })}
    >
      <span style={{ fontWeight: 'bold' }}>::</span> {label}
    </div>
  );
};

const Droppables = ({ onAddDragMouseDown, model }) => {
  const [models1, setModels] = useState([]);

  useEffect(() => {
    setModels(companies);
  }, []);

  console.log('models1', models1);

  return (
    <aside className="flexlayoutAside">
      {models1.map((model, index) => {
        // console.log('model', model);
        return (
          <DroppableItem
            key={index}
            componentName={model.options?.selectedPage?.label}
            label={model.options?.selectedPage?.label}
            onAddDragMouseDown={onAddDragMouseDown}
            componentOptions={model.options}
          />
        );
      })}
    </aside>
  );
};

export default Droppables;
