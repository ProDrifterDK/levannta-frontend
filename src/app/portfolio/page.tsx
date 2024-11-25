'use client';

import React, { useState } from 'react';
import {
    Typography,
    Box,
    Button,
    Modal,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ExcelJS from 'exceljs';
import { uploadPortfolio } from '../../api/apiService';
import { PortfolioRow } from '@/types/portfolio';
import FileUploader from '@/components/FileUploader/FileUploader';

export default function PortfolioPage() {
    const [file, setFile] = useState<File | null>(null);
    const [groupedData, setGroupedData] = useState<Record<string, PortfolioRow>>({});
    const [showOptions, setShowOptions] = useState(false);
    const [globalChurnRate, setGlobalChurnRate] = useState<number | null>(null);
    const [clientChurnRates, setClientChurnRates] = useState<Record<string, number>>({});
    const [results, setResults] = useState<{ clientId: string; maxAdvance: number }[] | null>(null);

    const handleFileUpload = async (uploadedFile: File | null) => {
        if (!uploadedFile) return;

        setFile(uploadedFile);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(await uploadedFile.arrayBuffer());

        const worksheet = workbook.worksheets[0];
        const rawData: PortfolioRow[] = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;

            const clientId = row.getCell(1).value?.toString() ?? '';
            const amount = parseFloat(row.getCell(2).value?.toString() ?? '0');
            const year = parseInt(row.getCell(3).value?.toString() ?? '0', 10);
            const month = parseInt(row.getCell(4).value?.toString() ?? '0', 10);
            const churnRateCell = row.getCell(5)?.value;
            const churnRate =
                churnRateCell !== undefined && churnRateCell !== null
                    ? parseFloat(churnRateCell.toString())
                    : undefined;

            rawData.push({ clientId, amount, year, month, churnRate });
        });

        const grouped: Record<string, PortfolioRow> = rawData.reduce((acc, row) => {
            if (!acc[row.clientId]) {
                acc[row.clientId] = { ...row, amount: 0 };
            }
            acc[row.clientId].amount += row.amount;
            return acc;
        }, {} as Record<string, PortfolioRow>);

        setGroupedData(grouped);

        if (Object.values(grouped).some((row) => row.churnRate === undefined)) {
            setShowOptions(true);
        }
    };

    const handleUpdateFile = async () => {
        if (!file) return;

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(await file.arrayBuffer());

        const worksheet = workbook.worksheets[0];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;

            const clientId = row.getCell(1).value?.toString() || '';
            const churnRate =
                clientChurnRates[clientId] !== undefined
                    ? clientChurnRates[clientId]
                    : globalChurnRate !== null
                        ? globalChurnRate
                        : 0;

            row.getCell(5).value = churnRate;
        });

        const modifiedFile = await workbook.xlsx.writeBuffer();
        const updatedBlob = new Blob([modifiedFile], { type: file.type });
        const updatedFile = new File([updatedBlob], file.name, { type: file.type });

        const response = await uploadPortfolio(updatedFile);
        setResults(response);
        setShowOptions(false);
    };

    const handleSetAllToZero = () => {
        const updatedRates = Object.keys(groupedData).reduce((acc, clientId) => {
            acc[clientId] = 0;
            return acc;
        }, {} as Record<string, number>);
        setClientChurnRates(updatedRates);
    };

    const handleReset = () => {
        setFile(null);
        setGroupedData({});
        setClientChurnRates({});
        setGlobalChurnRate(null);
        setResults(null);
        setShowOptions(false);
    };

    return (
        <Box sx={{ padding: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Cargar Cartera
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <FileUploader onFileChange={handleFileUpload} />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateFile}
                    disabled={!file}
                >
                    Subir Archivo
                </Button>
            </Box>

            {results && (
                <>
                    <Typography variant="h5" gutterBottom sx={{ marginTop: '2rem' }}>
                        Resultados del Procesamiento
                    </Typography>
                    <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell align="right">Adelanto Máximo ($)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map((result) => (
                                    <TableRow key={result.clientId}>
                                        <TableCell>{result.clientId}</TableCell>
                                        <TableCell align="right">{result.maxAdvance}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            <Modal open={showOptions} onClose={() => setShowOptions(false)}>
                <Box
                    sx={{
                        padding: '2rem',
                        background: '#fff',
                        margin: 'auto',
                        marginTop: '5%',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        width: '80%',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <WarningAmberIcon color="warning" />
                        <Typography variant="h6" gutterBottom>
                            Se han detectado datos faltantes en el archivo
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={handleSetAllToZero}
                        sx={{ marginTop: '1rem', marginBottom: '1rem' }}
                    >
                        Usar 0 para todos
                    </Button>
                    <TextField
                        fullWidth
                        label="Valor Global de Churn rate"
                        type="number"
                        onChange={(e) => setGlobalChurnRate(parseFloat(e.target.value))}
                        sx={{ marginBottom: '1.5rem' }}
                    />
                    <Typography variant="body1" gutterBottom>
                        Asigna manualmente valores para cada cliente:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        {Object.values(groupedData).map((row) => (
                            <TextField
                                key={row.clientId}
                                label={`Churn rate para ${row.clientId}`}
                                type="number"
                                value={clientChurnRates[row.clientId] ?? ''}
                                onChange={(e) =>
                                    setClientChurnRates({
                                        ...clientChurnRates,
                                        [row.clientId]: parseFloat(e.target.value),
                                    })
                                }
                                sx={{ width: 'calc(50% - 1rem)' }}
                            />
                        ))}
                    </Box>
                    <Box sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="outlined" color="secondary" onClick={handleReset}>
                            Subir un nuevo archivo
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleUpdateFile}>
                            Confirmar y subir archivo modificado
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}
