const { Info, Candidate, UserStatistics } = require('./base');
const { DOCTYPE_USER_DATA, DOCTYPE_LAND_DATA, DOCTYPE_VOTE_DATA, UserDocument, LandDocument, VoteDocument } = require('./document');
const { BlockCityItem } = require('./item');
const { BlockCityFact } = require('./fact');
const { BlockCityGenerator } = require('./generator');

module.exports = {
    Info, Candidate, UserStatistics,
    DOCTYPE_USER_DATA, DOCTYPE_LAND_DATA, DOCTYPE_VOTE_DATA,
    UserDocument, LandDocument, VoteDocument,
    BlockCityItem, BlockCityFact,
    BlockCityGenerator
};