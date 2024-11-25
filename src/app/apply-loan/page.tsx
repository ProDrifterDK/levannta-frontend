'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
} from '@mui/material';
import { applyLoan, getClients } from '../../api/apiService';

export default function ApplyLoanPage() {
    const [amount, setAmount] = useState('');
    const [clients, setClients] = useState<{ clientId: string; maxAdvance: number }[]>([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [paymentTable, setPaymentTable] = useState<{ month: number; amount: number }[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchClients = async () => {
            setIsLoading(true);
            try {
                const response = await getClients();
                setClients(response);
            } catch (error) {
                console.error('Error al obtener clientes:', error);
                alert('No se pudo cargar la lista de clientes.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, []);

    const handleApply = async () => {
        if (!selectedClient) {
            alert('Por favor, selecciona un cliente.');
            return;
        }

        const numericAmount = Number(amount);
        if (numericAmount <= 0) {
            alert('El monto debe ser mayor que 0.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await applyLoan({ clientId: selectedClient, amount: numericAmount });
            setResponseMessage(response.message);
            setPaymentTable(response.paymentTable || null);
        } catch (error) {
            console.error('Error al solicitar el adelanto:', error);
            alert('Ocurrió un error al solicitar el adelanto.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ padding: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Solicitar Adelanto
            </Typography>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                    <CircularProgress />
                </Box>
            ) : clients.length === 0 ? (
                <Typography variant="h6" color="textSecondary">
                    No hay clientes disponibles para solicitar un adelanto.
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
                                    {client.clientId} (Máximo: ${client.maxAdvance})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        value={amount}
                        onChange={(e) => {
                            const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                            setAmount(numericValue);
                        }}
                        label="Monto del Adelanto"
                        type="number"
                        variant="outlined"
                        sx={{ marginBottom: '1rem' }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApply}
                        disabled={!amount || Number(amount) <= 0 || !selectedClient}
                    >
                        Solicitar
                    </Button>
                </>
            )}

            {responseMessage && (
                <Typography variant="h6" sx={{ marginTop: '1rem' }}>
                    {responseMessage}
                </Typography>
            )}

            {paymentTable && (
                <Box sx={{ marginTop: '2rem' }}>
                    <Typography variant="h6">Tabla de Pagos</Typography>
                    {paymentTable.map((row) => (
                        <Typography key={row.month}>
                            Mes {row.month}: ${row.amount.toFixed(2)}
                        </Typography>
                    ))}
                </Box>
            )}
        </Box>
    );
}
