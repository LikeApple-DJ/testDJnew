import { Select } from 'antd';
import type { Dimension } from '../types';

interface Props {
  value: Dimension;
  onChange: (d: Dimension) => void;
}

const OPTIONS: { label: string; value: Dimension }[] = [
  { label: '人员类型', value: 'personType' },
  { label: '人员层级', value: 'level' },
  { label: '人员部门', value: 'department' },
];

export default function DimensionSelector({ value, onChange }: Props) {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={OPTIONS}
      style={{ width: 160 }}
    />
  );
}