import React, { useRef, useState } from 'react';
import styles from './FileUploader.module.css';

interface FileUploaderProps {
    onFileChange: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isHandling, setIsHandling] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isHandling) return;

        setIsHandling(true);

        const file = event.target.files?.[0] || null;
        onFileChange(file);

        if (inputRef.current) {
            inputRef.current.value = '';
        }

        setTimeout(() => {
            setIsHandling(false);
        }, 200);
    };

    const handleLabelClick = () => {
        if (isHandling) return;
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <div className={styles['file-uploader']} onClick={handleLabelClick}>
            <label htmlFor="file" className={styles['file-label']}>
                <span className={styles['upload-icon']}>📁</span>
                <span>Seleccione un archivo para cargar</span>
            </label>
            <input
                ref={inputRef}
                type="file"
                id="file"
                className={styles['file-input']}
                accept=".xlsx,.csv"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default FileUploader;
