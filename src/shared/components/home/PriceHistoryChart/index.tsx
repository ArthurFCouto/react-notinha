import { Precos } from '@/shared/service/firebase';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';

interface PriceHistoryChartProps {
    prices: Precos[]
}

export default function PriceHistoryChart({ prices }: PriceHistoryChartProps) {
    return (
        <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
                height={300}
                data={prices}
                margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='data' />
                <YAxis />
                <Tooltip />
                <Area type='monotone' dataKey='valor' stroke='#8884d8' fill='#8884d8' />
            </AreaChart>
        </ResponsiveContainer>
    )

}