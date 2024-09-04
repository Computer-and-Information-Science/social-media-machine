import { MouseEvent, useCallback, useEffect, useReducer, useState } from 'react';
import style from './style.module.css';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ReplyIcon from '@mui/icons-material/Reply';
import Avatar from '@mui/material/Avatar';
import SharePanel, { ShareKind } from './SharePanel';
import CommentPanel from './CommentPanel';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import LabelsPanel from './LabelsPanel';
import IconButtonDot from '../IconButtonDot/IconButtonDot';
import { useTranslation } from 'react-i18next';
import { ContentNodeId, UserNodeId } from '@knicos/genai-recom';
import { useContentService } from '@genaism/hooks/services';
import { useContent, useContentStats } from '@genaism/hooks/content';

const MAX_COMMENTS = 10;

type ActionPanel = 'none' | 'like' | 'comment' | 'share' | 'discard' | 'author';

interface Props {
    id: ContentNodeId;
    active?: boolean;
    visible?: boolean;
    noActions?: boolean;
    showLabels?: boolean;
    reason?: string;
    noComments?: boolean;
    noLike?: boolean;
    noShare?: boolean;
    noFollow?: boolean;
    onClick?: (id: ContentNodeId) => void;
    onLike?: (id: ContentNodeId, kind: LikeKind) => void;
    onShare?: (id: ContentNodeId, kind: ShareKind, user?: UserNodeId) => void;
    onComment?: (id: ContentNodeId, comment: string) => void;
    onFollow?: (id: ContentNodeId) => void;
    onUnfollow?: (id: ContentNodeId) => void;
}

function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

function stringAvatar(name: string) {
    const split = name.split(' ');
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${split[0][0].toLocaleUpperCase()}${split.length > 1 ? split[1][0].toLocaleUpperCase() : ''}`,
    };
}

export type LikeKind = 'none' | 'like';

export default function FeedImage({
    id,
    onClick,
    onLike,
    onFollow,
    onUnfollow,
    onShare,
    onComment,
    active,
    visible,
    noActions,
    showLabels,
    reason,
    noComments,
    noLike,
    noFollow,
    noShare,
}: Props) {
    const { t } = useTranslation();
    const content = useContentService();
    const [contentMeta, contentData] = useContent(id);
    const [liked, setLiked] = useState<LikeKind>('none');
    const [activePanel, setActivePanel] = useState<ActionPanel>('none');
    const [followed, setFollowed] = useState(false);
    const [commentCount, incComment] = useReducer((v) => ++v, 0);
    const { reactions, shares } = useContentStats(id);

    const doClick = useCallback(() => {
        if (onClick) onClick(id);
        setActivePanel('none');
    }, [onClick, id]);

    const doLike = useCallback(() => {
        setLiked((old) => {
            const kind = old === 'none' ? 'like' : 'none';
            if (onLike) onLike(id, kind);
            return kind;
        });
    }, [onLike, id]);

    const doShare = useCallback(
        (kind: ShareKind, user: UserNodeId) => {
            if (onShare) onShare(id, kind, user);
        },
        [onShare, id]
    );

    const doComment = useCallback(
        (l: string) => {
            if (onComment) {
                onComment(id, l);
                incComment();
            }
        },
        [onComment, id]
    );

    const doShowSharePanel = useCallback(
        (e: MouseEvent) => {
            setActivePanel('share');
            e.stopPropagation();
        },
        [setActivePanel]
    );

    const doShowComments = useCallback(
        (e: MouseEvent) => {
            setActivePanel((current) => (current === 'comment' ? 'none' : 'comment'));
            e.stopPropagation();
        },
        [setActivePanel]
    );

    const doFollow = useCallback(() => {
        setFollowed((v) => {
            if (onFollow && !v) onFollow(id);
            if (onUnfollow && v) onUnfollow(id);
            return !v;
        });
    }, [onFollow, id, onUnfollow]);

    const doCloseLike = useCallback(() => {
        setActivePanel('none');
    }, []);

    useEffect(() => {
        if (!active) setActivePanel('none');
    }, [active]);

    return !visible || !contentData || !contentMeta ? null : (
        <div className={style.container}>
            <div className={active || noActions ? style.activeImageContainer : style.imageContainer}>
                {(active || noActions) && !reason && (
                    <div className={style.name}>
                        <Avatar {...stringAvatar(contentMeta.author || 'Unknown')} />
                        <span className={style.author}>{contentMeta.author || 'Unknown'}</span>
                        {!noActions && !noFollow && (
                            <IconButton
                                color="inherit"
                                onClick={doFollow}
                                data-testid="feed-image-follow-button"
                                aria-label={t('feed.aria.followUser')}
                                aria-pressed={followed}
                            >
                                {followed ? (
                                    <PersonRemoveIcon
                                        color="inherit"
                                        fontSize="large"
                                    />
                                ) : (
                                    <PersonAddIcon
                                        color="inherit"
                                        fontSize="large"
                                    />
                                )}
                            </IconButton>
                        )}
                    </div>
                )}
                {reason && <div className={style.reason}>{reason}</div>}
                <img
                    onClick={doClick}
                    className={style.instaImage}
                    src={contentData}
                    alt="Insta Upload"
                    data-testid="feed-image-element"
                />
                {active && !noActions && (
                    <div
                        className={style.buttonRow}
                        onClick={doClick}
                    >
                        {!noLike && (
                            <IconButtonDot
                                count={reactions}
                                className={liked !== 'none' ? style.liked : ''}
                                onClick={() => doLike()}
                                color="inherit"
                                data-testid="feed-image-like-button"
                                aria-label={t('feed.aria.showLikeOptions')}
                            >
                                {liked !== 'none' ? (
                                    <FavoriteIcon
                                        color="inherit"
                                        fontSize="large"
                                    />
                                ) : (
                                    <FavoriteBorderIcon
                                        color="inherit"
                                        fontSize="large"
                                    />
                                )}
                            </IconButtonDot>
                        )}
                        {!noComments && (
                            <IconButtonDot
                                count={content.getComments(id).length}
                                color="inherit"
                                onClick={doShowComments}
                                data-testid="feed-image-comment-button"
                                aria-label={t('feed.aria.showComments')}
                            >
                                <ChatBubbleOutlineIcon
                                    color="inherit"
                                    fontSize="large"
                                />
                            </IconButtonDot>
                        )}
                        {!noShare && (
                            <IconButtonDot
                                count={shares}
                                position="left"
                                color="inherit"
                                onClick={doShowSharePanel}
                                data-testid="feed-image-share-button"
                                aria-label={t('feed.aria.showShareOptions')}
                            >
                                <ReplyIcon
                                    color="inherit"
                                    fontSize="large"
                                    style={{ transform: 'scaleX(-1)' }}
                                />
                            </IconButtonDot>
                        )}
                    </div>
                )}
                {active && showLabels && activePanel === 'none' && (
                    <LabelsPanel labels={contentMeta.labels.filter((l) => l.weight > 0).map((l) => l.label)} />
                )}
                {active && activePanel === 'share' && (
                    <SharePanel
                        onClose={doCloseLike}
                        onChange={doShare}
                    />
                )}
                {active && activePanel === 'comment' && (
                    <CommentPanel
                        id={id}
                        onClose={doCloseLike}
                        onComment={doComment}
                        disabled={commentCount >= MAX_COMMENTS}
                    />
                )}
            </div>
        </div>
    );
}
