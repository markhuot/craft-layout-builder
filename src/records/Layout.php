<?php

namespace markhuot\layoutbuilder\records;

use craft\db\ActiveRecord;
use craft\helpers\StringHelper;

class Layout extends ActiveRecord {

    static function tableName() {
        return '{{%layoutbuilder_layouts}}';
    }

    function beforeSave($insert) {
        if (empty($this->getAttribute('handle'))) {
            $this->setAttribute('handle', StringHelper::toKebabCase($this->getAttribute('title')));
        }

        return parent::beforeSave($insert);
    }

    function toArray(array $fields = [], array $expand = [], $recursive = true) {
        $array = parent::toArray($fields, $expand, $recursive);
        $array['cells'] = json_decode(@$array['cells'] ?: '[]', true);
        return $array;
    }

}