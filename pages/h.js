import React, { useCallback, useState } from 'react';
import { Caption, DropZone, Stack, Thumbnail } from '@shopify/polaris';

export default function DropZoneExample() {
    const [file, setFile] = useState();

    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
            setFile((file) => acceptedFiles[0]),
        [],
    );

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = !file && <DropZone.FileUpload />;
    const uploadedFile = file && (
        <Stack>
            <Thumbnail
                size="small"
                alt={file.name}
                source={
                    validImageTypes.indexOf(file.type) > 0
                        ? window.URL.createObjectURL(file)
                        : 'https://cdn.shopify.com/s/files/1/0757/9955/files/New_Post.png?12678548500147524304'
                }
            />
            <div>
                {file.name} <Caption>{file.size} bytes</Caption>
            </div>
        </Stack>
    );

    return (
        <DropZone accept="image/*" type="image" allowMultiple={false} onDrop={handleDropZoneDrop}>
            {uploadedFile}
            {fileUpload}
        </DropZone>
    );
}