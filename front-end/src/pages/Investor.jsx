import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Stack,
    Chip,
} from '@mui/material';

const mockDisbursals = [
    { id: 'DSB-001', date: '2024-06-01', amount: '1.5 ETH' },
    { id: 'DSB-002', date: '2024-06-03', amount: '2.1 ETH' },
    { id: 'DSB-003', date: '2024-06-05', amount: '0.9 ETH' },
    { id: 'DSB-004', date: '2024-06-07', amount: '3.0 ETH' },
];

const poolStats = [
    { label: 'Liquidity pool', value: '120.5 ETH' },
    { label: 'Participation', value: '8.2%' },
    { label: 'Stake', value: '15.0 ETH' },
    { label: 'Rewards', value: '0.45 ETH' },
];

const Investor = () => {
    return (
        <Box sx={{ flexGrow: 1, mt: 6 }}>
            <Stack direction="column" spacing={2} sx={{ mb: 3, alignItems: 'flex-start' }}>
                {poolStats.map((stat) => (
                    <Chip
                        key={stat.label}
                        label={<><b>{stat.label}:</b> {stat.value}</>}
                        sx={{ fontSize: 16, background: 'rgba(0,255,157,0.08)', color: '#00FF9D', fontWeight: 500 }}
                    />
                ))}
            </Stack>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Disbursals
            </Typography>
            <TableContainer component={Paper} sx={{ maxWidth: 600, mx: 'auto', background: 'rgba(20, 20, 24, 0.95)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Disbursal id</b></TableCell>
                            <TableCell><b>Date</b></TableCell>
                            <TableCell align="right"><b>Amount</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockDisbursals.map((row) => (
                            <TableRow key={row.id} sx={{ transition: 'background 0.2s', '&:hover': { background: 'rgba(0,255,157,0.08)' } }}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell align="right">{row.amount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Investor;