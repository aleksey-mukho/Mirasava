import React from 'react';

import { LineChart, Line, Tooltip } from 'recharts';

const data = [
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
  },
  {
    name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
  },
  {
    name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
  },
  {
    name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
  },
  {
    name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
  },
];

const Home = () => (
  <LineChart
    width={600}
    height={400}
    data={data}
    margin={{
      top: 10, right: 30, left: 0, bottom: 0,
    }}
  >
    <defs>
      <linearGradient id="colorUv" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="black" />
        <stop offset="50%" stopColor="black" />
        <stop offset="75%" stopColor="green" />
        <stop offset="100%" stopColor="green" />
      </linearGradient>
    </defs>
    <Tooltip
      cursor={false}
    />
    <Line
      activeDot={{ stroke: '#fff', strokeWidth: 8, fill: '#fff' }}
      dot={false}
      type="monotone"
      stroke="url(#colorUv)"
      strokeWidth={5}
      dataKey="uv"
    />
  </LineChart>
);

export default Home;
