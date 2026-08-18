import { Radio } from 'antd';
import type { ChartType } from '../types';

interface Props {
  value: ChartType;
  onChange: (c: ChartType) => void;
}

export default function ChartTypeSelector({ value, onChange }: Props) {
  return (
    <Radio.Group
      value={value}
      onChange={(e) => onChange(e.target.value)}
      optionType="button"
      buttonStyle="solid"
    >
      <Radio.Button value="bar">柱状图</Radio.Button>
      <Radio.Button value="line">折线图</Radio.Button>
      <Radio.Button value="pie">饼图</Radio.Button>
    </Radio.Group>
  );
}