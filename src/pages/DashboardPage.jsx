import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import HelloWorldTab from '../components/HelloWorldTab';
import HashTab from '../components/HashTab';
import BubbleSortTab from '../components/BubbleSortTab';

export default function DashboardPage() {
    return (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>算法服务面板</h2>
            <Tabs>
                <TabList>
                    <Tab>Hello World</Tab>
                    <Tab>Hash 哈希</Tab>
                    <Tab>Bubble Sort 冒泡排序</Tab>
                </TabList>
                <TabPanel>
                    <HelloWorldTab />
                </TabPanel>
                <TabPanel>
                    <HashTab />
                </TabPanel>
                <TabPanel>
                    <BubbleSortTab />
                </TabPanel>
            </Tabs>
        </div>
    );
}