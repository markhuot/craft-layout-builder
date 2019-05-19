<?php

namespace markhuot\layoutbuilder\records;

use craft\db\ActiveRecord;
use craft\helpers\StringHelper;

class BlockType extends ActiveRecord {

    static function tableName() {
        return '{{%layoutbuilder_blocktypes}}';
    }

    function beforeSave($insert) {
        if (empty($this->getAttribute('handle'))) {
            $this->setAttribute('handle', StringHelper::toCamelCase($this->getAttribute('title')));
        }

        return parent::beforeSave($insert);
    }

    function toArray(array $fields = [], array $expand = [], $recursive = true) {
        $array = parent::toArray($fields, $expand, $recursive);
        $array['__typename'] = 'BlockTypeRecord';
        return $array;
    }

}