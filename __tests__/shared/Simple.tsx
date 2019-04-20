import { useSharedState } from '../../src';

export type SimpleComponentProps = {
  keyName: string;
  defaultValue?: string;
};

const SimpleComponent: React.SFC<SimpleComponentProps> = (
  props: SimpleComponentProps,
) => {
  const state = useSharedState<string>(props.keyName, props.defaultValue);

  return <span>{state[0]}</span>;
};

export default SimpleComponent;
