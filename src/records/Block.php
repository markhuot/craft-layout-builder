<?php

namespace markhuot\layoutbuilder\records;

use craft\db\ActiveRecord;

class Block extends ActiveRecord {

    /**
     * @inheritDoc
     */
    public static function tableName() {
        return '{{%layoutbuilder_blocks}}';
    }

}