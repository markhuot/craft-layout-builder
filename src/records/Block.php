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

    function toArray(array $fields = [], array $expand = [], $recursive = true) {
        $array = parent::toArray($fields, $expand, $recursive);
        $array['__typename'] = 'BlockRecord';
        return $array;
    }

}