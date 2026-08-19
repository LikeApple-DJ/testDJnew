import React, { useState, useCallback } from 'react';
import { Card, Select, DatePicker, Space, Button, Row, Col, Radio, Typography, Spin, message } from 'antd';
import { BarChartOutlined, PieChartOutlined, LineChartOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { analyticsApi } from '../services/api';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * 可视化报表容器 - 管理筛选与图表切换
 */
function AnalyticsDashboard() {
  const [chartType, setChartType] = useState('bar');
  const [dimension, setDimension] = useState('caller_dept');
  const [apiName, setApiName] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);

  const handleFetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        dimension: dimension,
        apiName: apiName || undefined,
      };
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }

      let result;
      if (chartType === 'line') {
        const response = await analyticsApi.trend({
          apiName: apiName || undefined,
          granularity: 'day',
          startDate: params.startDate,
          endDate: params.endDate,
        });
        result = response.data.data;
      } else if (chartType === 'pie') {
        const response = await analyticsApi.distribution(params);
        result = response.data.data;
      } else {
        const response = await analyticsApi.summary(params);
        result = response.data.data;
      }
      setChartData(result);
    } catch (error) {
      message.error('查询失败：' + (error.response?.data?.msg || error.message));
    } finally {
      setLoading(false);
    }
  }, [chartType, dimension, apiName, dateRange]);

  /**
   * 构建 ECharts 柱状图配置
   */
  const buildBarOption = () => {
    if (!chartData || !chartData.items) return {};
    return {
      title: { text: '调用汇总 - 按' + getDimensionLabel(), left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: chartData.items.map(item => item.groupKey),
        axisLabel: { rotate: 30 },
      },
      yAxis: {
        type: 'value',
        name: '调用次数',
      },
      series: [
        {
          name: '调用次数',
          type: 'bar',
          data: chartData.items.map(item => item.callCount),
          itemStyle: { color: '#1890ff' },
        },
        {
          name: '独立调用人数',
          type: 'bar',
          data: chartData.items.map(item => item.uniqueCallers),
          itemStyle: { color: '#52c41a' },
        },
      ],
      legend: { bottom: 0 },
    };
  };

  /**
   * 构建 ECharts 折线图配置
   */
  const buildLineOption = () => {
    if (!chartData || !chartData.points) return {};
    return {
      title: { text: '调用趋势', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: chartData.points.map(p => p.timeLabel),
        axisLabel: { rotate: 30 },
      },
      yAxis: { type: 'value', name: '调用次数' },
      series: [
        {
          name: '调用次数',
          type: 'line',
          data: chartData.points.map(p => p.callCount),
          smooth: true,
          areaStyle: { opacity: 0.15 },
          lineStyle: { color: '#1890ff' },
          itemStyle: { color: '#1890ff' },
        },
      ],
    };
  };

  /**
   * 构建 ECharts 饼图配置
   */
  const buildPieOption = () => {
    if (!chartData || !chartData.items) return {};
    return {
      title: { text: '调用分布 - 按' + getDimensionLabel(), left: 'center' },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: { orient: 'vertical', left: 'left', top: 'middle' },
      series: [
        {
          name: '调用分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['55%', '55%'],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
          label: { show: true, formatter: '{b}\n{d}%' },
          data: chartData.items.map(item => ({
            name: item.groupKey,
            value: item.callCount,
          })),
        },
      ],
    };
  };

  const getChartOption = () => {
    switch (chartType) {
      case 'line': return buildLineOption();
      case 'pie': return buildPieOption();
      default: return buildBarOption();
    }
  };

  const getDimensionLabel = () => {
    const map = { caller_type: '人员类型', caller_level: '人员层级', caller_dept: '人员部门' };
    return map[dimension] || dimension;
  };

  return (
    <Card>
      <Title level={4}>调用分析报表</Title>
      <Space wrap style={{ marginBottom: 16 }}>
        <span>图表类型：</span>
        <Radio.Group value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <Radio.Button value="bar"><BarChartOutlined /> 柱状图</Radio.Button>
          <Radio.Button value="line"><LineChartOutlined /> 折线图</Radio.Button>
          <Radio.Button value="pie"><PieChartOutlined /> 饼图</Radio.Button>
        </Radio.Group>

        <span>维度：</span>
        <Select value={dimension} onChange={setDimension} style={{ width: 130 }}>
          <Option value="caller_dept">人员部门</Option>
          <Option value="caller_type">人员类型</Option>
          <Option value="caller_level">人员层级</Option>
        </Select>

        <span>接口：</span>
        <Select value={apiName} onChange={setApiName} style={{ width: 140 }} allowClear placeholder="全部">
          <Option value="">全部</Option>
          <Option value="helloworld">HelloWorld</Option>
          <Option value="hash">哈希算法</Option>
          <Option value="bubble-sort">冒泡排序</Option>
        </Select>

        <RangePicker onChange={setDateRange} />

        <Button type="primary" icon={<ReloadOutlined />} loading={loading} onClick={handleFetchData}>
          查询
        </Button>
      </Space>

      <Spin spinning={loading}>
        <ReactECharts
          option={getChartOption()}
          style={{ height: 400 }}
          notMerge={true}
        />
      </Spin>
    </Card>
  );
}

export default AnalyticsDashboard;
