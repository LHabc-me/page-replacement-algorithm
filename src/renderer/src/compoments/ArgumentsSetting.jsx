import * as React from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  useId,
  Input,
  Label
} from "@fluentui/react-components";

const useStyles = makeStyles({
  base: {
    display: "flex",
    flexDirection: "column"
    // maxWidth: "400px"
  },
  field: {
    display: "grid",
    gridRowGap: tokens.spacingVerticalXXS,
    marginTop: tokens.spacingVerticalMNudge,
    ...shorthands.padding(tokens.spacingHorizontalMNudge)
  },
  filledLighter: {
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    "> label": {
      color: tokens.colorNeutralForegroundInverted2
    }
  },
  filledDarker: {
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    "> label": {
      color: tokens.colorNeutralForegroundInverted2
    }
  }
});

export const ArgumentsSetting = () => {
  const underlineId = useId("input-underline");
  const styles = useStyles();

  return (
    <div className={styles.base}>
      <div className={styles.field}>
        <Label htmlFor={underlineId}>逻辑页面数</Label>
        <Input appearance="underline" id={underlineId} />
      </div>

      <div className={styles.field}>
        <Label htmlFor={underlineId}>页面大小</Label>
        <Input appearance="underline" id={underlineId} />
      </div>

      <div className={styles.field}>
        <Label htmlFor={underlineId}>工作集大小</Label>
        <Input appearance="underline" id={underlineId} />
      </div>
    </div>
  );
};
