import { LargeButton } from '@genaism/components/Button/Button';
import { TextField } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import { useLogger } from '@genaism/hooks/logger';

interface Props {
    onUsername: (name: string) => void;
}

interface FormErrors {
    username?: 'missing' | 'bad';
    fullname?: 'missing' | 'bad';
}

export default function EnterUsername({ onUsername }: Props) {
    const { t } = useTranslation();
    const ref = useRef<HTMLInputElement>(null);
    const nameref = useRef<HTMLInputElement>(null);
    const logger = useLogger();
    const [errors, setErrors] = useState<FormErrors>({});

    const doUsernameKey = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            setErrors((old) => ({ ...old, username: undefined }));
            if (logger) return;
            if (e.key === 'Enter') {
                const name = (e.target as HTMLInputElement).value;
                onUsername(name);
            }
        },
        [onUsername, logger]
    );

    const doFullnameKey = useCallback(() => {
        setErrors((old) => ({ ...old, fullname: undefined }));
    }, []);

    return (
        <div className={style.userContainer}>
            <TextField
                inputRef={ref}
                label={t('feed.labels.enterUsername')}
                onKeyDown={doUsernameKey}
                required
                error={!!errors.username}
                helperText={errors.username ? t(`feed.messages.usernameError.${errors.username}`) : undefined}
            />
            {logger && (
                <TextField
                    inputRef={nameref}
                    required
                    label={t('feed.labels.enterFullname')}
                    error={!!errors.fullname}
                    onKeyDown={doFullnameKey}
                    helperText={errors.fullname ? t(`feed.messages.fullnameError.${errors.fullname}`) : undefined}
                />
            )}
            <LargeButton
                onClick={() => {
                    if (ref.current) {
                        if (!ref.current.value) {
                            setErrors({ username: 'missing' });
                            return;
                        }
                        if (logger && nameref.current) {
                            if (!nameref.current.value) {
                                setErrors({ fullname: 'missing' });
                                return;
                            }
                            logger('enter_username', { username: ref.current.value, fullname: nameref.current.value });
                        }
                        onUsername(ref.current.value);
                    }
                }}
                variant="contained"
            >
                {t('feed.actions.enterUser')}
            </LargeButton>
        </div>
    );
}
