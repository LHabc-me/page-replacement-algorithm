import * as React from "react";
import {
  makeStyles,
  shorthands,
  Tab,
  TabList
} from "@fluentui/react-components";

import {
  CalendarMonthRegular, CalendarMonthFilled,
  ClockRegular, ClockFilled,
  ProhibitedRegular, ProhibitedFilled,
  bundleIcon, ArrowAutofitHeightFilled, ArrowAutofitHeightRegular
} from "@fluentui/react-icons";

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
    rowGap: "20px",
    paddingTop: "32vh",
    height: "100vh"
  }
});

export const Nav = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <TabList defaultSelectedValue="tab1" appearance="subtle" size={"large"} vertical>
        <Tab icon={<FIFO />} value="tab1">FIFO</Tab>
        <Tab icon={<CalendarMonth />} value="tab2">LRU</Tab>
        <Tab icon={<NUR />} value="tab3">NUR</Tab>
        <Tab icon={<Clock />} value="tab4">CLOCK</Tab>
      </TabList>
    </div>
  );
};

export default Nav;
