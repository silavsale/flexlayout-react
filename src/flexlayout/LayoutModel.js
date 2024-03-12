import Droppables from './Droppables';

const LayoutModel = {
  global: {
    splitterSize: 4,

    borderSize: 100,
    borderMinSize: 100,
    borderBarSize: -1, // hide tab
    borderEnableDrop: false,

    tabEnableClose: false,
    tabEnableRename: false,
    // tabSetEnableTabStrip: false,
    tabSetEnableDrop: false, // 1 tab/tabset
    tabSetEnableDrag: false,
    tabSetMinHeight: 200,
    tabSetMinWidth: 200,
    // tabSetHeaderHeight: true
    // tabSetTabStripHeight: 40 // tab height
  },
  borders: [
    {
      type: 'border',
      location: 'right',
      selected: 0,
      children: [
        {
          type: 'tab',
          name: 'Droppables',
          component: Droppables,
        },
      ],
    },
  ],
  layout: {},
};

export default LayoutModel;
