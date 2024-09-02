import { FormControlLabel, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material';
import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AlertPara, canvasFromURL, LargeButton } from '@knicos/genai-base';
import useImageSearch, { Options } from '@genaism/services/imageSearch/hook';
import { useContentService } from '@genaism/hooks/services';

interface Props {
    onQuery: (q: string, options: Options) => void;
    disabled?: boolean;
}

export default function QueryGenerator({ onQuery, disabled }: Props) {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>();
    const [query, setQuery] = useState<string | undefined>();
    const [order, setOrder] = useState<'latest' | 'popular'>('latest');
    const [content, setContent] = useState<string[]>([]);
    const newimages = useImageSearch(query, { page: 1, source: 'pixabay', order });
    const contentSvc = useContentService();

    const doChange = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const value = (e.target as HTMLInputElement).value;
            if (value.length >= 2) {
                //setImages([]);
                setQuery(value);
            }
        }
    }, []);

    const doSearch = useCallback(() => {
        const value = inputRef.current?.value;
        if (value && value.length >= 2) {
            //setImages([]);
            setQuery(value);
        }
    }, []);

    useEffect(() => {
        setContent([]);
        newimages.results.forEach((image) => {
            if (contentSvc.hasContent(`content:${image.id}`)) return;
            canvasFromURL(image.url, 500).then((canvas) => {
                const imageData = canvas.toDataURL('image/jpeg', 0.95);
                /*contentSvc.addContent(imageData, {
                    id: image.id,
                    labels: image.tags.map((t) => ({ label: t, weight: 1 })),
                    author: image.author,
                });*/
                setContent((old) => [...old, imageData]);
            });
        });
    }, [newimages, contentSvc]);

    return (
        <section
            className={style.wizard}
            data-testid="content-wizard"
        >
            <div className={style.controlsContainer}>
                <div className={style.controls}>
                    <TextField
                        disabled={disabled}
                        label={t('search')}
                        type="search"
                        variant="outlined"
                        onKeyDown={doChange}
                        inputRef={inputRef}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <LargeButton
                        variant="contained"
                        onClick={doSearch}
                        disabled={disabled}
                    >
                        {t('actions.go')}
                    </LargeButton>
                </div>
                <AlertPara severity="info">{t('hints.imageSearch')}</AlertPara>
            </div>
            <div className={style.controlsContainer}>
                <div className={style.controls}>
                    <RadioGroup
                        sx={{ flexDirection: 'row', gap: '1rem' }}
                        defaultValue="latest"
                        name="radio-buttons-group"
                        value={order}
                        onChange={(_, value) => {
                            setOrder(value as 'latest' | 'popular');
                        }}
                    >
                        <FormControlLabel
                            value="latest"
                            control={<Radio />}
                            label={t('dashboard.labels.latest')}
                            disabled={disabled}
                        />
                        <FormControlLabel
                            value="popular"
                            control={<Radio />}
                            label={t('dashboard.labels.popular')}
                            disabled={disabled}
                        />
                    </RadioGroup>
                </div>
            </div>
            <div className={style.imageGrid}>
                {content.map((c, ix) => {
                    return (
                        <img
                            key={ix}
                            src={c}
                            alt=""
                            width={100}
                            height={100}
                        />
                    );
                })}
            </div>
            <LargeButton
                variant="contained"
                disabled={disabled || !query}
                onClick={() => onQuery(query || '', { order, source: 'pixabay' })}
                color="secondary"
            >
                {t('actions.next')}
            </LargeButton>
        </section>
    );
}
