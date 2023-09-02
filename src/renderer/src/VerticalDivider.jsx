import * as React from "react";
import { makeStyles, tokens, Divider } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: "5px"
  },
  example: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyItems: "flex-start",
    height: "100vh",
    minHeight: "96px",
    backgroundColor: tokens.colorNeutralBackground1
  }
});

export const VerticalDivider = () => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      {/*<div className={styles.example}>*/}
      {/*  <Divider vertical style={{ height: "100%" }} />*/}
      {/*</div>*/}
      <div className={styles.example}>
        <Divider vertical style={{ height: "100%" }} appearance="subtle">
        </Divider>
      </div>
    </div>
  );
};
