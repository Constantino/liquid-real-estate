import React, { useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Checkbox,
    FormControlLabel,
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
    {
        id: 4,
        name: 'Mountain Cabin',
        description: 'Cozy cabin with mountain views.',
        price: '2.1 ETH',
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 5,
        name: 'City Apartment',
        description: 'Modern apartment in the city center.',
        price: '2.8 ETH',
        image: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 6,
        name: 'Lake House',
        description: 'Peaceful house by the lake.',
        price: '3.5 ETH',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 7,
        name: 'Desert Villa',
        description: 'Luxury villa in the desert.',
        price: '4.0 ETH',
        image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 8,
        name: 'Forest Retreat',
        description: 'Retreat in the heart of the forest.',
        price: '2.3 ETH',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 9,
        name: 'Beach Bungalow',
        description: 'Bungalow right on the beach.',
        price: '3.8 ETH',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 10,
        name: 'Penthouse Suite',
        description: 'Exclusive penthouse with city views.',
        price: '5.0 ETH',
        image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80',
    },
];

const Viewer = () => {
    const [selected, setSelected] = useState([]);

    const handleSelect = (id) => (event) => {
        setSelected((prev) =>
            event.target.checked
                ? [...prev, id]
                : prev.filter((selectedId) => selectedId !== id)
        );
    };

    return (
        <Box sx={{ flexGrow: 1, mt: 6 }}>
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                {mockNFTs.map((nft) => (
                    <Grid item key={nft.id} xs={12} sm={6} md={4} display="flex">
                        <Card sx={{ background: 'rgba(20, 20, 24, 0.95)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selected.includes(nft.id)}
                                            onChange={handleSelect(nft.id)}
                                            color="primary"
                                        />
                                    }
                                    label=""
                                />
                            </Box>
                            <CardMedia
                                component="img"
                                height="180"
                                image={nft.image}
                                alt={nft.name}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
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
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Viewer;