<?php

namespace markhuot\layoutbuilder\elements;

use Craft;
use craft\base\Element;
use markhuot\layoutbuilder\elements\db\LayoutQuery;
use craft\elements\db\ElementQueryInterface;
use markhuot\layoutbuilder\fields\LayoutBuilderCellData;
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

    /**
     * @inheritdoc
     */
    public function __get($name)
    {
        if (in_array($name, $this->getCellHandles())) {
            return $this->getCell($name);
        }

        return parent::__get($name);
    }

    /**
     * @inheritDoc
     */
    public function __isset($name): bool {
        if (in_array($name, $this->getCellHandles())) {
            return true;
        }

        return parent::__isset($name);
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
        return LayoutType::findOne(['id' => $this->layoutTypeId]) ?: new LayoutType;
    }

    function getCellHandles() {
        return array_merge(array_filter(array_map(function ($cell) {
            return @$cell['handle'];
        }, $this->getType()->cells)));
    }

    function getCells() {
        return array_map(function ($cell) {
            return (new LayoutBuilderCellData($cell))->withBlocks(@$this->blocks[$cell['uid']] ?: []);
        }, $this->getType()->cells);
    }

    function getCell($handle) {
        $cells = array_merge(array_filter($this->type->cells, function ($cell) use ($handle) {
            return $cell['handle'] === $handle;
        }));

        if (empty($cells)) {
            return false;
        }

        $cell = $cells[0];

        return (new LayoutBuilderCellData($cell))->withBlocks(@$this->blocks[$cell['uid']] ?: []);
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