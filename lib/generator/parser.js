/*
    mitum-js-util SDK for mitum-currency, mitum-document
    Copyright (C) 2021-2022 ProtoconNet

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/**
 * @class
 * JSONParser helps generate json string and json file from dictionary type object.
 * @method toJSONString
 * @method generateFile
 */
const JSONParser = {

    toJSONString: (seal) => {
        return JSON.stringify(seal, null, 4);
    },

    /**
     * @param {object} seal 
     * @param {string} fName 
     */
    getFile: (seal, fName) => {
        const fs = require('fs');
        fs.writeFile(fName, JSON.stringify(seal, null, 4), (error) => {
            if (error) {
                throw "[ERROR] create file " + fName + "; fail\n" + error
            }
            else {
                console.log("create file " + fName + "; success");
            }
        });
    },
};

module.exports = {
    JSONParser,
}