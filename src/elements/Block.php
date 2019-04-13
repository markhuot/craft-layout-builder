<?php

namespace markhuot\layoutbuilder\elements;

use craft\base\Element;
use markhuot\layoutbuilder\elements\db\BlockQuery;
use markhuot\layoutbuilder\records\Block as BlockRecord;
use craft\elements\db\ElementQueryInterface;
use markhuot\LayoutBuilder\elements\db\RowQuery;
use markhuot\layoutbuilder\records\BlockType;

class Block extends Element {

    public $blockTypeId;

    static function find(): ElementQueryInterface {
        return new BlockQuery(static::class);
    }

    static function hasTitles(): bool
    {
        return true;
    }

    static function hasContent(): bool {
        return true;
    }

    function getCpEditUrl() {
        return 'blocks/'.$this->id;
    }

    function afterSave(bool $isNew) {
        if ($isNew) {
            $record = new BlockRecord;
            $record->id = $this->id;
        }
        else {
            $record = BlockRecord::findOne($this->id);
        }

        $record->blockTypeId = $this->blockTypeId;
        $record->save();

        parent::afterSave($isNew);
    }

    function extraFields() {
        $names = parent::extraFields();
        $names[] = 'type';
        return $names;
    }

    function getType() {
        return BlockType::findOne(['id' => $this->blockTypeId]);
    }

    /**
     * @inheritDoc
     */
    function toArray(array $fields = [], array $expand = [], $recursive = true) {
        $array = parent::toArray($fields, $expand, $recursive);
        $array['type'] = $this->type->toArray();
        return $array;
    }
}