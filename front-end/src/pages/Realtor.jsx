import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Stack,
    Paper,
} from '@mui/material';
import { PinataSDK } from "pinata";
import { ethers } from 'ethers';
import RealEstateTokenABI from '../assets/contracts/RealEstateToken.abi.json';

const Realtor = () => {

    const pinata = new PinataSDK({
        pinataJwt: import.meta.env.VITE_PINATA_JWT,
        pinataGateway: import.meta.env.VITE_PINATA_GATEWAY_URL,
    });

    const uploadSimpleFileTestToPinata = async () => {
        const file = new File(["hello"], "Testing.txt", { type: "text/plain" });
        const upload = await pinata.upload.public.file(file);
        console.log(upload);
    }

    const mint = async (addressAccount, amount, cid) => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                import.meta.env.VITE_REAL_ESTATE_TOKEN_ADDRESS,
                RealEstateTokenABI,
                signer
            );

            const tx = await contract.mint(addressAccount, amount, cid, "0x");
            await tx.wait();
            console.log("Mint successful:", tx);
            return tx;
        } catch (error) {
            console.error("Mint failed:", error);
            throw error;
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const metadata = {
            name: form.name,
            description: form.description,
            units: form.units,
        };

        let metadataCid;
        if (form.picture) {
            try {
                const imageFile = new File([form.picture], form.picture.name, { type: form.picture.type });
                const upload = await pinata.upload.public.file(imageFile);
                const pictureCid = upload.cid;
                metadata.picture = import.meta.env.VITE_PINATA_GATEWAY_URL_IPFS + pictureCid;

                const uploadMetadata = await pinata.upload.public.json(metadata)
                metadataCid = uploadMetadata.cid;

                console.log("full metadata: ", import.meta.env.VITE_PINATA_GATEWAY_URL_IPFS + metadataCid);

                // Get the current account
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                const account = accounts[0];

                // Call mint function
                const result = await mint(account, form.units, metadataCid);
                console.log("Mint result:", result);
                alert('Minted!');
            } catch (error) {
                console.error("Error:", error);
                alert('Error occurred. Please try again.');
            }
        }
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