<?php
namespace markhuot\LayoutBuilder\elements\db;

use craft\db\Query;
use craft\elements\db\ElementQuery;
use craft\helpers\Db;
use markhuot\LayoutBuilder\elements\Row;

class RowQuery extends ElementQuery
{
    public $elementId;
    public $fieldId;

    public function element($value)
    {
        $this->elementId = $value;

        return $this;
    }

    public function field($value)
    {
        $this->fieldId = $value;

        return $this;
    }

    protected function beforePrepare(): bool
    {
        // join in the products table
        $this->joinElementTable('layoutrows');

        // select the price column
        $this->query->select([
            'layoutrows.elementId',
            'layoutrows.fieldId',
        ]);

        if ($this->elementId) {
            $this->subQuery->andWhere(Db::parseParam('layoutrows.elementId', $this->elementId));
        }

        if ($this->fieldId) {
            $this->subQuery->andWhere(Db::parseParam('layoutrows.fieldId', $this->fieldId));
        }

        return parent::beforePrepare();
    }
}