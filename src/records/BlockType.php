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
            $this->setAttribute('handle', StringHelper::toKebabCase($this->getAttribute('title')));
        }

        return parent::beforeSave($insert);
    }

}