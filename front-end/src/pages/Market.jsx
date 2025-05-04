import React, { useEffect, useState } from 'react';
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
    Alert,
} from '@mui/material';
import { ethers } from 'ethers';
import RealEstateTokenABI from '../assets/contracts/RealEstateToken.abi.json';
import EscrowABI from '../assets/contracts/Escrow.abi.json';

const MANTLE_SEPOLIA_RPC = 'https://rpc.sepolia.mantle.xyz';
const CONTRACT_ADDRESS = import.meta.env.VITE_REAL_ESTATE_TOKEN_ADDRESS;
const TARGET_ADDRESS = import.meta.env.VITE_ESCROW_ADDRESS;

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
    const [ownedNFTs, setOwnedNFTs] = useState([]);
    const [account, setAccount] = useState(null);
    const [error, setError] = useState(null);
    const [amounts, setAmounts] = useState({});

    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
                setError(null);
            } else {
                setError('Please install MetaMask!');
            }
        } catch (error) {
            setError('Failed to connect wallet: ' + error.message);
        }
    };

    const handleAmountChange = (tokenId, value) => {
        setAmounts(prev => ({
            ...prev,
            [tokenId]: value
        }));
    };

    const buyToken = async (tokenId, price) => {
        try {
            if (!account) {
                setError('Please connect your wallet first');
                return;
            }

            const amount = amounts[tokenId];
            if (!amount || amount <= 0) {
                setError('Please enter a valid amount');
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const escrowContract = new ethers.Contract(TARGET_ADDRESS, EscrowABI, signer);

            // Calculate total price (price per unit * amount)
            const pricePerUnit = ethers.utils.parseEther(price.toString());
            const totalPrice = pricePerUnit.mul(amount);

            // Call buyToken function
            const tx = await escrowContract.buyToken(CONTRACT_ADDRESS, tokenId, amount, {
                value: totalPrice
            });

            await tx.wait();
            setError(null);
            // Refresh NFTs after successful purchase
            readNFTs();
        } catch (error) {
            setError('Failed to buy token: ' + error.message);
        }
    };

    const readNFTs = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(MANTLE_SEPOLIA_RPC);
            const tokenContract = new ethers.Contract(CONTRACT_ADDRESS, RealEstateTokenABI, provider);
            const escrowContract = new ethers.Contract(TARGET_ADDRESS, EscrowABI, provider);

            // Get all token IDs
            const tokenIds = await tokenContract.balanceOfBatch(
                Array(100).fill(TARGET_ADDRESS), // Assuming max 100 different token IDs
                Array(100).fill().map((_, i) => i) // Start from 0
            );

            // Filter out tokens with balance > 0
            const ownedTokens = [];
            for (let i = 0; i < tokenIds.length; i++) {
                if (tokenIds[i].gt(0)) {
                    try {
                        console.log("tokenId to process: ", i);
                        const uri = await tokenContract.uri(i);
                        console.log('Original URI:', uri);

                        // Process the URI
                        let processedUri = uri;

                        // Remove ipfs.io suffix if present
                        if (processedUri.includes('https://ipfs.io/ipfs/')) {
                            processedUri = processedUri.replace('https://ipfs.io/ipfs/', '');
                        }

                        // Only add the token if it's not already in the URL
                        if (!processedUri.includes('pinataGatewayToken')) {
                            processedUri += `?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`;
                        }

                        console.log('Processed URI:', processedUri);

                        // Fetch the metadata
                        const response = await fetch(processedUri);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const metadata = await response.json();

                        // Add https:// prefix to picture URL if needed
                        if (metadata.picture && !metadata.picture.startsWith('http')) {
                            metadata.picture = 'https://' + metadata.picture;
                        }

                        // Add Pinata gateway token to picture URL
                        if (metadata.picture) {
                            metadata.picture += `?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`;
                        }

                        console.log("escrowContract: ", escrowContract);

                        // Get listed price from escrow contract
                        console.log("Fetching price for tokenId:", i);
                        const listedPrice = await escrowContract.getTokenPrice(i);
                        console.log("Raw listed price:", listedPrice.toString());
                        console.log("Formatted price:", ethers.utils.formatEther(listedPrice));

                        ownedTokens.push({
                            tokenId: i,
                            balance: tokenIds[i].toString(),
                            uri: processedUri,
                            metadata: metadata,
                            listedPrice: listedPrice.toString() === '0' ? 'Not Listed' : ethers.utils.formatEther(listedPrice)
                        });
                    } catch (error) {
                        console.error(`Error processing token ${i}:`, error);
                        // Continue with next token even if one fails
                        continue;
                    }
                }
            }

            console.log('Owned NFTs:', ownedTokens);
            setOwnedNFTs(ownedTokens);
        } catch (error) {
            console.error('Error reading NFTs:', error);
        }
    };

    // Read NFTs when component mounts
    useEffect(() => {
        readNFTs();
    }, []);

    return (
        <Box sx={{ flexGrow: 1, mt: 6 }}>
            {!account && (
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" color="primary" onClick={connectWallet}>
                        Connect Wallet
                    </Button>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                {ownedNFTs.map((nft) => (
                    <Grid item key={nft.tokenId} xs={12} sm={6} md={4} display="flex">
                        <Card
                            sx={{
                                background: 'rgba(20, 20, 24, 0.95)',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                maxWidth: '300px',
                                width: '100%',
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
                                image={nft.metadata.picture}
                                alt={nft.metadata.name}
                                sx={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '180px'
                                }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    {nft.metadata.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {nft.metadata.description}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="subtitle1" color="primary">
                                        {nft.listedPrice} MNT
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <Typography variant="subtitle2" sx={{ color: '#00FF9D' }}>
                                            Total Supply: {nft.metadata.units || 0}
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ color: '#00FF9D' }}>
                                            Available: {nft.balance}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ flexDirection: 'column', gap: 1, p: 2 }}>
                                <TextField
                                    type="number"
                                    label="Amount"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={amounts[nft.tokenId] || ''}
                                    onChange={(e) => handleAmountChange(nft.tokenId, e.target.value)}
                                    InputProps={{
                                        inputProps: { min: 1, max: nft.balance },
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
                                <Button
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    onClick={() => buyToken(nft.tokenId, nft.listedPrice)}
                                    disabled={!account || nft.listedPrice === 'Not Listed'}
                                >
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