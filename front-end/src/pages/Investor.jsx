import React, { useState } from 'react';
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
    Button,
    Modal,
    TextField,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [openWithdraw, setOpenWithdraw] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenWithdraw = () => setOpenWithdraw(true);
    const handleCloseWithdraw = () => setOpenWithdraw(false);

    return (
        <Box sx={{ flexGrow: 1, mt: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Stack direction="column" spacing={2} alignItems="flex-start">
                    {poolStats.map((stat) => (
                        <Chip
                            key={stat.label}
                            label={<><b>{stat.label}:</b> {stat.value}</>}
                            sx={{ fontSize: 16, background: 'rgba(0,255,157,0.08)', color: '#00FF9D', fontWeight: 500 }}
                        />
                    ))}
                </Stack>
                <Stack direction="column" spacing={2} alignItems="flex-end">
                    <Button variant="contained" color="success" sx={{ minWidth: 120 }} onClick={handleOpen}>
                        Invest
                    </Button>
                    <Button variant="outlined" color="primary" sx={{ minWidth: 120 }} onClick={handleOpenWithdraw}>
                        Withdraw
                    </Button>
                </Stack>
            </Box>
            <Modal open={open} onClose={handleClose}>
                <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 4, minWidth: 546, minHeight: 320, display: 'flex', flexDirection: 'column', background: 'rgba(30, 30, 40, 0.5)', backdropFilter: 'blur(10px)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                        <IconButton onClick={handleClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Invest
                    </Typography>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Amount"
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            fullWidth
                        />
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button variant="contained" color="success" size="large">
                            Invest
                        </Button>
                    </Box>
                </Paper>
            </Modal>
            <Modal open={openWithdraw} onClose={handleCloseWithdraw}>
                <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 4, minWidth: 546, minHeight: 320, display: 'flex', flexDirection: 'column', background: 'rgba(30, 30, 40, 0.5)', backdropFilter: 'blur(10px)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                        <IconButton onClick={handleCloseWithdraw} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Withdraw
                    </Typography>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Amount"
                            type="number"
                            value={withdrawAmount}
                            onChange={e => setWithdrawAmount(e.target.value)}
                            fullWidth
                        />
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button variant="contained" color="primary" size="large">
                            Withdraw
                        </Button>
                    </Box>
                </Paper>
            </Modal>
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