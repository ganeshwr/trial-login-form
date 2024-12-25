// React built-in
import { FC } from "react";

// 3rd party
import { Flex, Loader } from "rizzui";

const Loading: FC = () => {
  return (
    <Flex className="h-dvh" align="center" justify="center">
      <Loader variant="pulse" size="xl" />
    </Flex>
  );
};

export default Loading;
