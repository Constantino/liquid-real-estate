import React, { useState, useEffect } from 'react';
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
    Alert,
} from '@mui/material';
import { ethers } from 'ethers';
import LoanHandlerABI from '../assets/contracts/LoanHandler.abi.json';
import RealEstateTokenABI from '../assets/contracts/RealEstateToken.abi.json';

const LOAN_HANDLER_ADDRESS = import.meta.env.VITE_LOAN_HANDLER_ADDRESS;
const CONTRACT_ADDRESS = import.meta.env.VITE_REAL_ESTATE_TOKEN_ADDRESS;

const Loans = () => {
    const [loans, setLoans] = useState([]);
    const [account, setAccount] = useState(null);
    const [error, setError] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [nftImages, setNftImages] = useState({});

    useEffect(() => {
        // Load loans from localStorage
        const savedLoans = JSON.parse(localStorage.getItem('loanRequests') || '[]');
        setLoans(savedLoans);
    }, []);

    const fetchNFTImages = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider('https://rpc.sepolia.mantle.xyz');
            const contract = new ethers.Contract(CONTRACT_ADDRESS, RealEstateTokenABI, provider);

            const images = {};
            for (const loan of loans) {
                for (const tokenId of loan.selectedNFTs) {
                    if (!images[tokenId]) {
                        console.log(`Fetching URI for token ${tokenId}`);
                        const uri = await contract.uri(tokenId);
                        console.log(`URI for token ${tokenId}:`, uri);

                        if (!uri) {
                            console.warn(`No URI found for token ${tokenId}`);
                            continue;
                        }

                        let processedUri = uri;

                        // Remove ipfs.io suffix if present
                        if (processedUri && processedUri.includes('https://ipfs.io/ipfs/')) {
                            processedUri = processedUri.replace('https://ipfs.io/ipfs/', '');
                        }

                        // Add gateway token if not present
                        if (processedUri && !processedUri.includes('pinataGatewayToken')) {
                            processedUri += `?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`;
                        }

                        // Add gateway URL if not present
                        if (processedUri && !processedUri.includes(import.meta.env.VITE_PINATA_GATEWAY_URL_IPFS)) {
                            processedUri = `${import.meta.env.VITE_PINATA_GATEWAY_URL_IPFS}${processedUri}`;
                        }

                        console.log(`Processed URI for token ${tokenId}:`, processedUri);
                        const response = await fetch(processedUri);
                        const metadata = await response.json();
                        console.log(`Metadata for token ${tokenId}:`, metadata);

                        // Process the image URL
                        let imageUrl = metadata?.picture;
                        if (!imageUrl) {
                            console.warn(`No picture URL found in metadata for token ${tokenId}`);
                            continue;
                        }

                        if (imageUrl.includes('https://ipfs.io/ipfs/')) {
                            imageUrl = imageUrl.replace('https://ipfs.io/ipfs/', '');
                        }
                        if (!imageUrl.includes('pinataGatewayToken')) {
                            imageUrl += `?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`;
                        }
                        if (!imageUrl.includes(import.meta.env.VITE_PINATA_GATEWAY_URL_IPFS)) {
                            imageUrl = `${import.meta.env.VITE_PINATA_GATEWAY_URL_IPFS}${imageUrl}`;
                        }

                        console.log(`Final image URL for token ${tokenId}:`, imageUrl);
                        images[tokenId] = imageUrl;
                    }
                }
            }
            setNftImages(images);
        } catch (error) {
            console.error('Error fetching NFT images:', error);
        }
    };

    useEffect(() => {
        if (loans.length > 0) {
            fetchNFTImages();
        }
    }, [loans]);

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
        } catch (error) {
            setError(error.message);
        } finally {
            setIsConnecting(false);
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
                } else {
                    setAccount(null);
                }
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, []);

    const handlePayLoan = async (loanId) => {
        try {
            if (!window.ethereum) {
                throw new Error('Please install MetaMask!');
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(LOAN_HANDLER_ADDRESS, LoanHandlerABI, signer);

            // Get loan details to calculate payment amount
            const [borrower, collateralValue, interestRate, loanAmount, time, totalPayment, isActive] = await contract.getLoan(loanId);

            if (!isActive) {
                throw new Error('This loan is not active');
            }

            // Send the transaction with the total payment amount
            const tx = await contract.payLoan(loanId, { value: totalPayment });
            await tx.wait();

            // Update the loan status in localStorage
            const updatedLoans = loans.map(loan => {
                if (loan.loanId === loanId) {
                    return { ...loan, status: 'Paid' };
                }
                return loan;
            });
            setLoans(updatedLoans);
            localStorage.setItem('loanRequests', JSON.stringify(updatedLoans));

        } catch (error) {
            console.error('Error paying loan:', error);
            setError(error.message);
        }
    };

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

            {account && loans.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    No loan requests found.
                </Alert>
            )}

            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                {loans.map((loan) => (
                    <Grid item key={loan.id} xs={12} sm={6} md={4} display="flex">
                        <Card
                            sx={{
                                background: 'rgba(20, 20, 24, 0.95)',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
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
                            <Stack direction="row" spacing={1} sx={{ p: 1, justifyContent: 'center', alignItems: 'center' }}>
                                {loan.selectedNFTs.map((tokenId) => (
                                    <CardMedia
                                        key={tokenId}
                                        component="img"
                                        image={nftImages[tokenId] || 'https://via.placeholder.com/60'}
                                        alt={`NFT ${tokenId}`}
                                        sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2, border: '2px solid #222', boxShadow: 1 }}
                                    />
                                ))}
                            </Stack>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    Loan Request #{loan.id}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="subtitle2" sx={{ color: '#00FF9D' }}>
                                        Loan ID: {loan.loanId}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: '#00FF9D' }}>
                                        Collateral Value: {loan.collateralValue} MNT
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: '#00FF9D' }}>
                                        Loan Amount: {loan.loanAmount} MNT
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: '#00FF9D' }}>
                                        Time: {loan.time} months
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: '#00FF9D' }}>
                                        Interest Rate: {loan.interestRate}%
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: '#00FF9D' }}>
                                        Total Payment: {loan.totalPayment} MNT
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: '#00FF9D' }}>
                                        Status: {loan.status || 'Pending'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Requested: {new Date(loan.timestamp).toLocaleString()}
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handlePayLoan(loan.loanId)}
                                    disabled={!account || loan.status === 'Paid'}
                                    sx={{
                                        background: 'linear-gradient(90deg, #00FF9D 0%, #00B8FF 100%)',
                                        color: '#000',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        padding: '8px 24px',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        boxShadow: '0 2px 8px rgba(0, 255, 157, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(90deg, #00B8FF 0%, #00FF9D 100%)',
                                            boxShadow: '0 4px 12px rgba(0, 255, 157, 0.4)',
                                        },
                                        '&:disabled': {
                                            background: 'rgba(0, 255, 157, 0.1)',
                                            color: 'rgba(0, 0, 0, 0.3)',
                                            boxShadow: 'none',
                                        },
                                    }}
                                >
                                    {loan.status === 'Paid' ? 'Paid' : 'Pay Loan'}
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