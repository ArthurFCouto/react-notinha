import { Stack } from '@mui/material';
import { Precos } from '@/shared/service/firebase';
import {
    Area, AreaChart, CartesianGrid,
    ResponsiveContainer, Tooltip, YAxis, XAxis
} from 'recharts';

interface PriceHistoryChartProps {
    height: number,
    prices: Precos[]
}

interface CustomizedProps {
    x: number,
    y: number,
    payload: any
}

export default function PriceHistoryChart({ height, prices }: PriceHistoryChartProps) {
    const CustomizedAxisTick = ({ x, y, payload }: CustomizedProps) => {
        return (
            <g transform={`translate(${x},${y})`} >
                <text
                    dy={10}
                    fill='#656565'
                    fontSize={10}
                    transform='rotate(-45)'
                    textAnchor='end'
                    x={5}
                    y={5}
                >
                    {String(payload.value).slice(0, 5)}
                </text>
            </g >
        );
    }

    return (
        <Stack height={height} width='100%'>
            <ResponsiveContainer >
                <AreaChart data={prices}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='data' tick={(props) => <CustomizedAxisTick {...props} />} />
                    <YAxis />
                    <Tooltip />
                    <Area type='monotone' dataKey='valor' stroke='#1976d2' fill='#1976d2' />
                </AreaChart>
            </ResponsiveContainer>
        </Stack>
    )

}