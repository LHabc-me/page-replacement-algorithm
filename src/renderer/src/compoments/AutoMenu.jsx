import * as React from "react";
import {
  makeStyles,
  Button,
  Popover,
  PopoverSurface,
  PopoverTrigger
} from "@fluentui/react-components";

const useStyles = makeStyles({
  contentHeader: {
    marginTop: "0"
  }
});

const ExampleContent = () => {
  const styles = useStyles();
  return (
    <div>
      <h3 className={styles.contentHeader}>Popover content</h3>

      <div>This is some popover content</div>
    </div>
  );
};

export const AutoMenu = (props) => (
  <Popover {...props} inline={true}>
    <PopoverTrigger disableButtonEnhancement>
      <Button>Popover trigger</Button>
    </PopoverTrigger>

    <PopoverSurface>
      <ExampleContent />
    </PopoverSurface>
  </Popover>
);
