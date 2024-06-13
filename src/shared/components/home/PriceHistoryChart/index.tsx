import { Stack } from '@mui/material';
import { Price } from '@/shared/service/firebase';
import {
    Area, AreaChart, CartesianGrid,
    ResponsiveContainer, Tooltip, YAxis, XAxis
} from 'recharts';

interface PriceHistoryChartProps {
    height: number,
    prices: Price[]
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
                <AreaChart data={prices} margin={{ top: 5, right: 0, left: 5, bottom: 5 }}>
                    <CartesianGrid fill='#efefef' strokeDasharray='3 3' />
                    <XAxis dataKey='data' tick={(props) => <CustomizedAxisTick {...props} />} />
                    <YAxis
                        allowDecimals={false}
                        label={{ value: 'Preço (R$)', angle: -90, position: 'insideLeft' }}
                        type='number'
                        domain={[(dataMin: any) => dataMin < 2 ? 0 : (Math.trunc(dataMin) - 2), (dataMax: any) => (Math.trunc(dataMax) + 2)]}
                    />
                    <Tooltip />
                    <Area
                        dataKey='valor'
                        fill='#1976d2'
                        stroke='#1976d2'
                        type='monotone'
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Stack>
    )
}