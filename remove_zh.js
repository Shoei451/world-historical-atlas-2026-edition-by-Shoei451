const fs = require('fs');

let content = fs.readFileSync('js/regions.js', 'utf8');

// regions.jsの構造を仮定して編集
// region_list = [ ... ]

// 中国語のフィールドを削除する関数
function removeZhFields(str) {
    // 正規表現で中国語フィールドを削除
    // これは難しい。JavaScriptでパースする必要がある。

    // 簡単な方法: 文字列置換で "中国語", "@" を削除するが、正確ではない。

    // regions.jsをevalしてオブジェクトにする。
    // 危険だが、ローカルなのでOK。

    // まず、'use strict'; を削除
    let code = content.replace(/'use strict';/, '');

    // region_listをeval
    let region_list;
    eval('region_list = ' + code.match(/const region_list = \[[\s\S]*\];/)[0].replace('const region_list = ', '').replace(';', ''));

    // region_listを処理
    function processArray(arr) {
        if (Array.isArray(arr)) {
            return arr.map(item => {
                if (Array.isArray(item)) {
                    // サブ配列の場合
                    if (item.length >= 6 && typeof item[3] === 'string' && typeof item[4] === 'string') {
                        // [year1, year2, image, ja, en, zh, ...]
                        let newItem = item.slice(0, 3).concat(item.slice(3, 5)); // ja, en だけ
                        if (item.length > 6) {
                            // ja_short, en_short, zh_short がある場合
                            if (typeof item[6] === 'string' && typeof item[7] === 'string') {
                                newItem = newItem.concat(item.slice(6, 8)); // ja_short, en_short
                                if (item.length > 9) {
                                    newItem = newItem.concat(item.slice(9)); // x, y, z
                                }
                            } else {
                                newItem = newItem.concat(item.slice(6));
                            }
                        }
                        return newItem;
                    } else {
                        return item.map(processArray);
                    }
                } else {
                    return item;
                }
            });
        } else {
            return arr;
        }
    }

    region_list = processArray(region_list);

    // 書き戻す
    let newContent = "'use strict';\n\nconst region_list = " + JSON.stringify(region_list, null, '\t') + ";\n";

    fs.writeFileSync('js/regions.js', newContent);
}

removeZhFields();