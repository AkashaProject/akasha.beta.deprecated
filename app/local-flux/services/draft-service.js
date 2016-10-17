import debug from 'debug';
import entriesDB from './db/entry';

const dbg = debug('App:DraftService:');

class DraftService {
    constructor () {
        this.listeners = {};
    }
    saveDraft = partialDraft =>
        entriesDB.transaction('rw', entriesDB.drafts, () => {
            if (partialDraft.id) {
                return entriesDB.drafts.update(partialDraft.id, partialDraft).then((updated) => {
                    dbg('draft ', partialDraft.id, 'updated');
                    if (updated) {
                        return partialDraft;
                    }
                    return null;
                });
            }
            return entriesDB.drafts.add(partialDraft).then((draftId) => {
                dbg('draft with id', draftId, 'created');
                return partialDraft;
            });
        });
    getAllDrafts = username =>
        entriesDB.transaction('rw', entriesDB.drafts, () =>
            entriesDB.drafts
                     .where('authorUsername')
                     .equals(username)
                     .toArray()
                     .then((drafts) => {
                         dbg('getAllDrafts', drafts);
                         const convDrafts = drafts.map(draft =>
                             Object.assign({}, draft)
                         );
                         return convDrafts;
                     })
        );
    getDraftsCount = username =>
        entriesDB.transaction('rw', entriesDB.drafts, () =>
            entriesDB.drafts.where('authorUsername').equals(username).count()
        )
    // get resource by id (drafts or entries);
    getById = (table, id) =>
        entriesDB.transaction('r', entriesDB[table], () => {
            dbg('getById from', table, 'with id', id);
            return entriesDB[table]
                    .where('id')
                    .equals(parseInt(id, 10))
                    .first();
        });
}

export { DraftService };
