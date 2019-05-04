<?php

namespace markhuot\layoutbuilder\elements;

use craft\base\Element;
use markhuot\layoutbuilder\elements\db\LayoutQuery;
use craft\elements\db\ElementQueryInterface;
use markhuot\layoutbuilder\records\Layout as LayoutRecord;
use markhuot\layoutbuilder\records\LayoutType;

class Layout extends Element {

    public $layoutTypeId;
    protected $blocks = [];

    static function find(): ElementQueryInterface {
        return new LayoutQuery(static::class);
    }

    static function hasTitles(): bool {
        return false;
    }

    static function hasContent(): bool {
        return true;
    }

    function getCpEditUrl() {
        return 'layout/'.$this->id;
    }

    function afterSave(bool $isNew) {
        if ($isNew) {
            $record = new LayoutRecord;
            $record->id = $this->id;
        }
        else {
            $record = LayoutRecord::findOne($this->id);
        }

        $record->layoutTypeId = $this->layoutTypeId;
        $record->save();

        parent::afterSave($isNew);
    }

    function extraFields() {
        $names = parent::extraFields();
        $names[] = 'type';
        return $names;
    }

    function getType() {
        return LayoutType::findOne(['id' => $this->layoutTypeId]);
    }

    /**
     * Add in block data from a field instance
     *
     * @param array $blocks
     * @return $this
     */
    function withBlocks(array $blocks) {
        $this->blocks = $blocks;
        return $this;
    }

    /**
     * @inheritDoc
     */
    function toArray(array $fields = [], array $expand = [], $recursive = true) {
        $array = parent::toArray($fields, $expand, $recursive);
        $array['__typename'] = 'Layout';
        $array['type'] = $this->type->toArray();
        $array['blocks'] = array_map(function ($cell) {
            return array_map(function ($block) {
                return $block->toArray();
            }, $cell);
        }, $this->blocks);
        return $array;
    }
}