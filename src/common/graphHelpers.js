const convertGraphData = () => {
  // todo: convert passed params to consumable chart data

  return [
    { x: 'May 25', y: 30, label: '30 Sockets on May 25' },
    { x: 'May 26', y: 60, label: '60 Sockets on May 26 \r\n +30 from previous day' },
    { x: 'May 27', y: 1 },
    { x: 'May 28', y: 1 },
    { x: 'May 29', y: 2 },
    { x: 'May 30', y: 2 },
    { x: 'May 31', y: 2 },
    { x: 'Jun 1', y: 2 },
    { x: 'Jun 2', y: 2 },
    { x: 'Jun 3', y: 2 },
    { x: 'Jun 4', y: 2 },
    { x: 'Jun 5', y: 2 },
    { x: 'Jun 6', y: 3 },
    { x: 'Jun 7', y: 3 },
    { x: 'Jun 8', y: 3 },
    { x: 'Jun 9', y: 3 },
    { x: 'Jun 10', y: 4 },
    { x: 'Jun 11', y: 4 },
    { x: 'Jun 12', y: 4 },
    { x: 'Jun 13', y: 4 },
    { x: 'Jun 14', y: 4 },
    { x: 'Jun 15', y: 4 },
    { x: 'Jun 16', y: 4 },
    { x: 'Jun 17', y: 3 },
    { x: 'Jun 18', y: 3 },
    { x: 'Jun 19', y: 1 },
    { x: 'Jun 20', y: 2 },
    { x: 'Jun 21', y: 5 },
    { x: 'Jun 22', y: 3 },
    { x: 'Jun 23', y: 1 },
    { x: 'Jun 24', y: 1 }
  ];
};

const getGraphHeight = (breakpoints, currentBreakpoint) =>
  (breakpoints[currentBreakpoint] > breakpoints.md && 200) || 400;

const getTooltipDimensions = (breakpoints, currentBreakpoint) => {
  if (breakpoints[currentBreakpoint] < breakpoints.sm) {
    return { height: 60, width: 200 };
  }
  if (breakpoints[currentBreakpoint] < breakpoints.md) {
    return { height: 50, width: 180 };
  }
  if (breakpoints[currentBreakpoint] < breakpoints.lg) {
    return { height: 40, width: 140 };
  }
  if (breakpoints[currentBreakpoint] < breakpoints.xl) {
    return { height: 40, width: 120 };
  }
  if (breakpoints[currentBreakpoint] < breakpoints.xl2) {
    return { height: 30, width: 90 };
  }
  return { height: 20, width: 80 };
};

const getTooltipFontSize = (breakpoints, currentBreakpoint) => {
  if (breakpoints[currentBreakpoint] > breakpoints.lg) {
    return 8;
  }
  if (breakpoints[currentBreakpoint] > breakpoints.md) {
    return 12;
  }
  return 14;
};

const graphHelpers = { convertGraphData, getGraphHeight, getTooltipDimensions, getTooltipFontSize };

export {
  graphHelpers as default,
  graphHelpers,
  convertGraphData,
  getGraphHeight,
  getTooltipDimensions,
  getTooltipFontSize
};
