'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { getLoanStatus, getClients } from '../../api/apiService';

export default function LoanStatusPage() {
    const [clients, setClients] = useState<{ clientId: string; maxAdvance: number }[]>([]);
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchClients = async () => {
            setIsLoading(true);
            try {
                const clientsList = await getClients();
                setClients(clientsList);
            } catch (error) {
                console.error('Error fetching clients:', error);
                alert('Ocurrió un error al obtener la lista de clientes.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, []);

    const handleCheckStatus = async () => {
        if (!selectedClient) {
            alert('Por favor, selecciona un cliente.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await getLoanStatus(selectedClient);
            setStatus(response.status);
        } catch (error) {
            console.error('Error fetching loan status:', error);
            alert('Ocurrió un error al consultar el estado del préstamo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ padding: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Estado del Préstamo
            </Typography>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                    <CircularProgress />
                </Box>
            ) : clients.length === 0 ? (
                <Typography variant="h6" color="textSecondary">
                    No hay clientes disponibles para consultar el estado del préstamo.
                </Typography>
            ) : (
                <>
                    <FormControl fullWidth sx={{ marginBottom: '1rem' }}>
                        <InputLabel id="client-select-label">Seleccionar Cliente</InputLabel>
                        <Select
                            labelId="client-select-label"
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                        >
                            {clients.map((client) => (
                                <MenuItem key={client.clientId} value={client.clientId}>
                                    {client.clientId} (Máximo Adelanto: ${client.maxAdvance.toFixed(2)})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCheckStatus}
                        disabled={!selectedClient}
                    >
                        Consultar Estado
                    </Button>
                </>
            )}

            {status && (
                <Typography variant="h6" sx={{ marginTop: '1rem' }}>
                    Estado Actual: {status}
                </Typography>
            )}
        </Box>
    );
}
