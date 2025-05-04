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
    TextField,
} from '@mui/material';
import { ethers } from 'ethers';
import RealEstateTokenABI from '../assets/contracts/RealEstateToken.abi.json';

const MANTLE_SEPOLIA_RPC = 'https://rpc.sepolia.mantle.xyz';
const CONTRACT_ADDRESS = import.meta.env.VITE_REAL_ESTATE_TOKEN_ADDRESS;
const TARGET_ADDRESS = '0x57D14581DE26173D37e854ce8d3A6468A1943f56';

const mockNFTs = [
    {
        id: 1,
        name: 'Ocean View Condo',
        description: 'A beautiful condo with a view of the ocean.',
        price: '2.5 MNT',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 2,
        name: 'Downtown Loft',
        description: 'Modern loft in the heart of downtown.',
        price: '1.8 MNT',
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 3,
        name: 'Country House',
        description: 'Spacious house in the countryside.',
        price: '3.2 MNT',
        image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 4,
        name: 'Mountain Cabin',
        description: 'Cozy cabin with mountain views.',
        price: '2.1 MNT',
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 5,
        name: 'City Apartment',
        description: 'Modern apartment in the city center.',
        price: '2.8 MNT',
        image: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 6,
        name: 'Lake House',
        description: 'Peaceful house by the lake.',
        price: '3.5 MNT',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 7,
        name: 'Desert Villa',
        description: 'Luxury villa in the desert.',
        price: '4.0 MNT',
        image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 8,
        name: 'Forest Retreat',
        description: 'Retreat in the heart of the forest.',
        price: '2.3 MNT',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b3fb?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 9,
        name: 'Beach Bungalow',
        description: 'Bungalow right on the beach.',
        price: '3.8 MNT',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 10,
        name: 'Penthouse Suite',
        description: 'Exclusive penthouse with city views.',
        price: '5.0 MNT',
        image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80',
    },
];

const Market = () => {
    const readNFTs = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(MANTLE_SEPOLIA_RPC);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, RealEstateTokenABI, provider);

            // Get all token IDs
            const tokenIds = await contract.balanceOfBatch(
                Array(100).fill(TARGET_ADDRESS), // Assuming max 100 different token IDs
                Array(100).fill().map((_, i) => i) // Start from 0
            );

            // Filter out tokens with balance > 0
            const ownedTokens = [];
            for (let i = 0; i < tokenIds.length; i++) {
                if (tokenIds[i].gt(0)) {
                    const uri = await contract.uri(i);
                    ownedTokens.push({
                        tokenId: i,
                        balance: tokenIds[i].toString(),
                        uri: uri
                    });
                }
            }

            console.log('Owned NFTs:', ownedTokens);
        } catch (error) {
            console.error('Error reading NFTs:', error);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, mt: 6 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="outlined"
                    onClick={readNFTs}
                    sx={{
                        color: '#00FF9D',
                        borderColor: '#00FF9D',
                        '&:hover': {
                            borderColor: '#00FF9D',
                            backgroundColor: 'rgba(0, 255, 157, 0.08)',
                        }
                    }}
                >
                    Read NFTs
                </Button>
            </Box>
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                {mockNFTs.map((nft) => (
                    <Grid item key={nft.id} xs={12} sm={6} md={4} display="flex">
                        <Card
                            sx={{
                                background: 'rgba(20, 20, 24, 0.95)',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                cursor: 'pointer',
                                border: 'none',
                                transition: 'box-shadow 0.2s',
                                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.12)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    boxShadow: '0 0 0 2px #00FF9D44',
                                },
                                '&:hover::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0.00) 100%)',
                                    pointerEvents: 'none',
                                    zIndex: 2,
                                },
                            }}
                        >
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
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="subtitle1" color="primary">
                                        {nft.price}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: '#00FF9D' }}>
                                        Supply: {nft.supply || 100}
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ flexDirection: 'column', gap: 1, p: 2 }}>
                                <TextField
                                    type="number"
                                    label="Amount"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        inputProps: { min: 1 },
                                        sx: {
                                            color: '#00FF9D',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#00FF9D',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#00FF9D',
                                            },
                                        }
                                    }}
                                    InputLabelProps={{
                                        sx: { color: '#00FF9D' }
                                    }}
                                />
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