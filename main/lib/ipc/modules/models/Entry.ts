import { IpfsConnector, IpfsApiHelper } from '@akashaproject/ipfs-connector';
import * as Promise from 'bluebird';
import { isEmpty } from 'ramda';
import { entries } from './records';

export const DRAFT_BLOCKS = 'blocks';
export const ATOMIC_TYPE = 'atomic';
export const IMAGE_TYPE = 'image';
class IpfsEntry {
    hash: string;
    id: string;
    draft: any;
    title: string;
    excerpt: any;
    licence: string;
    featuredImage: any;
    tags: any[];

    /**
     *
     * @param content
     * @param tags
     * @returns {any}
     */
    create(content: any, tags: any[]) {
        const ipfsApiRequests = [];
        this.draft = Object.assign({}, content.draft);
        content.draft = null;
        this.title = content.title;
        this.licence = content.licence;
        this.tags = tags;
        ipfsApiRequests.push(
            IpfsConnector.getInstance().api
                .constructObjLink(content.featuredImage, true)
                .then((obj) => this.featuredImage = obj));

        ipfsApiRequests.push(
            IpfsConnector.getInstance().api
                .constructObjLink(content.excerpt)
                .then((obj) => this.excerpt = obj));

        return Promise.all(ipfsApiRequests).then(() => this._uploadMediaDraft()).then((draft) => {
            return IpfsConnector.getInstance().api
                .add({
                    draft: draft,
                    excerpt: this.excerpt,
                    featuredImage: this.featuredImage,
                    licence: this.licence,
                    tags: this.tags,
                    title: this.title
                })
        });
    }

    private _filterForImages() {
        const blockIndex = [];
        const imageEntities = this.draft[DRAFT_BLOCKS].filter((element, index) => {
            if (element.type !== ATOMIC_TYPE || isEmpty(element.data.type)) {
                return false;
            }
            if (element.data.type === IMAGE_TYPE) {
                blockIndex.push(index);
                return true;
            }
            return false;
        });

        return { blockIndex, imageEntities };
    }

    private _uploadMediaDraft() {
        /**
         * filter draft object for images and upload them to ipfs
         */
        const uploads = [];
        const { imageEntities, blockIndex } = this._filterForImages();

        imageEntities.forEach((element, index) => {
            const keys = Object.keys(element.data.files).sort();
            keys.forEach((imSize) => {
                if (!Buffer.isBuffer(element.data.files[imSize].src)) {
                    return false;
                }
                uploads.push(
                    IpfsConnector.getInstance().api
                        .add(element.data.files[imSize].src, true)
                        .then(
                            (obj) => {
                                this.draft[DRAFT_BLOCKS][blockIndex[index]].data.files[imSize].src = obj;
                            }
                        )
                );
            });
        });
        return Promise.all(uploads).then(() => {
            return IpfsConnector.getInstance().api.constructObjLink(Buffer.from(JSON.stringify(this.draft)), true);
        });
    }

    private _getMediaDraft() {
        /**
         * filter draft object for images and dowload them from ipfs
         * this will be used for serving Uin8array images
         */
    }

    /**
     *
     * @param hash
     * @returns {Entry}
     */
    load(hash: string) {
        this.hash = hash;
        return this;
    }

    /**
     *
     * @param setData
     * @returns {any}
     */
    update(setData: any) {
        if (!this.hash) {
            return Promise.reject('Must set hash property first');
        }
        return IpfsConnector.getInstance().api
            .updateObject(this.hash, setData)
            .then((hash: string) => {
                this.load(hash);
                return this.hash;
            })
    }

    /**
     *
     * @returns {any}
     */
    getShortContent() {
        if (entries.getShort(this.hash)) {
            return Promise.resolve(entries.getShort(this.hash));
        }
        return IpfsConnector.getInstance().api
            .get(this.hash)
            .then((data) => {
                return IpfsConnector.getInstance().api.resolve(data.excerpt[IpfsApiHelper.LINK_SYMBOL])
                    .then((excerpt) => {
                        data.excerpt = excerpt;
                        data.featuredImage = data.featuredImage[IpfsApiHelper.LINK_SYMBOL];
                        entries.setShort(this.hash, data);
                        return data;
                    });
            })
    }

    /**
     *
     * @returns {any}
     */
    getFullContent() {
        if (entries.getFull(this.hash)) {
            return Promise.resolve(entries.getFull(this.hash));
        }
        return IpfsConnector.getInstance().api
            .get(this.hash)
            .then((data) => {
                return IpfsConnector.getInstance().api.resolve(data.draft[IpfsApiHelper.LINK_SYMBOL])
                    .then((draft) => {
                        data.draft = (draft.toJSON()).data;
                        entries.setFull(this.hash, data);
                        return data;
                    });
            })
    }
}

export default IpfsEntry;
