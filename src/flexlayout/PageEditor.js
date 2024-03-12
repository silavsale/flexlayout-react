import React, { useEffect, useRef, useState } from "react";
import { useMedia } from "react-use";
import { Layout, Model, Actions } from 'flexlayout-react';

import "flexlayout-react/style/light.css";
import LayoutModel from './LayoutModel'
// import { Box, Grid } from "@chakra-ui/react";

let size;
function flatten(arr) {
  return arr.reduce((acc, elem) => {
    if (elem.type === "tabset") {
      return [...acc, elem];
    }
    if (elem.type === "row") {
      return [...acc].concat(flatten(elem.children));
    }
    return acc;
  }, []);
}
let wideScreenModel;
function cleanup(arr) {
  if (wideScreenModel) {
    return wideScreenModel.toJson().layout.children;
  }

  // 2 panels per row
  let children = [{ type: "row", children: [] }];
  for (let i = 0; i < arr.length; i += 2) {
    const next = arr[i + 1] || [];
    children[0].children.push({
      type: "row",
      children: [arr[i]].concat(next)
    });
  }
  return children;
}

const PageEditor = () => {
    const ref = useRef();
    const small = useMedia(`(max-width: 768px)`);
    const [model, setModel] = useState(
    Model.fromJson({
      ...LayoutModel,
      ...(small && {
        global: {
          ...LayoutModel.global,
          enableEdgeDock: false
        }
      })
    })
  );

  const onAddDragMouseDown = (json) => (event) => {
    console.log('onAddDragMouseDown json', json);
    console.log('onAddDragMouseDown event', event);
    event.stopPropagation();
    event.preventDefault();

    ref.current.addTabWithDragAndDrop(
      `Add ${json.name}<br>(Drag to location)`,
      json
    );
  };

  const factory = (node) => {
    const Component = node.getComponent();
    // console.log('model', model);
    // if (component === "button") {
    //   return <button>{node.getName()}</button>;
    // }
    // console.log('COMPONENT______: ', Component?.name)
    // var Component = node.getName();
    // console.log('node.getName()',node.getName());
    return(
         <Component 
          onAddDragMouseDown={onAddDragMouseDown} 
           model={model} 
         />
    );
  };

  // kinda hacky for now
  useEffect(() => {
    const { layout, global, borders } = model.toJson();
    if (!layout.children[0].children.length) return;
    if (small && size !== "small") {
      const json = {
        borders,
        global: {
          ...global,
          enableEdgeDock: false
        },
        layout: {
          type: "row",
          children: [
            {
              type: "row",
              children: flatten(layout.children)
            }
          ]
        }
      };

      setModel(Model.fromJson(json));
      size = "small";
    } else if (!small && size !== "") {
      const json = {
        borders,
        global: {
          ...global,
          enableEdgeDock: true
        },
        layout: {
          type: "row",
          children: cleanup(layout.children[0].children)
        }
      };
      setModel(Model.fromJson(json));
      size = "";
    }
  }, [small, model, setModel]);

  return (
      <Layout
        ref={ref}
        model={model}
        factory={factory}
        onModelChange={(model) => {
          // console.log("MODEL CHANGE");
          if (small) {
            // Enforcing a stack layout while drag/drop-ing
            const json = {
              ...model.toJson(),
              layout: {
                type: "row",
                children: [
                  {
                    type: "row",
                    children: flatten(model.toJson().layout.children)
                  }
                ]
              }
            };
            setModel(Model.fromJson(json));
          } else {
            // Storing the model for reverting wide screen layout
            wideScreenModel = model;
          }
        }}
        icons={{
          // close: <span>close</span>,
          // more: <span>more</span>,
          maximize: <>&#128470;&#xFE0E;</>,
          restore: <>&#128469;&#xFE0E;</>,
          popout: <>&#128471;&#xFE0E;</>
        }}
        onRenderTabSet={(tabSetNode, renderValues) => {
          const tabNode = tabSetNode.getSelectedNode();
          if (tabNode) {
            renderValues.buttons.push(
              <button
                key="delete"
                title="Delete tabset"
                onClick={() => {
                  model.doAction(Actions.deleteTab(tabNode.getId()));
                  // Make sure to remove the node from wideScreenModel as well
                  if (small && wideScreenModel) {
                    wideScreenModel.doAction(
                      Actions.deleteTab(tabNode.getId())
                    );
                  }
                }}
              >
                &#128473;&#xFE0E;
              </button>
            );
            // const json = tabSetNode._toJson();
            // console.log("add", json, tabSetNode);
            // if (json.type === "tabset" && small && wideScreenModel) {
            //   console.log("ADDING");
            //   //   console.log("add", json, tabSetNode.getId());
            //   wideScreenModel.doAction(
            //     FlexLayout.Actions.updateNodeAttributes(tabSetNode.getId(), json)
            //   );
            // }
          }
        }}
      />
  );
};

export default PageEditor;