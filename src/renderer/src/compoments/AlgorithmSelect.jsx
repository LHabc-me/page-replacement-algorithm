import * as React from "react";
import {
  makeStyles,
  shorthands, Switch,
  Tab,
  TabList
} from "@fluentui/react-components";

import {
  CalendarMonthRegular, CalendarMonthFilled,
  ClockRegular, ClockFilled,
  ProhibitedRegular, ProhibitedFilled,
  bundleIcon, ArrowAutofitHeightFilled, ArrowAutofitHeightRegular
} from "@fluentui/react-icons";
import { Link } from "react-router-dom";

const CalendarMonth = bundleIcon(CalendarMonthFilled, CalendarMonthRegular);
const Clock = bundleIcon(ClockFilled, ClockRegular);
const NUR = bundleIcon(ProhibitedFilled, ProhibitedRegular);
const FIFO = bundleIcon(ArrowAutofitHeightFilled, ArrowAutofitHeightRegular);

const useStyles = makeStyles({
  root: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    ...shorthands.padding("50px", "20px"),
    rowGap: "20px"
    // paddingTop: "32vh",
    // height: "100vh"
  }
});

export const AlgorithmSelect = () => {
  const styles = useStyles();
  return (
    // <div className={"flex justify-end "}>
    <div className={"flex justify-center bg-amber-600"}>

      {/*<TabList defaultSelectedValue="tab1" appearance="subtle" size={"large"} vertical>*/}
      <TabList appearance="subtle" size={"small"}>
        <Tab icon={<FIFO />} value="tab1">FIFO</Tab>
        <Tab icon={<CalendarMonth />} value="tab2">LRU</Tab>
        <Tab icon={<NUR />} value="tab3">NUR</Tab>
        <Tab icon={<Clock />} value="tab4">CLK</Tab>
      </TabList>
    </div>
    // </div>
  );
};
