import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Stack,
    Paper,
} from '@mui/material';

const Realtor = () => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        units: '',
        picture: null,
        pictureUrl: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setForm((prev) => ({ ...prev, picture: file, pictureUrl: url }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle mint logic here
        alert('Minted!');
    };

    return (
        <Box
            component={Paper}
            elevation={6}
            sx={{
                maxWidth: 420,
                mx: 'auto',
                mt: 8,
                p: 4,
                borderRadius: 3,
                background: 'rgba(20, 20, 24, 0.95)',
            }}
        >
            <Typography variant="h4" mb={2} align="center">
                Mint New Property
            </Typography>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        multiline
                        minRows={2}
                        fullWidth
                    />
                    <Button
                        variant="outlined"
                        component="label"
                        color="primary"
                    >
                        Upload Picture
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handlePictureChange}
                        />
                    </Button>
                    {form.pictureUrl && (
                        <Box
                            component="img"
                            src={form.pictureUrl}
                            alt="Preview"
                            sx={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 2, mt: 1 }}
                        />
                    )}
                    <TextField
                        label="Amount of Units"
                        name="units"
                        type="number"
                        value={form.units}
                        onChange={handleChange}
                        required
                        inputProps={{ min: 1 }}
                        fullWidth
                    />
                    <Button type="submit" variant="contained" color="success" size="large" fullWidth>
                        Mint
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default Realtor;