"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aeth_cycle_1 = require("./aeth-cycle");
const aeth_free_1 = require("./aeth-free");
const aeth_transfers_iterator_1 = require("./aeth-transfers-iterator");
const bond_aeth_1 = require("./bond-aeth");
const comments_count_1 = require("./comments-count");
const comments_iterator_1 = require("./comments-iterator");
const current_balance_1 = require("./current-balance");
const current_profile_1 = require("./current-profile");
const cycling_states_1 = require("./cycling-states");
const essence_iterator_1 = require("./essence-iterator");
const follow_profile_1 = require("./follow-profile");
const followers_count_1 = require("./followers-count");
const followers_iterator_1 = require("./followers-iterator");
const following_count_1 = require("./following-count");
const following_iterator_1 = require("./following-iterator");
const get_profile_list_1 = require("./get-profile-list");
const ipfs_1 = require("./ipfs");
const is_follower_1 = require("./is-follower");
const mana_burned_1 = require("./mana-burned");
const profile_data_1 = require("./profile-data");
const ranking_1 = require("./ranking");
const resolve_ethaddress_1 = require("./resolve-ethaddress");
const resolve_profile_ipfs_hash_1 = require("./resolve-profile-ipfs-hash");
const send_tip_1 = require("./send-tip");
const toggle_donations_1 = require("./toggle-donations");
const transfer_1 = require("./transfer");
const transform_essence_1 = require("./transform-essence");
const unfollow_profile_1 = require("./unfollow-profile");
const update_profile_1 = require("./update-profile");
const votes_iterator_1 = require("./votes-iterator");
const constants_1 = require("@akashaproject/common/constants");
const init = function init(sp, getService) {
    const currentBalance = current_balance_1.default(sp, getService);
    const commentsCount = comments_count_1.default(sp, getService);
    const commentsIterator = comments_iterator_1.default(sp, getService);
    const followProfile = follow_profile_1.default(sp, getService);
    const getCurrentProfile = current_profile_1.default(sp, getService);
    const followersCount = followers_count_1.default(sp, getService);
    const followingCount = following_count_1.default(sp, getService);
    const profileData = profile_data_1.default(sp, getService);
    const getByAddress = resolve_ethaddress_1.default(sp, getService);
    const unFollowProfile = unfollow_profile_1.default(sp, getService);
    const updateProfileData = update_profile_1.default(sp, getService);
    const followersIterator = followers_iterator_1.default(sp, getService);
    const followingIterator = following_iterator_1.default(sp, getService);
    const isFollower = is_follower_1.default(sp, getService);
    const getProfileList = get_profile_list_1.default(sp, getService);
    const sendTip = send_tip_1.default(sp, getService);
    const resolveProfileIpfsHash = resolve_profile_ipfs_hash_1.default(sp, getService);
    const toggleDonations = toggle_donations_1.default(sp, getService);
    const bondAeth = bond_aeth_1.default(sp, getService);
    const cycleAeth = aeth_cycle_1.default(sp, getService);
    const freeAeth = aeth_free_1.default(sp, getService);
    const transformEssence = transform_essence_1.default(sp, getService);
    const manaBurned = mana_burned_1.default(sp, getService);
    const cyclingStates = cycling_states_1.default(sp, getService);
    const transfer = transfer_1.default(sp, getService);
    const transfersIterator = aeth_transfers_iterator_1.default(sp, getService);
    const essenceIterator = essence_iterator_1.default(sp, getService);
    const votesIterator = votes_iterator_1.default(sp, getService);
    const karmaRanking = ranking_1.default(sp, getService);
    ipfs_1.default(sp, getService);
    return {
        [constants_1.PROFILE_MODULE.getBalance]: currentBalance,
        [constants_1.PROFILE_MODULE.getCommentsCount]: commentsCount,
        [constants_1.PROFILE_MODULE.commentsIterator]: commentsIterator,
        [constants_1.PROFILE_MODULE.followProfile]: followProfile,
        [constants_1.PROFILE_MODULE.followersCount]: followersCount,
        [constants_1.PROFILE_MODULE.followingCount]: followingCount,
        [constants_1.PROFILE_MODULE.profileData]: profileData,
        [constants_1.PROFILE_MODULE.unFollowProfile]: unFollowProfile,
        [constants_1.PROFILE_MODULE.updateProfileData]: updateProfileData,
        [constants_1.PROFILE_MODULE.followersIterator]: followersIterator,
        [constants_1.PROFILE_MODULE.followingIterator]: followingIterator,
        [constants_1.PROFILE_MODULE.isFollower]: isFollower,
        [constants_1.PROFILE_MODULE.getProfileList]: getProfileList,
        [constants_1.PROFILE_MODULE.sendTip]: sendTip,
        [constants_1.PROFILE_MODULE.resolveProfileIpfsHash]: resolveProfileIpfsHash,
        [constants_1.PROFILE_MODULE.toggleDonations]: toggleDonations,
        [constants_1.PROFILE_MODULE.bondAeth]: bondAeth,
        [constants_1.PROFILE_MODULE.cycleAeth]: cycleAeth,
        [constants_1.PROFILE_MODULE.freeAeth]: freeAeth,
        [constants_1.PROFILE_MODULE.transformEssence]: transformEssence,
        [constants_1.PROFILE_MODULE.manaBurned]: manaBurned,
        [constants_1.PROFILE_MODULE.cyclingStates]: cyclingStates,
        [constants_1.PROFILE_MODULE.transfer]: transfer,
        [constants_1.PROFILE_MODULE.transfersIterator]: transfersIterator,
        [constants_1.PROFILE_MODULE.essenceIterator]: essenceIterator,
        [constants_1.PROFILE_MODULE.votesIterator]: votesIterator,
        [constants_1.PROFILE_MODULE.karmaRanking]: karmaRanking,
        [constants_1.PROFILE_MODULE.getByAddress]: getByAddress,
        [constants_1.PROFILE_MODULE.getCurrentProfile]: getCurrentProfile,
    };
};
const app = {
    init,
    moduleName: constants_1.PROFILE_MODULE.$name,
};
exports.default = app;
//# sourceMappingURL=index.js.map