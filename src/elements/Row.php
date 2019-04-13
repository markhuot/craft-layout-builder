<?php

namespace markhuot\LayoutBuilder\elements;

use craft\base\Element;
use craft\elements\db\ElementQueryInterface;
use markhuot\LayoutBuilder\elements\db\RowQuery;

class Row extends Element
{
    public $elementId;
    public $fieldId;

    function afterSave(bool $isNew)
    {
        if ($isNew) {
            \Craft::$app->db->createCommand()
                ->insert('{{%layoutrows}}', [
                    'id' => $this->id,
                    'elementId' => $this->elementId,
                    'fieldId' => $this->fieldId,
                ])
                ->execute();
        } else {
            \Craft::$app->db->createCommand()
                ->update('{{%layoutrows}}', [
                    'elementId' => $this->elementId,
                    'fieldId' => $this->fieldId,
                ], ['id' => $this->id])
                ->execute();
        }

        parent::afterSave($isNew);
    }

    static function find(): ElementQueryInterface {
        return new RowQuery(static::class);
    }

    static function hasContent(): bool {
        return true;
    }

    public function getFieldLayout() {
        return \Craft::$app->fields->getLayoutByType(static::class);
    }
}