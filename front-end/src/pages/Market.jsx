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
} from '@mui/material';

const mockNFTs = [
    {
        id: 1,
        name: 'Ocean View Condo',
        description: 'A beautiful condo with a view of the ocean.',
        price: '2.5 ETH',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 2,
        name: 'Downtown Loft',
        description: 'Modern loft in the heart of downtown.',
        price: '1.8 ETH',
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 3,
        name: 'Country House',
        description: 'Spacious house in the countryside.',
        price: '3.2 ETH',
        image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80',
    },
];

const Market = () => {
    return (
        <Box sx={{ flexGrow: 1, mt: 6 }}>
            <Grid container spacing={4} justifyContent="center">
                {mockNFTs.map((nft) => (
                    <Grid item key={nft.id} xs={12} sm={6} md={4}>
                        <Card sx={{ maxWidth: 345, mx: 'auto', background: 'rgba(20, 20, 24, 0.95)' }}>
                            <CardMedia
                                component="img"
                                height="180"
                                image={nft.image}
                                alt={nft.name}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div">
                                    {nft.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {nft.description}
                                </Typography>
                                <Typography variant="subtitle1" color="primary">
                                    {nft.price}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" color="success" fullWidth>
                                    Buy
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Market;