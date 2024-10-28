import { IconButton } from '@mui/material';
import { ActionLogTable, ContentLogEntry } from '@genaism/components/ActionLogTable';
import ImageCloud, { WeightedImage } from '../../visualisations/ImageCloud/ImageCloud';
import style from './style.module.css';
import { useCallback, useRef, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { svgToPNG } from '@genaism/util/svgToPNG';

interface Props {
    onSave?: (data: string) => void;
    log: ContentLogEntry[];
    content: WeightedImage[];
    fixedSize?: number;
    cloudSize?: number;
}

export default function DataProfilePure({ cloudSize = 300, onSave, log, content, fixedSize }: Props) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [wcSize, setWCSize] = useState(cloudSize);
    const doResize = useCallback((size: number) => {
        setWCSize(size);
    }, []);

    const doSave = () => {
        if (svgRef.current) {
            svgToPNG(svgRef.current, 4).then((data) => {
                if (onSave) onSave(data);
            });
        }
    };

    return (
        <>
            <div className={style.svgContainer}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height={`${cloudSize}px`}
                    viewBox={`${-(wcSize * 1.67)} ${-wcSize} ${wcSize * 1.67 * 2} ${wcSize * 2}`}
                    ref={svgRef}
                >
                    <ImageCloud
                        content={content}
                        size={cloudSize}
                        onSize={doResize}
                    />
                </svg>
                {onSave && (
                    <IconButton onClick={doSave}>
                        <DownloadIcon />
                    </IconButton>
                )}
            </div>
            <ActionLogTable
                log={log}
                fixedSize={fixedSize}
            />
        </>
    );
}
