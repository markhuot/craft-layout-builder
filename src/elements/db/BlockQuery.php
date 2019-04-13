<?php

namespace markhuot\layoutbuilder\elements\db;

use craft\elements\db\ElementQuery;

class BlockQuery extends ElementQuery {

    function beforePrepare(): bool {
        $this->joinElementTable('layoutbuilder_blocks');

        $this->query->select([
            'layoutbuilder_blocks.blockTypeId',
        ]);

        return parent::beforePrepare();
    }

}