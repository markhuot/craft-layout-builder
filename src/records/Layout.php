<?php

namespace markhuot\layoutbuilder\records;

use craft\db\ActiveRecord;
use craft\helpers\StringHelper;
use markhuot\layoutbuilder\fields\LayoutBuilderCellData;

/**
 * Class Layout
 * @package markhuot\layoutbuilder\records
 * @property string $title
 * @property string $handle
 * @property string $icon
 * @property LayoutBuilderCellData[] $cells
 * @property bool $useCustomCss
 * @property string $customCss
 */
class Layout extends ActiveRecord {

    protected $blocks;

    static function tableName() {
        return '{{%layoutbuilder_layouts}}';
    }

    function beforeSave($insert) {
        if (empty($this->getAttribute('handle'))) {
            $this->setAttribute('handle', StringHelper::toKebabCase($this->getAttribute('title')));
        }

        return parent::beforeSave($insert);
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
    function __get($name) {
        if (method_exists($this, 'get'.ucfirst($name).'Attribute')) {
            return $this->{'get'.ucfirst($name).'Attribute'}();
        }

        return parent::__get($name);
    }

    /**
     * Override the cells away from a the default JSON storage
     */
    function getCellsAttribute() {
        return array_map(function ($cell) {
            return (new LayoutBuilderCellData($cell))->withBlocks(@$this->blocks[$cell['uid']] ?: []);
        }, json_decode($this->getAttribute('cells'), true));
    }

    function toArray(array $fields = [], array $expand = [], $recursive = true) {
        $array = parent::toArray($fields, $expand, $recursive);
        $array['__typename'] = 'LayoutRecord';
        $array['cells'] = array_map(function ($cell) { return $cell->toArray(); }, $this->getCellsAttribute());
        return $array;
    }

}