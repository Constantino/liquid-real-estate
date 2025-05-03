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
    Button,
    Modal,
    Paper,
    IconButton,
    TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

const Assets = () => {
    const [selected, setSelected] = useState([]);
    const [open, setOpen] = useState(false);

    const handleSelect = (id) => (event) => {
        setSelected((prev) =>
            event.target.checked
                ? [...prev, id]
                : prev.filter((selectedId) => selectedId !== id)
        );
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box sx={{ flexGrow: 1, mt: 6, position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Request Loan
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
                                border: selected.includes(nft.id) ? '2px solid #00FF9D' : 'none',
                                transition: 'box-shadow 0.2s, border-color 0.2s',
                                boxShadow: selected.includes(nft.id)
                                    ? '0 0 0 2px #00FF9D'
                                    : '0 2px 12px 0 rgba(0,0,0,0.12)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    border: selected.includes(nft.id)
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
                                const isSelected = selected.includes(nft.id);
                                setSelected((prev) =>
                                    isSelected ? prev.filter((id) => id !== nft.id) : [...prev, nft.id]
                                );
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }} onClick={e => e.stopPropagation()}>
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
                        <TextField label="Collateral" name="collateral" fullWidth />
                        <TextField label="Loan Amount" name="loanAmount" type="number" fullWidth />
                        <TextField label="Fixed Fee" name="fixedFee" type="number" fullWidth />
                        <TextField label="Interest" name="interest" type="number" fullWidth />
                        <TextField label="Time" name="time" fullWidth />
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button variant="contained" color="success" size="large">
                            Get loan
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </Box>
    );
};

export default Assets;