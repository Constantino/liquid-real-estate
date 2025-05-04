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
    Alert,
    Modal,
    Paper,
    IconButton,
    TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ethers } from 'ethers';
import RealEstateTokenABI from '../assets/contracts/RealEstateToken.abi.json';
import EscrowABI from '../assets/contracts/Escrow.abi.json';

const MANTLE_SEPOLIA_RPC = 'https://rpc.sepolia.mantle.xyz';
const CONTRACT_ADDRESS = import.meta.env.VITE_REAL_ESTATE_TOKEN_ADDRESS;
const ESCROW_ADDRESS = import.meta.env.VITE_ESCROW_ADDRESS;
const INTEREST_RATE = 10; // 10% interest rate

const Assets = () => {
    const [ownedNFTs, setOwnedNFTs] = useState([]);
    const [account, setAccount] = useState(null);
    const [error, setError] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [selected, setSelected] = useState([]);
    const [open, setOpen] = useState(false);
    const [loanAmount, setLoanAmount] = useState(0);
    const [time, setTime] = useState(0);
    const [loanError, setLoanError] = useState(null);
    const [timeError, setTimeError] = useState(null);

    const handleSelect = (id) => (event) => {
        setSelected((prev) =>
            event.target.checked
                ? [...prev, id]
                : prev.filter((selectedId) => selectedId !== id)
        );
    };

    const handleOpen = () => {
        if (selected.length === 0) {
            setError('Please select at least one NFT to request a loan');
            return;
        }
        setError(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    const calculateCollateralValue = () => {
        return selected.reduce((sum, tokenId) => {
            const nft = ownedNFTs.find(n => n.tokenId === tokenId);
            if (nft && nft.listedPrice !== 'Not Listed') {
                return sum + (parseFloat(nft.balance) * parseFloat(nft.listedPrice));
            }
            return sum;
        }, 0);
    };

    const handleLoanAmountChange = (event) => {
        const newAmount = parseFloat(event.target.value) || 0;
        const collateralValue = calculateCollateralValue();

        if (newAmount > collateralValue) {
            setLoanError('Loan amount cannot exceed collateral value');
        } else {
            setLoanError(null);
        }

        setLoanAmount(newAmount);
    };

    const handleTimeChange = (event) => {
        const newTime = parseFloat(event.target.value) || 0;

        if (newTime > 12) {
            setTimeError('Time cannot exceed 12 months');
        } else {
            setTimeError(null);
        }

        setTime(newTime);
    };

    const calculateTotalPayment = () => {
        const interestAmount = (loanAmount * INTEREST_RATE / 12 * time) / 100;
        const totalPayment = loanAmount + interestAmount;
        return totalPayment.toFixed(18);
    };

    const connectWallet = async () => {
        try {
            setIsConnecting(true);
            setError(null);

            if (!window.ethereum) {
                throw new Error('Please install MetaMask!');
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);

            if (accounts.length === 0) {
                throw new Error('No accounts found. Please connect your wallet.');
            }

            setAccount(accounts[0]);
            // Read NFTs after connecting wallet
            await readNFTs(accounts[0]);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsConnecting(false);
        }
    };

    const readNFTs = async (walletAddress) => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(MANTLE_SEPOLIA_RPC);
            const tokenContract = new ethers.Contract(CONTRACT_ADDRESS, RealEstateTokenABI, provider);
            const escrowContract = new ethers.Contract(ESCROW_ADDRESS, EscrowABI, provider);

            // Get all token IDs
            const tokenIds = await tokenContract.balanceOfBatch(
                Array(100).fill(walletAddress), // Assuming max 100 different token IDs
                Array(100).fill().map((_, i) => i) // Start from 0
            );

            // Filter out tokens with balance > 0
            const ownedTokens = [];
            for (let i = 0; i < tokenIds.length; i++) {
                if (tokenIds[i].gt(0)) {
                    try {
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

                        // Get listed price from escrow contract
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
            setError('Failed to read NFTs: ' + error.message);
        }
    };

    // Check if wallet is already connected when component mounts
    useEffect(() => {
        const checkWalletConnection = async () => {
            if (window.ethereum) {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const accounts = await provider.listAccounts();
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        await readNFTs(accounts[0]);
                    }
                } catch (error) {
                    console.error('Error checking wallet connection:', error);
                }
            }
        };

        checkWalletConnection();
    }, []);

    // Listen for account changes
    useEffect(() => {
        if (window.ethereum) {
            const handleAccountsChanged = async (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    await readNFTs(accounts[0]);
                } else {
                    setAccount(null);
                    setOwnedNFTs([]);
                }
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, []);

    return (
        <Box sx={{ flexGrow: 1, mt: 6, position: 'relative' }}>
            {!account && (
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={connectWallet}
                        disabled={isConnecting}
                    >
                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                    </Button>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {account && ownedNFTs.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    No NFTs found in your wallet.
                </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                    disabled={!account || ownedNFTs.length === 0}
                >
                    Request Loan
                </Button>
            </Box>

            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                {ownedNFTs.map((nft) => (
                    <Grid item key={nft.tokenId} xs={12} sm={6} md={4} display="flex">
                        <Card
                            sx={{
                                background: 'rgba(20, 20, 24, 0.95)',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                cursor: 'pointer',
                                border: selected.includes(nft.tokenId) ? '2px solid #00FF9D' : 'none',
                                transition: 'box-shadow 0.2s, border-color 0.2s',
                                boxShadow: selected.includes(nft.tokenId)
                                    ? '0 0 0 2px #00FF9D'
                                    : '0 2px 12px 0 rgba(0,0,0,0.12)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    border: selected.includes(nft.tokenId)
                                        ? '2px solid #00FF9D'
                                        : 'none',
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
                            onClick={() => {
                                const isSelected = selected.includes(nft.tokenId);
                                setSelected((prev) =>
                                    isSelected ? prev.filter((id) => id !== nft.tokenId) : [...prev, nft.tokenId]
                                );
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }} onClick={e => e.stopPropagation()}>
                                {/* Checkbox removed, selection logic remains */}
                            </Box>
                            <CardMedia
                                component="img"
                                height="180"
                                image={nft.metadata.picture}
                                alt={nft.metadata.name}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    {nft.metadata.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {nft.metadata.description}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Typography variant="subtitle2" sx={{ color: '#00FF9D' }}>
                                        Total Supply: {nft.metadata.units || 0}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: '#00FF9D' }}>
                                        Owned: {nft.balance}
                                    </Typography>
                                    <Typography variant="subtitle1" color="primary" sx={{ mt: 1 }}>
                                        Price: {nft.listedPrice} MNT
                                    </Typography>
                                    <Typography variant="subtitle1" color="primary" sx={{ mt: 1 }}>
                                        Investment: {nft.listedPrice === 'Not Listed' ? '0' : (parseFloat(nft.balance) * parseFloat(nft.listedPrice)).toFixed(4)} MNT
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Modal open={open} onClose={handleClose}>
                <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 4, minWidth: 546, minHeight: 320, display: 'flex', flexDirection: 'column', background: 'rgba(30, 30, 40, 0.85)', backdropFilter: 'blur(12px)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                        <IconButton onClick={handleClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Request Loan
                    </Typography>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="subtitle1" color="primary">
                            Collateral value: {calculateCollateralValue().toFixed(4)} MNT
                        </Typography>
                        <TextField
                            label="Loan Amount"
                            name="loanAmount"
                            type="number"
                            fullWidth
                            onChange={handleLoanAmountChange}
                            error={!!loanError}
                            helperText={loanError}
                        />
                        <Typography variant="subtitle1" color="primary">
                            Interest: {INTEREST_RATE}% annually
                        </Typography>
                        <TextField
                            label="Time (months)"
                            name="time"
                            type="number"
                            fullWidth
                            onChange={handleTimeChange}
                            error={!!timeError}
                            helperText={timeError}
                            inputProps={{ max: 12 }}
                        />
                        <Typography variant="subtitle1" color="primary">
                            You will pay: {calculateTotalPayment()} MNT
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            disabled={!!loanError || !!timeError}
                        >
                            Get loan
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </Box>
    );
};

export default Assets;