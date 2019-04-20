import { useSharedState } from '../../src';

export type UpdatingComponentProps = {
  keyName: string;
  defaultValue?: string;
};

const UpdatingComponent: React.SFC<UpdatingComponentProps> = (
  props: UpdatingComponentProps,
) => {
  const [value, updater] = useSharedState<string>(
    props.keyName,
    props.defaultValue,
  );

  function onClick() {
    updater(`${value}x`);
  }

  return <button onClick={onClick}>{value}</button>;
};

export default UpdatingComponent;
