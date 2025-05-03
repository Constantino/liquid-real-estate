import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Stack,
} from '@mui/material';

const mockLoans = [
    {
        id: 'LN-001',
        amountDue: '1.2 ETH',
        images: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
        ],
    },
    {
        id: 'LN-002',
        amountDue: '0.8 ETH',
        images: [
            'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=400&q=80',
        ],
    },
    {
        id: 'LN-003',
        amountDue: '2.5 ETH',
        images: [
            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
        ],
    },
    {
        id: 'LN-004',
        amountDue: '3.0 ETH',
        images: [
            'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80',
        ],
    },
];

const Loans = () => {
    return (
        <Box sx={{ flexGrow: 1, mt: 6 }}>
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                {mockLoans.map((loan, idx) => (
                    <Grid item key={loan.id} xs={12} sm={6} md={4} display="flex">
                        <Card sx={{ background: 'rgba(20, 20, 24, 0.95)', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden', cursor: 'pointer', border: 'none', transition: 'box-shadow 0.2s', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.12)', '&:hover': { boxShadow: '0 0 0 2px #00FF9D44' }, '&:hover::before': { content: '""', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0.00) 100%)', pointerEvents: 'none', zIndex: 2 } }}>
                            <Stack direction="row" spacing={1} sx={{ p: 1, justifyContent: 'center', alignItems: 'center' }}>
                                {loan.images.map((img, i) => (
                                    <CardMedia
                                        key={i}
                                        component="img"
                                        image={img}
                                        alt={`Loan ${loan.id} image ${i + 1}`}
                                        sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2, border: '2px solid #222', boxShadow: 1 }}
                                    />
                                ))}
                            </Stack>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    Loan ID: {loan.id}
                                </Typography>
                                <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                                    Amount Due: {loan.amountDue}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" color="success" fullWidth>
                                    Pay
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Loans;