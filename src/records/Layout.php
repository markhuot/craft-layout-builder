<?php

namespace markhuot\layoutbuilder\records;

use craft\db\ActiveRecord;

class Layout extends ActiveRecord {

    /**
     * @inheritDoc
     */
    public static function tableName() {
        return '{{%layoutbuilder_layouts}}';
    }

    function toArray(array $fields = [], array $expand = [], $recursive = true) {
        $array = parent::toArray($fields, $expand, $recursive);
        $array['__typename'] = 'LayoutRecord';
        return $array;
    }

}