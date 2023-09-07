import { Button } from "@fluentui/react-components";
import { Settings16Filled } from "@fluentui/react-icons";

function ApplicationMenu(props) {
  return (
    <div {...props}>
      <Button icon={<Settings16Filled />} appearance={"subtle"}>
      </Button>
    </div>
  );
}

export { ApplicationMenu };
