<?php

namespace markhuot\layoutbuilder\elements\db;

use craft\elements\db\ElementQuery;
use craft\helpers\Db;

class BlockQuery extends ElementQuery {

    public $typeId;

    function blockType($handle) {
        $this->typeId = $handle;
        return $this;
    }

    function beforePrepare(): bool {
        $this->joinElementTable('layoutbuilder_blocks');
        $this->leftJoin('layoutbuilder_blocktypes', 'layoutbuilder_blocktypes.id=layoutbuilder_blocks.blockTypeId');

        $this->query->select([
            'layoutbuilder_blocks.blockTypeId',
        ]);

        $this->subQuery->andWhere(Db::parseParam('layoutbuilder_blocks.id', $this->id));
        // $this->subQuery->andWhere(Db::parseParam('layoutbuilder_blocktypes.id', $this->typeId));

        return parent::beforePrepare();
    }

}